"use client";

import { useState, useEffect } from "react";
import { rehype } from "rehype";
import rehypeHighlight from "rehype-highlight";

import DOMPurify from "dompurify";

import { renderToString } from "react-dom/server";

const escapeMap = {
  "<": "&lt;",
  ">": "&gt;",
  "&": "&amp;",
  '"': "&quot;",
  "'": "&#x27;",
};

const decodeMap = {
  "&quot;": '"',
  "&#x27;": "'",
  "&lt;": "<",
  "&gt;": ">",
  "&amp;": "&",
};

export function BlogCode({
  children,
  title,
  language,
  copy = "true",
  ...props
}) {
  const [code, setCode] = useState("");

  // Convert children into raw HTML with preserved formatting
  children = `<pre className="text-base lg: text-lg"><code className="language-${language}">${renderToString(children.split("\n").slice(1).join("\n"))}</code></pre>`; //the extensive children part is to remove a blank newline

  useEffect(() => {
    (async () => {
      const code = await rehype()
        .data("settings", { fragment: true })
        .use(rehypeHighlight)
        .process(children);
      const cleanCode = DOMPurify.sanitize(code.toString());
      setCode(cleanCode);
    })();
  }, [children]);

  // This will ensure newlines are respected when copied to clipboard
  const handleCopy = () => {
    let cleanChildren = children
      .replaceAll("&quot;", '"')
      .replaceAll("&#x27;", "'")
      .replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">")
      .replaceAll("&amp;", "&");

    // Clean the code string and replace newlines with actual line breaks
    let cleanChildrenSplit = cleanChildren.split("\n");
    cleanChildren = cleanChildrenSplit.slice(1, -1).join("\n");

    navigator.clipboard.writeText(cleanChildren);
  };

  if (code === "") {
    return <div>Loading...</div>;
  }

  return (
    <>
      <br />
      <div className="flex justify-between items-center p-1 my-1 hljs-header">
        <p className="text-sm mx-2 py-3">
          {title ? `${title} (${language})` : language}
        </p>
        {copy == "true" && (
          <button
            className="text-sm bg-blue-500 text-white py-1 px-3 mx-2 rounded"
            onClick={handleCopy}
          >
            Copy
          </button>
        )}
      </div>
      <div className="" dangerouslySetInnerHTML={{ __html: code }} />
      <br />
    </>
  );
}
