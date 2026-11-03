import Link from "next/link";

export default function Footer() {
  return (
    <footer className="kindred-footer px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <Link
              href="/"
              className="text-3xl font-extrabold tracking-tight"
            >
              kindred<span className="text-accent">.</span>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-7 opacity-85">
              Bringing people together through local service.
              Find your community, share your time, and help
              make your neighbourhood a better place.
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="md:justify-self-end"
          >
            <h2 className="font-bold">Get involved</h2>

            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/events" className="hover:underline">
                  Explore upcoming events
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:underline">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/#our-purpose" className="hover:underline">
                  Our purpose
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-current/20 pt-6 text-xs">
          <p>© 2026 Kindred. All rights reserved.</p>
          <p>Small actions. Shared purpose.</p>
        </div>
      </div>
    </footer>
  );
}