Place the provided scene files into your Next.js public folder so they are served at runtime.

Steps

1. Copy the attached `three` folder (from the other project) into `public/scene` in this repository. After copying the files the structure should look like:

   public/scene/
     scene.js
     NavBar.jsx
     Tooltip.jsx
     Tree.jsx
     wasm/
       drawLine.wasm
       drawLine.js
       drawLine.c

2. The `SceneLoader` component expects `/scene/scene.js` to export an `initScene(container)` function. Optionally it may export `destroyScene()` which will be called on unmount.

3. Start the dev server with `npm run dev` (or `pnpm dev`/`yarn dev`). Open the app and the scene will be the first thing rendered. If the scene doesn't appear, check the browser console for errors (missing files, CORS, or WASM fetch issues).

Notes

- Because Next.js serves files from `public` at the root, importing `/scene/scene.js` from the client will fetch `https://your-site.com/scene/scene.js`.
- If your scene depends on module format (ESM vs UMD), ensure `scene.js` is an ES module that exports `initScene` (e.g., `export function initScene(container) { ... }`).

WASM / SolveSpace integration
--------------------------------

This project includes a small loader that expects an Emscripten-generated modularized JS glue file at `public/scene/wasm/solver.js` and the corresponding wasm at `public/scene/wasm/solver.wasm`.

Recommended emscripten command (run from project root on Windows PowerShell):

```powershell
mkdir public\scene\wasm -Force
emcc .\wasm\solver.c .\wasm\libslvs.a -L.\wasm -lslvs `
  -o public/scene/wasm/solver.js `
  -s MODULARIZE=1 `
  -s 'EXPORT_NAME="createSolverModule"' `
  -s EXPORTED_FUNCTIONS='["_main","_solver","_free"]' `
  -s ALLOW_MEMORY_GROWTH=1 `
  -s TOTAL_MEMORY=134217728 `
  -O3
```

I added an npm script `build:wasm` that wraps this command so you can run:

```powershell
npm run build:wasm
```

Loader wiring
--------------

- The project includes `src/wasm/solverLoader.ts` which injects `public/scene/wasm/solver.js` and calls the exported factory `createSolverModule({ locateFile })`.
- `src/scene/sceneClient.ts` calls `initSolverModule()` at scene startup; after initialization the Emscripten Module is available as `window.sceneSolver` for quick testing.
- Make sure `solver.js` and `solver.wasm` are both in `public/scene/wasm/` so `locateFile` can find the .wasm file.

If you want, I can try building the wasm here but the environment needs Emscripten installed. If it's not present I'll get an error and report it.
