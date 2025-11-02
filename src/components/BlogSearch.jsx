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

  tags = tags.filter((tag) => !tag.includes("series"));

  // initialize visibleIds to show the initial list
  useEffect(() => {
    const ids = new Set((displayed || []).map((p) => p.id));
    setVisibleIds(ids);
    // cleanup on unmount
    return () => clearAllTimeouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // helper to compute filtered posts for a tag
  const filterForTag = (tag) => {
    if (!tag) return posts;
    if (tag === "series") {
      // match posts that have any "series" indication (we excluded tags with 'series' previously)
      return posts.filter((post) => {
        const seriesTag = post.data?.seriestag || null;
        return seriesTag;
      });
    }
    return posts.filter((post) => {
      const raw = post.data?.tags ?? post.tags;
      if (!raw) return false;
      if (Array.isArray(raw)) {
        if (!tag.includes("-series")) {
          if (raw.some((t) => t.includes("-series"))) {
            return false;
          }
        }
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

    // start fade-out of currently displayed items
    setIsFadingOut(true);
    setShowNoResults(false);

    const FADE_OUT_MS = 300;
    const STAGGER_MS = 120;

    // after fade-out, replace list and stagger fade-in
    const t = setTimeout(() => {
      setIsFadingOut(false);

      const filtered = filterForTag(tag);
      setDisplayed(filtered);
      setActiveTag(tag);

      if (!filtered || filtered.length === 0) {
        // show "no posts found" message with a tiny delay to allow transition
        setVisibleIds(new Set());
        const tNo = setTimeout(() => setShowNoResults(true), 20);
        timeouts.current.push(tNo);
        return;
      }

      // prepare to stagger in the new items
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

  // read "tag" from the URL query and use selectTag so we keep animations consistent
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

  // render helpers for styles
  const itemTransitionStyle = (postId) => {
    const base = {
      transition: "opacity 300ms ease, transform 300ms ease",
      opacity: 0,
      transform: "translateY(6px)",
    };

    if (isFadingOut) {
      return {
        ...base,
        opacity: 0,
        transform: "translateY(-8px)",
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
    <div>
      <div style={{ marginBottom: 12 }}>
        <a
          href="/blog"
          onClick={(e) => {
            e.preventDefault();
            selectTag("");
          }}
          aria-current={activeTag === "" ? "page" : undefined}
          style={{ fontWeight: activeTag === "" ? "700" : "400" }}
        >
          all
        </a>{" "}
        |{" "}
        <a
          href="/blog?tag=series"
          onClick={(e) => {
            e.preventDefault();
            selectTag("series");
          }}
          aria-current={activeTag === "series" ? "page" : undefined}
          style={{
            marginLeft: 8,
            marginRight: 8,
            fontWeight: activeTag === "series" ? "700" : "400",
          }}
        >
          series
        </a>
        {tags.map((tag) => (
          <span key={tag}>
            {" | "}
            <a
              href={`/blog/tag/${tag}`}
              onClick={(e) => {
                e.preventDefault();
                selectTag(tag);
              }}
              aria-current={activeTag === tag ? "page" : undefined}
              style={{
                marginLeft: 8,
                marginRight: 8,
                fontWeight: activeTag === tag ? "700" : "400",
              }}
            >
              {tag}
            </a>
          </span>
        ))}
      </div>

      <ul>
        {/* if there are visible posts, show them with animation */}
        {displayed.length === 0 ? (
          <li
            style={{
              transition: "opacity 300ms ease, transform 300ms ease",
              opacity: showNoResults && !isFadingOut ? 1 : 0,
              transform:
                showNoResults && !isFadingOut
                  ? "translateY(0)"
                  : "translateY(6px)",
            }}
          >
            no posts found for tag {'"'}
            {activeTag}
            {'"'}.
          </li>
        ) : (
          // animate size changes (height/width) via CSS transitions.
          // use a conservative maxHeight based on item count so height changes animate smoothly.
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
                    className="p-4 rounded-lg bg-purple-900/20 border border-purple-500/20 transition-transform duration-200 ease-out hover:scale-[1.02]"
                    style={itemTransitionStyle(post.id)}
                  >
                    <p>
                      <a href={`/blog/${post.id}`}>{post.data?.title}</a> (
                      {post.data?.date})
                      <br />
                      tags: [
                      {postTags.sort().map((tag, i) => (
                        <span key={post.id + tag}>
                          <a
                            href={`/blog/tag/${tag}`}
                            onClick={(e) => {
                              e.preventDefault();
                              selectTag(tag);
                            }}
                            aria-current={
                              activeTag === tag ? "page" : undefined
                            }
                            style={{
                              fontWeight: activeTag === tag ? "700" : "400",
                            }}
                          >
                            {tag}
                          </a>
                          {i < postTags.length - 1 && (
                            <span style={{ color: "white" }}>, </span>
                          )}
                        </span>
                      ))}
                      ]<br />
                      {seriesTag && (
                        <>
                          series tag:{" "}
                          <a
                            href={`/blog?tag=${seriesTag}`}
                            onClick={(e) => {
                              e.preventDefault();
                              selectTag(seriesTag);
                            }}
                            aria-current={
                              activeTag === seriesTag ? "page" : undefined
                            }
                            style={{
                              fontWeight:
                                activeTag === seriesTag ? "700" : "400",
                            }}
                          >
                            {seriesTag}
                          </a>
                          <br />
                        </>
                      )}
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
