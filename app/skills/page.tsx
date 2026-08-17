import type { Metadata } from "next";
import { preconnect } from "react-dom";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { SkillsView } from "@/components/skills-view";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Skills",
  description: `Languages, frontend, backend, and tools ${site.name} actually ships with — from the résumé, not a wish list.`,
};

export default function SkillsPage() {
  preconnect("https://cdn.simpleicons.org");

  return (
    <>
      <Nav />
      <main id="main">
        <SkillsView />
      </main>
      <Footer />
    </>
  );
}
