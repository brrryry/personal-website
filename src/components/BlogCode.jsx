"use client";

import { useState, useEffect } from "react";
import { rehype } from "rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeCodeLines from "rehype-highlight-code-lines";

import DOMPurify from "dompurify";

import { renderToString } from "react-dom/server";

const escapeMap = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&#x27;',
};


const decodeMap = {
  '&quot;': '"',
  '&#x27;': "'",
  '&lt;': '<',
  '&gt;': '>',
  '&amp;': '&',
};

export function BlogCode({ children, language, ...props }) {
  const [code, setCode] = useState("");

  children = `<pre className="text-base lg: text-lg"><code className="language-${language}">${renderToString(children)}</code></pre>`;
  useEffect(() => {
    (async () => {
      const code = await rehype()
        .data("settings", { fragment: true })
        .use(rehypeHighlight)
        .use(rehypeCodeLines, {
          showLineNumbers: true,
          lineContainerTagName: "div",
        })
        .process(children);
      const cleanCode = DOMPurify.sanitize(code.toString());
      setCode(cleanCode);
    })();
  }, []);

  if (code === "") {
    return <div>Loading...</div>;
  }

  return (
    <>
      <br />
        <div className="flex justify-between items-center p-1 my-1 hljs-header">
          <p className="text-sm mx-2">{language}</p>
          <button
            className="text-sm bg-blue-500 text-white py-1 px-3 mx-2 rounded"
            onClick={() => {
              let cleanChildren = children.replaceAll("&quot;", '"').replaceAll("&#x27;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");
              let cleanChildrenSplit = cleanChildren.split("\n");
              cleanChildren = cleanChildrenSplit.slice(1, -1).join("\n");
              navigator.clipboard.writeText(cleanChildren);
            }}
          >
            Copy
          </button>
        </div>
        <div className="" dangerouslySetInnerHTML={{ __html: code }} />
      <br />
    </>
  );
}
