
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import AuthStatus from "./AuthStatus";

export default function Navbar() {
  return (
    <header className="border-b border-base-content/10 bg-base-100 text-base-content">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5"
      >
        <Link href="/" className="text-3xl font-extrabold tracking-tight">
          kindred<span className="text-accent">.</span>
        </Link>

        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold sm:gap-5">
          <Link
            href="/events"
            className="transition hover:text-secondary"
          >
            Upcoming Events
          </Link>

          <Link
            href="/my-events"
            className="transition hover:text-secondary"
          >
            My Events
          </Link>

          <ThemeToggle />

          <AuthStatus />
        </div>
      </nav>
    </header>
  );
}
