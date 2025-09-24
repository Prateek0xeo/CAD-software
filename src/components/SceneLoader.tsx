"use client";

import React, { useEffect, useRef, useState } from "react";

type SceneModule = {
  initScene?: (container: HTMLElement) => void;
  destroyScene?: () => void;
};

/**
 * SceneLoader dynamically loads a scene script from /scene/scene.js at runtime
 * using a bundler-ignore hint so the server build doesn't try to resolve it.
 * It calls initScene(container) if exported and destroyScene() on unmount.
 */
export default function SceneLoader() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const moduleRef = useRef<SceneModule | null>(null);
  const [status, setStatus] = useState<string>("loading");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const publicUrl = `${window.location.origin}/scene/scene.js`;

        // Check if user provided a scene bundle under public/scene
        let usePublic = false;
        try {
          const head = await fetch(publicUrl, { method: "HEAD" });
          usePublic = head.ok;
        } catch (e) {
          // ignore fetch errors and fall back to local module
          usePublic = false;
        }

        if (usePublic) {
          // Load the user's scene bundle from public/scene. Use webpackIgnore so bundler won't try to resolve it.
          // @ts-ignore
          setStatus("loading public bundle...");
          const m = (await import(/* webpackIgnore: true */ publicUrl)) as SceneModule;
          moduleRef.current = m;
          if (mounted && m?.initScene && containerRef.current) {
            m.initScene(containerRef.current);
            setStatus("loaded public bundle");
          }
          return;
        }

        // Fallback: import the local TypeScript scene module
        setStatus("loading fallback module...");
        const m = (await import("../scene/sceneClient")) as SceneModule;
        moduleRef.current = m;
        if (mounted && m?.initScene && containerRef.current) {
          m.initScene(containerRef.current);
          setStatus("loaded fallback module");
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to load scene module:", err);
        setStatus(`error: ${(err as Error)?.message ?? String(err)}`);
      }
    }

    load();

    return () => {
      mounted = false;
      try {
        moduleRef.current?.destroyScene?.();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Error while destroying scene:", err);
      }
    };
  }, []);

  return (
    <div className="w-full h-[60vh] bg-gray-50 relative">
      <div ref={containerRef} id="scene-root" className="w-full h-full" />
      <div className="absolute top-2 left-2 rounded bg-black/60 text-white px-2 py-1 text-xs">
        {status}
      </div>
    </div>
  );
}
