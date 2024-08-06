"use client"

import {useState, useEffect} from "react";
import { rehype } from "rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeCodeLines from "rehype-highlight-code-lines";

import DOMPurify from "dompurify";

import { renderToString } from "react-dom/server";

export function BlogCode({children, language, ...props}) {
    const [code, setCode] = useState("");

    children = `<pre className="text-base lg: text-lg"><code className="language-${language}">${renderToString(children)}</code></pre>`;
    useEffect(() => {
        (async () => {
            const code = await rehype().data('settings', {fragment: true}).use(rehypeHighlight).use(rehypeCodeLines, {
                showLineNumbers: true,
                lineContainerTagName: 'div',
            }).process(children);
            const cleanCode = DOMPurify.sanitize(code.toString());
            setCode(cleanCode);
        })();
    }, [])

    if(code === "") {
        return <div>Loading...</div>
    }

    return (
        <>
        <br />
        <div className="" dangerouslySetInnerHTML={{__html: code.toString()}} />
        <br />
        </>
    );

}