import Link from "next/link";

import { BrandLockup } from "@/components/layout/logo";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Editor", href: "/editor" },
      { label: "Examples", href: "/#examples" },
      { label: "Export formats", href: "/#formats" },
      { label: "Diagram types", href: "/#diagram-types" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "Source", href: "https://github.com/AbhinayAmbati/mermaid2diagram" },
      { label: "Mermaid docs", href: "https://mermaid.js.org/intro/" },
      { label: "Architecture", href: "https://github.com/AbhinayAmbati/mermaid2diagram/blob/main/docs/ARCHITECTURE.md" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="px-4 pb-8 pt-4">
      <div className="mx-auto max-w-[1320px]">
        <div className="chamfer-tl-bl border border-panel-line bg-panel px-6 py-10 text-on-panel sm:px-10 sm:py-12">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
            <div>
              <BrandLockup tone="nav" />
              <p className="mt-6 max-w-[16rem] text-sm leading-relaxed text-on-panel-muted">
                An instant, in-browser Mermaid editor with a genuine export
                pipeline.
              </p>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-on-panel-muted/70">
                Next.js · TypeScript · Mermaid
              </p>
            </div>

            {COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="label-mono text-on-panel-muted">{column.title}</h3>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noreferrer noopener" : undefined}
                        className="text-sm text-on-panel transition-colors hover:text-signal"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h3 className="label-mono text-on-panel-muted">Get started</h3>
              <p className="mt-5 text-[0.9375rem] text-on-panel">
                Open the editor and paste your first diagram.
              </p>
              <Link
                href="/editor"
                className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-signal transition-opacity hover:opacity-80"
              >
                Open editor
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-panel-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-on-panel-muted/70">
              © {new Date().getFullYear()} mermaid2diagram. All rights reserved
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-on-panel-muted/70">
              Built with Next.js &amp; Mermaid
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
