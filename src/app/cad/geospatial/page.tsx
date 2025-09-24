"use client";

import React, { useEffect, useRef } from "react";
import { NavBar } from "@/components/three/NavBar";
import { Tree } from "@/components/three/Tree";
import { ToolTip } from "@/components/three/Tooltip";
import Scene from "@/components/three/Scene";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function Geospatial() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneInstance = useRef<Scene | null>(null);

  useEffect(() => {
    if (canvasRef.current && !sceneInstance.current) {
      sceneInstance.current = new Scene(canvasRef.current); 
    }
  }, []);

  return (
    <ErrorBoundary>
      <div className="flex h-[100dvh] overflow-hidden bg-gray-900">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 border-r border-gray-700">
          <Tree />
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <header className="h-16 border-b border-gray-700">
            <NavBar sceneRef={sceneInstance} />
          </header>

          {/* 3D Viewport */}
          <main className="flex-1 relative bg-gray-950">
            <canvas ref={canvasRef} id="viewport" className="w-full h-full" />
          </main>
        </div>

        {/* Global Tooltip */}
        <ToolTip />
      </div>
    </ErrorBoundary>
  );
}