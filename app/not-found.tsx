/*
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
*/

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell">
      <div className="not-found">
        <div className="not-found-code">404</div>
        <h1>Story not found</h1>
        <p className="notice">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link className="button button-primary" href="/">
          ← Back to Library
        </Link>
      </div>
    </main>
  );
}
