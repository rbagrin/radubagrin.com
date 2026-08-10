import Link from "next/link";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "name": "Radu Bagrin — Applied AI Software Engineer",
    "url": "https://radubagrin.com",
    "mainEntity": {
      "@type": "Person",
      "name": "Radu Bagrin",
      "jobTitle": "Applied AI Software Engineer",
      "url": "https://radubagrin.com",
      "description":
        "Applied AI Software Engineer building production systems around applied machine learning and scalable web infrastructure.",
      "knowsAbout": [
        "Applied Machine Learning",
        "Artificial Intelligence",
        "Software Engineering",
        "Full Stack Development",
        "Next.js",
        "TypeScript",
        "Python",
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex-1 flex items-center">
        <div className="mx-auto w-full max-w-3xl px-6 py-24">
          <p className="font-mono text-sm text-accent">$ whoami</p>

          <h1 className="mt-4 font-display text-5xl sm:text-6xl font-bold leading-[1.05] tracking-tight">
            Radu Bagrin
          </h1>

          <p className="mt-3 font-display text-xl sm:text-2xl text-fg-muted">
            Applied AI Software Engineer
          </p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-fg-muted">
            I build production systems around applied machine learning — from
            model integration to the infrastructure that keeps it running.
            This site doubles as a small workshop: each module below is a
            self-contained app I&apos;m building out over time.
          </p>

          <div className="mt-10 flex items-center gap-4">
            <Link
              href="/modules"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dim"
            >
              View modules
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className="mt-16 rounded-lg border border-border bg-surface font-mono text-sm">
            <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-status-dummy/80" />
              <span className="text-fg-muted">status.log</span>
            </div>
            <div className="px-4 py-3 text-fg-muted">
              <span className="text-status-active">&gt;</span> currently
              shipping the module system
              <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-fg-muted/60 align-middle motion-reduce:animate-none" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

