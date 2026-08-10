import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://radubagrin.com"),
  title: {
    default: "Radu Bagrin — Applied AI Software Engineer",
    template: "%s | Radu Bagrin",
  },
  description:
    "Personal website and software module hub of Radu Bagrin, Applied AI Software Engineer building production systems around machine learning and web applications.",
  keywords: [
    "Radu Bagrin",
    "Radu",
    "Bagrin",
    "Applied AI Software Engineer",
    "AI Software Engineer",
    "Machine Learning Engineer",
    "Full Stack Engineer",
    "TypeScript",
    "Next.js",
    "Python",
    "Personal Portfolio",
  ],
  authors: [{ name: "Radu Bagrin", url: "https://radubagrin.com" }],
  creator: "Radu Bagrin",
  publisher: "Radu Bagrin",
  alternates: {
    canonical: "https://radubagrin.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://radubagrin.com",
    title: "Radu Bagrin — Applied AI Software Engineer",
    description:
      "Personal portfolio and interactive module system of Radu Bagrin, Applied AI Software Engineer.",
    siteName: "Radu Bagrin",
  },
  twitter: {
    card: "summary_large_image",
    title: "Radu Bagrin — Applied AI Software Engineer",
    description:
      "Personal portfolio and interactive module system of Radu Bagrin, Applied AI Software Engineer.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-fg font-body">
        {children}
      </body>
    </html>
  );
}

