"use client";

import React, { useState } from "react";

const Tooltip = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block" // Essential for positioning the tooltip relative to its parent
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-sm rounded-md shadow-lg whitespace-nowrap">
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
