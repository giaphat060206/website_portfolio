import { cv } from "@/data/cv";

export function Footer() {
  return (
    <footer className="border-t border-line px-6 py-8">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 font-mono text-xs text-ink-faint">
        <p>© 2026 {cv.name}</p>
        <a href="#top" className="transition-colors hover:text-ink">
          Back to top
        </a>
      </div>
    </footer>
  );
}
