import { Nav } from "./_components/nav";
import { Hero } from "./_components/hero";
import { Manifesto } from "./_components/manifesto";
import { Work } from "./_components/work";
import { Services } from "./_components/services";
import { Stack } from "./_components/stack";
import { Contact } from "./_components/contact";
import { Footer } from "./_components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Services />
        <Work />
        <Manifesto />
        <Stack />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
