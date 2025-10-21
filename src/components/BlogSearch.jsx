"use client";

import { useEffect, useState } from "react";

export default function BlogSearch({ posts = [] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [results, setResults] = useState(posts);

  let tags = Array.from(
    new Set(
      posts.flatMap((post) => {
        // remove content from post
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

  // read "tag" from the URL query and set activeTag if applicable
  useEffect(() => {
    const syncTagFromUrl = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlTag = params.get("tag") ?? "";
        if (!urlTag) {
          setActiveTag("");
          return;
        }
        // only set if the tag exists in the computed tags list
        setActiveTag(urlTag);
      } catch (e) {
        // ignore any URL parsing errors
      }
    };

    syncTagFromUrl();
    window.addEventListener("popstate", syncTagFromUrl);
    return () => window.removeEventListener("popstate", syncTagFromUrl);
  }, []);

  useEffect(() => {
    if (!activeTag) {
      setResults(posts);
      return;
    }
    const filtered = posts.filter((post) => {
      const raw = post.data?.tags ?? post.tags;
      if (!raw) return false;
      if (Array.isArray(raw)) return raw.includes(activeTag);
      if (typeof raw === "string") {
        return raw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .includes(activeTag);
      }
      return false;
    });
    setResults(filtered);
  }, [activeTag]);

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <a
          href="/blog"
          onClick={(e) => {
            e.preventDefault();
            setActiveTag("");
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
            setActiveTag("series");
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
                setActiveTag(tag);
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
        {results.length === 0 ? (
          <li>
            no posts found for tag {'"'}
            {activeTag}
            {'"'}.
          </li>
        ) : (
          <div className="space-y-5 md:w-4/5">
            <ul className="space-y-6 my-6">
              {results.map((post) => {
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

                const seriesTag = post.data.seriestag || "";
                if (seriesTag && !postTags.includes(seriesTag)) {
                  postTags.push(seriesTag);
                }

                return (
                  <li
                    key={post.id}
                    className="p-4 rounded-lg bg-purple-900/20 border border-purple-500/20 transition-transform duration-200 ease-out hover:scale-[1.02]"
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
                              setActiveTag(tag);
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
                              setActiveTag(seriesTag);
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
