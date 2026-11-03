import { connection } from "next/server";
import Link from "next/link";
import Features from "./components/Features";
import Gallery from "./components/Gallery";
import Newsletter from "./components/Newsletter";
import { API_URL } from "../lib/api-url";

const causes = [
  {
    number: "01",
    title: "Greener neighbourhoods",
    description: "Plant trees and care for shared green spaces.",
  },
  {
    number: "02",
    title: "Care that reaches people",
    description: "Share clothing, food, and everyday essentials.",
  },
  {
    number: "03",
    title: "Cleaner places to gather",
    description: "Help keep local streets and parks welcoming.",
  },
];

async function getFeaturedEvents() {
  await connection();

  try {
    const response = await fetch(
      `${API_URL}/api/events/featured`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(
        `Could not load featured events: ${response.status}`
      );
    }

    const data = await response.json();
    return data.events || [];
  } catch (error) {
    console.error("Featured events error:", error);
    return null;
  }
}

export default async function Home() {
  const featuredEvents = await getFeaturedEvents();

  return (
    <main className="bg-base-100 text-base-content">
      {/* Hero Section */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:py-24 lg:grid-cols-2">
        <div>
          <p className="kindred-muted mb-5 text-xs font-bold uppercase tracking-[0.2em]">
            Small actions. Shared purpose.
          </p>

          <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">
            A better community starts with{" "}
            <span className="text-secondary">you.</span>
          </h1>

          <p className="kindred-muted mt-6 max-w-lg text-lg leading-8">
            Plant a tree. Share a warm meal. Help a neighbour. Find local
            service events and turn your time into something that matters.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/events"
              className="btn btn-primary rounded-full px-6"
            >
              Explore events →
            </Link>

            <a
              href="#our-purpose"
              className="btn btn-outline rounded-full px-6"
            >
              Our purpose
            </a>
          </div>

          <p className="kindred-muted mt-8 text-sm">
            For your neighbourhood. For each other.
          </p>
        </div>

        <div className="rounded-4xl bg-base-200 p-6 sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.2em]">
            Find your way to give back
          </p>

          <div className="mt-7 space-y-4">
            {causes.map((item) => (
              <div
                key={item.number}
                className="kindred-card flex gap-4 rounded-2xl p-5"
              >
                <span className="text-sm font-bold text-secondary">
                  {item.number}
                </span>

                <div>
                  <h2 className="font-bold">{item.title}</h2>
                  <p className="kindred-muted mt-2 text-sm leading-6">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="kindred-muted mt-6 text-sm leading-6">
            You don’t need to change everything. Start with something nearby.
          </p>
        </div>
      </section>

      {/* Purpose Section */}
      <section
        id="our-purpose"
        className="border-t border-base-content/10 px-6 py-12"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold tracking-tight">
            Together, local action goes further.
          </h2>

          <p className="kindred-muted mt-4 max-w-2xl leading-7">
            Kindred brings volunteers and community organisers together.
            Discover a cause you care about, take part in a local event,
            or invite others to join an initiative of your own.
          </p>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="border-t border-base-content/10 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-secondary">
                Get involved
              </p>

              <h2 className="text-3xl font-extrabold sm:text-4xl">
                Featured Community Events
                <span className="text-accent">.</span>
              </h2>

              <p className="kindred-muted mt-4 max-w-xl">
                Discover upcoming activities and find an opportunity
                to make a difference.
              </p>
            </div>

            <Link
              href="/events"
              className="btn btn-outline btn-secondary rounded-full"
            >
              View All Events →
            </Link>
          </div>

          {featuredEvents === null ? (
            <div className="rounded-2xl border border-base-content/10 p-8 text-center">
              <h3 className="text-xl font-bold">
                Events are temporarily unavailable.
              </h3>

              <p className="kindred-muted mt-2">
                Please try again later.
              </p>
            </div>
          ) : featuredEvents.length === 0 ? (
            <div className="rounded-2xl border border-base-content/10 p-10 text-center">
              <h3 className="text-xl font-bold">
                No upcoming events yet.
              </h3>

              <p className="kindred-muted mt-3">
                Be the first to organize something meaningful!
              </p>

              <Link
                href="/events/create"
                className="btn btn-primary mt-6 rounded-full"
              >
                Create an Event
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredEvents.map((event) => (
                <article
                  key={event.id}
                  className="overflow-hidden rounded-2xl border border-base-content/10 bg-base-100 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="h-52 w-full object-cover"
                  />

                  <div className="p-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                      {event.eventType}
                    </span>

                    <h3 className="mt-3 text-xl font-bold">
                      {event.title}
                    </h3>

                    <p className="kindred-muted mt-3 line-clamp-3 text-sm">
                      {event.description}
                    </p>

                    <div className="kindred-muted mt-5 space-y-2 text-sm">
                      <p>📍 {event.location}</p>

                      <p>
                        📅{" "}
                        {new Date(event.eventDate).toLocaleString()}
                      </p>
                    </div>

                    <Link
                      href={`/events/${event.id}`}
                      className="btn btn-outline btn-secondary mt-6 w-full rounded-full"
                    >
                      View Event
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Features />
      <Gallery />
      <Newsletter />
    </main>
  );
}
