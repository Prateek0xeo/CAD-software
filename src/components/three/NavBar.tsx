"use client";

import React from "react";

interface NavBarProps {
  sceneRef: React.MutableRefObject<any>;
}

export const NavBar = ({ sceneRef }: NavBarProps) => {
  const toggleDrawing = () => {
    if (sceneRef.current) {
      sceneRef.current.toggleDrawingMode();
    }
  };

  const setTopView = () => {
    if (sceneRef.current) {
      sceneRef.current.setTopView();
    }
  };

  const setThreeDView = () => {
    if (sceneRef.current) {
      sceneRef.current.setThreeDView();
    }
  };

  return (
    <div className="h-full flex items-center justify-between px-4 bg-gray-800 text-gray-200">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleDrawing}
          className="px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600 text-sm"
          data-tooltip="Toggle Drawing Mode"
        >
          Draw Line
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={setTopView}
          className="px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600 text-sm"
          data-tooltip="Top View"
        >
          Top
        </button>
        <button
          onClick={setThreeDView}
          className="px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600 text-sm"
          data-tooltip="3D View"
        >
          3D
        </button>
      </div>
    </div>
  );
};