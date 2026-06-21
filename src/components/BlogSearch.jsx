"use client";

import { useEffect, useRef, useState } from "react";

export default function BlogSearch({ posts = [] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [displayed, setDisplayed] = useState(posts); // currently rendered list (changes after fade-out)
  const [visibleIds, setVisibleIds] = useState(new Set()); // which items are visible (for staggered fade-in)
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const timeouts = useRef([]);

  // helper to clear pending timeouts
  const clearAllTimeouts = () => {
    timeouts.current.forEach((t) => clearTimeout(t));
    timeouts.current = [];
  };

  // compute tags (same logic as before)
  let tags = Array.from(
    new Set(
      posts.flatMap((post) => {
        const raw = post.data?.tags;
        if (Array.isArray(raw)) return raw;
        if (typeof raw === "string")
          return raw
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        return [];
      }),
    ),
  ).sort();

  tags = tags.filter((tag) => !tag.toLowerCase().includes("series"));

  // initialize visibleIds to show the initial list with stagger
  useEffect(() => {
    clearAllTimeouts();
    setVisibleIds(new Set());
    const STAGGER_MS = 100;
    (displayed || []).forEach((post, i) => {
      const tt = setTimeout(
        () => {
          setVisibleIds((prev) => {
            const next = new Set(prev);
            next.add(post.id);
            return next;
          });
        },
        i * STAGGER_MS + 20,
      );
      timeouts.current.push(tt);
    });
    return () => clearAllTimeouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // helper to compute filtered posts for a tag
  const filterForTag = (tag) => {
    if (!tag) return posts;
    if (tag === "series") {
      return posts.filter((post) => {
        const seriesTag = post.data?.seriestag || null;
        return seriesTag;
      });
    }
    return posts.filter((post) => {
      const raw = post.data?.tags ?? post.tags;
      if (!raw) return false;
      if (Array.isArray(raw)) {
        return raw.includes(tag);
      }
      if (typeof raw === "string") {
        return raw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .includes(tag);
      }
      return false;
    });
  };

  // main transition function used by clicks and URL-sync:
  const selectTag = (tag) => {
    if (tag === activeTag) return;
    clearAllTimeouts();

    setIsFadingOut(true);
    setShowNoResults(false);

    const FADE_OUT_MS = 250;
    const STAGGER_MS = 100;

    const t = setTimeout(() => {
      setIsFadingOut(false);

      const filtered = filterForTag(tag);
      setDisplayed(filtered);
      setActiveTag(tag);

      if (!filtered || filtered.length === 0) {
        setVisibleIds(new Set());
        const tNo = setTimeout(() => setShowNoResults(true), 20);
        timeouts.current.push(tNo);
        return;
      }

      setVisibleIds(new Set());
      filtered.forEach((post, i) => {
        const tt = setTimeout(
          () => {
            setVisibleIds((prev) => {
              const next = new Set(prev);
              next.add(post.id);
              return next;
            });
          },
          i * STAGGER_MS + 20,
        );
        timeouts.current.push(tt);
      });
    }, FADE_OUT_MS);

    timeouts.current.push(t);
  };

  useEffect(() => {
    const syncTagFromUrl = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlTag = params.get("tag") ?? "";
        selectTag(urlTag);
      } catch (e) {
        // ignore
      }
    };

    syncTagFromUrl();
    window.addEventListener("popstate", syncTagFromUrl);
    return () => window.removeEventListener("popstate", syncTagFromUrl);
  }, []); // run once on mount

  const itemTransitionStyle = (postId) => {
    const base = {
      transition:
        "opacity 300ms cubic-bezier(0.16, 1, 0.3, 1), transform 300ms cubic-bezier(0.16, 1, 0.3, 1)",
      opacity: 0,
      transform: "translateY(12px)",
    };

    if (isFadingOut) {
      return {
        ...base,
        opacity: 0,
        transform: "translateY(-12px)",
      };
    }

    if (visibleIds.has(postId)) {
      return {
        ...base,
        opacity: 1,
        transform: "translateY(0)",
      };
    }

    return base;
  };

  return (
    <div className="space-y-6">
      {/* Category Pills Menu */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => selectTag("")}
          className={`text-xs md:text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-300 border ${
            activeTag === ""
              ? "bg-purple-500/25 text-purple-900 dark:text-purple-200 border-purple-500/35 shadow-sm shadow-purple-500/5"
              : "bg-purple-500/5 hover:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/5 hover:text-purple-900 dark:hover:text-white"
          }`}
          aria-current={activeTag === "" ? "page" : undefined}
        >
          ALL
        </button>

        <button
          onClick={() => selectTag("series")}
          className={`text-xs md:text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-300 border ${
            activeTag === "series"
              ? "bg-purple-500/25 text-purple-900 dark:text-purple-200 border-purple-500/35 shadow-sm shadow-purple-500/5"
              : "bg-purple-500/5 hover:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/5 hover:text-purple-900 dark:hover:text-white"
          }`}
          aria-current={activeTag === "series" ? "page" : undefined}
        >
          SERIES
        </button>

        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => selectTag(tag)}
            className={`text-xs md:text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-300 border ${
              activeTag === tag
                ? "bg-purple-500/25 text-purple-900 dark:text-purple-200 border-purple-500/35 shadow-sm shadow-purple-500/5"
                : "bg-purple-500/5 hover:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/5 hover:text-purple-900 dark:hover:text-white"
            }`}
            aria-current={activeTag === tag ? "page" : undefined}
          >
            {tag.toUpperCase()}
          </button>
        ))}
      </div>

      <ul>
        {displayed.length === 0 ? (
          <li
            className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/10 text-center text-gray-600 dark:text-gray-400"
            style={{
              transition: "opacity 300ms ease, transform 300ms ease",
              opacity: showNoResults && !isFadingOut ? 1 : 0,
              transform:
                showNoResults && !isFadingOut
                  ? "translateY(0)"
                  : "translateY(6px)",
            }}
          >
            No posts found for tag &quot;{activeTag}&quot;.
          </li>
        ) : (
          <div
            className="space-y-5"
            style={{
              transition:
                "max-height 300ms ease, width 300ms ease, height 300ms ease",
              willChange: "max-height, width, height",
              overflow: "hidden",
            }}
          >
            <ul className="space-y-6 my-6">
              {displayed.map((post) => {
                if (!post) return null;
                const raw = post.data?.tags ?? post.tags ?? [];
                const postTags = Array.isArray(raw)
                  ? raw
                  : typeof raw === "string"
                    ? raw
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    : [];

                const seriesTag = post.data?.seriestag || "";
                if (seriesTag && !postTags.includes(seriesTag)) {
                  postTags.push(seriesTag);
                }

                return (
                  <li
                    key={post.id}
                    className="p-3 pb-4 rounded-2xl bg-purple-500/5 border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5 hover:translate-y-[-2px] flex flex-col"
                    style={itemTransitionStyle(post.id)}
                  >
                    <div className="flex flex-wrap gap-2.5 items-center text-xs text-purple-800 dark:text-purple-300">
                      <span>{post.data?.date}</span>
                      <span>•</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[...postTags]
                          .sort((a, b) => {
                            if (activeTag === "series") {
                              const aHas = a.toLowerCase().includes("-series");
                              const bHas = b.toLowerCase().includes("-series");
                              if (aHas && !bHas) return -1;
                              if (!aHas && bHas) return 1;
                            }
                            return a.localeCompare(b);
                          })
                          .map((tag) => (
                            <button
                              key={post.id + tag}
                              onClick={(e) => {
                                e.preventDefault();
                                selectTag(tag);
                              }}
                              className={`px-2 py-0.5 rounded-md text-[0.68rem] font-bold uppercase tracking-wider transition-all border ${
                                activeTag === "series"
                                  ? tag.toLowerCase().includes("-series")
                                    ? "bg-purple-500/25 border-purple-500/40 text-purple-900 dark:text-purple-200"
                                    : "bg-purple-500/5 border-purple-500/10 text-purple-800 dark:text-purple-300 hover:bg-purple-500/15"
                                  : activeTag === tag
                                    ? "bg-purple-500/25 border-purple-500/40 text-purple-900 dark:text-purple-200"
                                    : "bg-purple-500/5 border-purple-500/10 text-purple-800 dark:text-purple-300 hover:bg-purple-500/15"
                              }`}
                            >
                              {tag}
                            </button>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl md:text-2xl font-bold tracking-tight text-purple-900 dark:text-purple-100 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                        <a href={`/blog/${post.id}`}>{post.data?.title}</a>
                      </h3>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl text-pretty">
                      {post.data?.description}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </ul>
    </div>
  );
}
