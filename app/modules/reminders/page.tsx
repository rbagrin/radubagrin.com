import Link from "next/link";

// Dummy data for now — the real version reads/writes via
// GET/POST /api/v1/reminders, which is already wired to Prisma + Neon
// (see app/api/v1/reminders/route.ts). This page just needs a logged-in
// session to switch over to real data.
const reminders = [
  { id: "1", title: "MOT expires", dueDate: "2026-09-14", notifyBy: "email" },
  { id: "2", title: "Passport renewal", dueDate: "2027-01-02", notifyBy: "push" },
  { id: "3", title: "Car insurance renewal", dueDate: "2026-08-30", notifyBy: "email" },
];

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function RemindersModulePage() {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-3xl px-6 py-20">
        <Link href="/modules" className="font-mono text-sm text-accent">
          &larr; modules
        </Link>

        <div className="mt-4 flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Reminders
          </h1>
          <span className="rounded-full border border-status-dummy/40 bg-status-dummy/10 px-2.5 py-1 font-mono text-xs text-status-dummy">
            preview data
          </span>
        </div>
        <p className="mt-3 max-w-xl text-fg-muted">
          Dummy list for now — the API and database schema behind this are
          already set up (see /api/v1/reminders).
        </p>

        <div className="mt-10 divide-y divide-border rounded-lg border border-border bg-surface">
          {reminders.map((reminder) => {
            const days = daysUntil(reminder.dueDate);
            return (
              <div
                key={reminder.id}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div>
                  <p className="font-medium">{reminder.title}</p>
                  <p className="text-sm text-fg-muted">
                    {new Date(reminder.dueDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    &middot; notify by {reminder.notifyBy}
                  </p>
                </div>
                <span className="font-mono text-sm text-fg-muted">
                  {days} days
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
