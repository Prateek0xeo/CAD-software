import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-100">
      <div className="max-w-xl text-center p-8">
        <h1 className="text-4xl font-extrabold mb-4">Welcome to CAD WASM</h1>
        <p className="text-sm text-slate-600 mb-6">
          Launch the CAD scene to start drawing with the WebAssembly-powered renderer.
        </p>
        <Link href="/cad" className="inline-block">
          <button className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-3 rounded-lg shadow">
            Go to CAD software
          </button>
        </Link>
      </div>
    </div>
  );
}
