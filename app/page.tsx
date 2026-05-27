import { Nav } from "./_components/nav";
import { Hero } from "./_components/hero";
import { Manifesto } from "./_components/manifesto";
import { Work } from "./_components/work";
import { Services } from "./_components/services";
import { Stack } from "./_components/stack";
import { Contact } from "./_components/contact";
import { Footer } from "./_components/footer";
import { createClient } from "./_lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Nav isAuthed={Boolean(user)} />
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
