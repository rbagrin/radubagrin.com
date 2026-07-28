export type ModuleStatus = "active" | "dummy" | "coming-soon";

export type AppModule = {
  slug: string;
  name: string;
  description: string;
  status: ModuleStatus;
};

// Add a new module here and it automatically appears on /modules.
// Create the matching page at app/modules/<slug>/page.tsx.
export const modules: AppModule[] = [
  {
    slug: "investing",
    name: "Investing",
    description: "Track stocks and portfolio performance.",
    status: "dummy",
  },
  {
    slug: "reminders",
    name: "Reminders",
    description: "Get reminded before things like your MOT expire.",
    status: "dummy",
  },
  {
    slug: "linkedin_poster",
    name: "LinkedIn Poster",
    description: "Post LinkedIn AI generated posts.",
    status: "dummy",
  },
];

export function getModule(slug: string): AppModule | undefined {
  return modules.find((m) => m.slug === slug);
}
