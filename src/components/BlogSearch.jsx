"use client";

import { useEffect, useMemo, useState } from "react";

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
  tags = tags.filter((t) => t !== "series");

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
          <li>No posts found.</li>
        ) : (
          <div className="space-y-5 md:w-4/5">
            <ul>
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
                if (postTags.includes("series")) return null;

                return (
                  <li key={post.id} className="py-2">
                    <p>
                      <a href={`/blog/${post.id}`}>{post.data?.title}</a> (
                      {post.data?.date})
                      <br />
                      tags: [
                      {postTags.sort().map((tag, i) => (
                        <a
                          href={`/blog/tag/${tag}`}
                          key={post.id + tag}
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTag(tag);
                          }}
                          aria-current={activeTag === tag ? "page" : undefined}
                          style={{
                            fontWeight: activeTag === tag ? "700" : "400",
                          }}
                        >
                          {i < postTags.length - 1 ? tag + ", " : tag}
                        </a>
                      ))}
                      ]<br />
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
