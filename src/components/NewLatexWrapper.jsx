import React from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

// install katex first: npm install katex

export function NewLatexWrapper({
  children,
  displayMode = false,
  className = "",
  style = {},
  width,
  ...props
}) {
  // allow <LatexWrapper>\alpha_0</LatexWrapper>
  const getTextFromChildren = (nodes) => {
    let out = "";
    React.Children.forEach(nodes, (child) => {
      if (child == null) return;
      if (typeof child === "string" || typeof child === "number") {
        out += child;
      } else if (Array.isArray(child)) {
        out += getTextFromChildren(child);
      } else if (React.isValidElement(child) && child.props) {
        out += getTextFromChildren(child.props.children);
      } else {
        // fallback: coerce to string safely
        out += String(child);
      }
    });
    return out;
  };
  let raw = getTextFromChildren(children);
  // convert literal newlines and "\newline" into KaTeX line breaks ("\\")
  const processed = raw
    .replace(/\r\n/g, "\n")
    .replace(/\\newline\s*/g, "\\\\")
    .replace(/\n+/g, "\\\\");
  raw = processed;
  // render with KaTeX (don't need URL-encoding)
  const html = katex.renderToString(raw, { throwOnError: false, displayMode });

  // optional width fallback (keeps your previous heuristic if you want)
  const baseWidth = 50;
  const complexityFactor = 10;
  const estimated =
    baseWidth + complexityFactor * raw.replace(/\\[a-zA-Z]+/g, "").length;

  return (
    <>
      <br />
      <div
        className={className + " justify-center"}
        // allow horizontal scrolling when the rendered math is wider than the container
        style={{
          textAlign: "center",
          overflowX: "auto",
          overflowY: "hidden",
          width: "100%",
          ...style,
        }}
        {...props}
      >
        <div
          // keep the inner block from wrapping and let the outer container scroll horizontally
          style={{
            width: width ? width : `${estimated}px`,
            display: "inline-block",
            whiteSpace: "nowrap",
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      <br />
    </>
  );
}
