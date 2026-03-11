/*
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
*/

import { getAllStories } from "@/lib/stories";
import { LibraryClient } from "@/components/LibraryClient";

export default async function HomePage() {
  const stories = await getAllStories();

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">Mycelium</div>
        <div className="notice">v1.0.0</div>
      </header>

      <section className="hero">
        <h1>Discover stories that stay with you.</h1>
        <p>
          An immersive library of short fiction — curated, beautifully presented,
          with community reviews. By the Zorvia Community.
        </p>
      </section>

      <LibraryClient stories={stories} />

      <footer className="footer">
        Mycelium · Licensed under ZPL v2.0
      </footer>
    </main>
  );
}

