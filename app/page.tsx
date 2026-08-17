import dynamic from "next/dynamic";
import { About } from "@/components/about";
import { Capabilities } from "@/components/capabilities";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { SelectedWork } from "@/components/selected-work";
import { StackCard } from "@/components/stack-card";
import { Toolkit } from "@/components/toolkit";

const StackEngine = dynamic(() =>
  import("@/components/stack-engine").then((m) => m.StackEngine),
);

const Experience = dynamic(() =>
  import("@/components/experience").then((m) => m.Experience),
);

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <StackEngine>
          <Hero />
          <StackCard z={2} tone="canvas-2">
            <About />
          </StackCard>
          <StackCard z={3} tone="canvas">
            <Capabilities />
          </StackCard>
          <StackCard z={4} tone="canvas-2">
            <SelectedWork />
          </StackCard>
          <StackCard z={5} tone="canvas">
            <Experience />
          </StackCard>
          <StackCard z={6} tone="canvas-2">
            <Toolkit />
          </StackCard>
          <StackCard z={7} tone="canvas">
            <Contact />
          </StackCard>
        </StackEngine>
      </main>
      <Footer />
    </>
  );
}
