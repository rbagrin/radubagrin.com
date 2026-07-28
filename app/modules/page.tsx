import Link from "next/link";
import { modules } from "@/lib/modules";

const statusLabel: Record<string, string> = {
  active: "Active",
  dummy: "Preview",
  "coming-soon": "Coming soon",
};

const statusColor: Record<string, string> = {
  active: "bg-status-active",
  dummy: "bg-status-dummy",
  "coming-soon": "bg-fg-muted",
};

export default function ModulesPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-3xl px-6 py-20">
        <p className="font-mono text-sm text-accent">$ ls modules/</p>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">
          Modules
        </h1>
        <p className="mt-3 max-w-xl text-fg-muted">
          Small self-contained apps living inside this one. Pick one below.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {modules.map((module) => (
            <Link
              key={module.slug}
              href={`/modules/${module.slug}`}
              className="group rounded-lg border border-border bg-surface p-5 transition-colors hover:bg-surface-hover"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-medium">
                  {module.name}
                </h2>
                <span className="flex items-center gap-1.5 font-mono text-xs text-fg-muted">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${statusColor[module.status]}`}
                  />
                  {statusLabel[module.status]}
                </span>
              </div>
              <p className="mt-2 text-sm text-fg-muted">
                {module.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
