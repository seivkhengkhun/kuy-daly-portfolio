import type { Metadata } from "next";
import { profile } from "@/data/profile";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kuy Daly — Developer, Cambodia",
  description: "The selected work and development practice of Kuy Daly. Full-stack developer and Information Technology student in Cambodia.",
  icons: { icon: "/favicon.svg" },
  openGraph: { title: "Kuy Daly — Selected work", description: "Interfaces. Systems. The code in between.", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#work">Skip to selected work</a>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Person", name: profile.name, jobTitle: profile.role, sameAs: [profile.github, profile.linkedin], email: profile.email }).replace(/</g, "\\u003c") }} /></body></html>;
}
