"use client";

import React, { useEffect, useState, useRef } from "react";

export const ToolTip = () => {
  const [text, setText] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const tooltipText = target.getAttribute("data-tooltip");
      if (tooltipText) {
        setPosition({ x: e.clientX, y: e.clientY + 10 });
        setText(tooltipText);
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    return () => document.removeEventListener("mouseover", handleMouseOver);
  }, []);

  return (
    <div
      ref={ref}
      className="fixed bg-gray-800 text-white text-xs px-2 py-1 rounded pointer-events-none transition-opacity duration-200"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity: visible ? 1 : 0,
        visibility: visible ? "visible" : "hidden",
      }}
    >
      {text}
    </div>
  );
};