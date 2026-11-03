
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "../../lib/auth-client";
import { API_URL } from "../../lib/api-url";

export default function MyEventsPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [activeTab, setActiveTab] = useState("created");
  const [createdEvents, setCreatedEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const loadEvents = useCallback(async () => {
    try {
      const tokenResponse = await fetch(
        `${API_URL}/api/auth/token`,
        {
          credentials: "include",
        }
      );

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        throw new Error("Please log in again.");
      }

      const headers = {
        Authorization: `Bearer ${tokenData.token}`,
      };

      const [createdResponse, joinedResponse] = await Promise.all([
        fetch(`${API_URL}/api/events/mine`, { headers }),
        fetch(`${API_URL}/api/events/joined`, { headers }),
      ]);

      const createdData = await createdResponse.json();
      const joinedData = await joinedResponse.json();

      if (!createdResponse.ok || !joinedResponse.ok) {
        throw new Error("Could not load your events.");
      }

      setError("");
      setCreatedEvents(createdData.events || []);
      setJoinedEvents(joinedData.events || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    const timer = window.setTimeout(() => {
      void loadEvents();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [isPending, session, router, loadEvents]);

  async function handleDelete(eventId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone."
    );

    if (!confirmed) return;

    setDeletingId(eventId);
    setError("");

    try {
      const tokenResponse = await fetch(
        `${API_URL}/api/auth/token`,
        {
          credentials: "include",
        }
      );

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        throw new Error("Please log in again.");
      }

      const response = await fetch(
        `${API_URL}/api/events/${eventId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete this event.");
      }

      setCreatedEvents((previous) =>
        previous.filter((event) => event.id !== eventId)
      );
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setDeletingId(null);
    }
  }

  if (isPending || !session?.user) {
    return (
      <main className="min-h-screen bg-base-100 p-10 text-center text-base-content">
        Checking your login...
      </main>
    );
  }

  const displayedEvents =
    activeTab === "created" ? createdEvents : joinedEvents;

  return (
    <main className="min-h-screen bg-base-100 px-6 py-16 text-base-content">
      <div className="mx-auto max-w-6xl">

        <div className="mb-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-secondary">
            Your Kindred Activity
          </p>

          <h1 className="text-4xl font-extrabold sm:text-5xl">
            My Events<span className="text-accent">.</span>
          </h1>

          <p className="mt-4 text-base-content/70">
            Manage your community events and keep track of the activities
            you&apos;ve joined.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-5">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab("created")}
              className={`btn rounded-full ${
                activeTab === "created"
                  ? "btn-primary"
                  : "btn-outline"
              }`}
            >
              Created ({createdEvents.length})
            </button>

            <button
              onClick={() => setActiveTab("joined")}
              className={`btn rounded-full ${
                activeTab === "joined"
                  ? "btn-primary"
                  : "btn-outline"
              }`}
            >
              Joined ({joinedEvents.length})
            </button>
          </div>

          <Link
            href="/events/create"
            className="btn btn-secondary rounded-full px-6"
          >
            + Create Event
          </Link>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error"
          >
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-base-content/70">
            Loading your events...
          </div>
        ) : displayedEvents.length === 0 ? (
          <div className="rounded-2xl border border-base-content/10 p-12 text-center">
            <h2 className="text-2xl font-bold">
              {activeTab === "created"
                ? "You haven't created any events yet."
                : "You haven't joined any events yet."}
            </h2>

            <p className="mt-3 text-base-content/70">
              Discover events and make a difference with your community.
            </p>

            <Link
              href="/events"
              className="btn btn-primary mt-6 rounded-full"
            >
              Explore Events
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {displayedEvents.map((event) => (
              <article
                key={event.id}
                className="overflow-hidden rounded-2xl border border-base-content/10 bg-base-100 shadow-sm"
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

                  <h2 className="mt-3 text-xl font-bold">
                    {event.title}
                  </h2>

                  {event.description && (
                    <p className="mt-3 line-clamp-3 text-sm text-base-content/70">
                      {event.description}
                    </p>
                  )}

                  <div className="mt-5 space-y-2 text-sm text-base-content/70">
                    <p>📍 {event.location}</p>

                    <p>
                      📅 {new Date(event.eventDate).toLocaleString()}
                    </p>
                  </div>

                  {/* View button */}
                  <Link
                    href={`/events/${event.id}`}
                    className="btn btn-outline btn-secondary mt-6 w-full rounded-full"
                  >
                    View Event
                  </Link>

                  {/* Edit and Delete buttons only for created events */}
                  {activeTab === "created" && (
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <Link
                        href={`/events/${event.id}/edit`}
                        className="btn btn-primary rounded-full"
                      >
                        Edit Event
                      </Link>

                      <button
                        onClick={() => handleDelete(event.id)}
                        disabled={deletingId === event.id}
                        className="btn btn-outline btn-error rounded-full"
                      >
                        {deletingId === event.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
