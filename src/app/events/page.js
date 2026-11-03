import { connection } from "next/server";
import Link from "next/link";
import { Suspense } from "react";
import { API_URL } from "../../lib/api-url";

async function getEvents() {
  await connection();

  try {
    const response = await fetch(`${API_URL}/api/events`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status}`);
    }

    const data = await response.json();
    return data.events || [];
  } catch (error) {
    console.error("Error loading events:", error);
    return null;
  }
}

function formatEventDate(date) {
  if (!date) return "Date to be announced";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date to be announced";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function EventsList() {
  const events = await getEvents();

  if (events === null) {
    return (
      <div className="events-message">
        <span className="events-message-icon">!</span>
        <h2>Something went wrong</h2>
        <p>
          We couldn&apos;t load community events. Please try again later.
        </p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="events-message">
        <span className="events-message-icon">🌱</span>
        <h2>Something good starts here.</h2>
        <p>
          There aren&apos;t any upcoming events yet. Why not create the
          first one and bring your community together?
        </p>
        <Link href="/events/create" className="events-primary-button">
          Create the first event
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="events-results-heading">
        <div>
          <span className="events-eyebrow">MAKE A DIFFERENCE</span>
          <h2>Find your next opportunity.</h2>
        </div>

        <span className="events-count">
          {events.length} {events.length === 1 ? "event" : "events"}
        </span>
      </div>

      <div className="events-grid">
        {events.map((event) => {
          const eventId = event._id || event.id;

          return (
            <article className="event-card" key={eventId}>
              <Link
                href={`/events/${eventId}`}
                className="event-card-image-link"
                aria-label={`View ${event.title}`}
              >
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="event-card-image"
                  />
                ) : (
                  <div className="event-card-image-placeholder">
                    <span>🌿</span>
                    <p>Community in action</p>
                  </div>
                )}
              </Link>

              <div className="event-card-content">
                <div className="event-card-topline">
                  <span className="event-category">
                    {event.eventType || "Community Event"}
                  </span>
                </div>

                <h3 className="event-card-title">{event.title}</h3>

                <p className="event-card-description">
                  {event.description}
                </p>

                <div className="event-card-details">
                  <p>
                    <span className="event-detail-icon">📍</span>
                    <span>{event.location}</span>
                  </p>

                  <p>
                    <span className="event-detail-icon">📅</span>
                    <span>{formatEventDate(event.eventDate)}</span>
                  </p>
                </div>

                <Link
                  href={`/events/${eventId}`}
                  className="event-card-button"
                >
                  View Event <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

function EventsLoading() {
  return (
    <div className="events-loading" role="status">
      <span className="events-spinner" aria-hidden="true" />
      <p>Finding opportunities to make a difference...</p>
    </div>
  );
}

export default function EventsPage() {
  return (
    <main className="events-page">
      <div className="events-container">
        <section className="events-hero">
          <div className="events-hero-content">
            <span className="events-eyebrow">
              SMALL ACTIONS. SHARED PURPOSE.
            </span>

            <h1>
              Find your people.
              <br />
              <span>Make a difference.</span>
            </h1>

            <p>
              Discover local activities, meet people who care, and turn
              good intentions into meaningful community action.
            </p>
          </div>

          <div className="events-hero-side">
            <span className="events-hero-leaf">✳</span>
            <p>Good things happen when we come together.</p>
            <span>Explore. Participate. Make an impact.</span>
          </div>
        </section>

        <section className="events-listing">
          <div className="events-listing-header">
            <div>
              <span className="events-eyebrow">GET INVOLVED</span>
              <h2>Upcoming Community Events</h2>
              <p>
                Find something meaningful to do and make a difference
                right where you live.
              </p>
            </div>

            <Link
              href="/events/create"
              className="events-primary-button"
            >
              + Create an Event
            </Link>
          </div>

          <Suspense fallback={<EventsLoading />}>
            <EventsList />
          </Suspense>
        </section>

        <section className="events-bottom-note">
          <span>🌱</span>
          <div>
            <h2>Every little action counts.</h2>
            <p>
              Whether you volunteer, organize, or simply show up,
              you&apos;re helping build a stronger community.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
