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
  {
    slug: "rag_system",
    name: "RAG System",
    description: "Build a RAG system to answer questions about your documents.",
    status: "dummy",
  },
  {
    slug: "documents",
    name: "Documents",
    description: "Manage all your documents and S3 storage in one place.",
    status: "active",
  },
];

export function getModule(slug: string): AppModule | undefined {
  return modules.find((m) => m.slug === slug);
}
