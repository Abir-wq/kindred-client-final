
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "../../../lib/auth-client";
import { API_URL } from "../../../lib/api-url";

function EventDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id;

  const { data: session, isPending } = authClient.useSession();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Load event details
  useEffect(() => {
    if (!eventId) return;

    async function loadEvent() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/events/${eventId}`,
          { cache: "no-store" }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load this event.");
        }

        setEvent(data.event);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [eventId]);

  // Check whether the logged-in user has joined
  useEffect(() => {
    if (isPending || !session?.user || !eventId) return;

    async function checkJoinedStatus() {
      try {
        const tokenResponse = await fetch(
          `${API_URL}/api/auth/token`,
          { credentials: "include" }
        );

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok || !tokenData.token) return;

        const response = await fetch(
          `${API_URL}/api/events/joined`,
          {
            headers: {
              Authorization: `Bearer ${tokenData.token}`,
            },
          }
        );

        if (!response.ok) return;

        const data = await response.json();

        setJoined(
          (data.events || []).some(
            (item) => item.id === eventId || item._id === eventId
          )
        );
      } catch (err) {
        console.error("Could not check joined status:", err);
      }
    }

    checkJoinedStatus();
  }, [session, isPending, eventId]);

  // Join event
  async function handleJoin() {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    setJoining(true);
    setError("");
    setMessage("");

    try {
      const tokenResponse = await fetch(
        `${API_URL}/api/auth/token`,
        { credentials: "include" }
      );

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        throw new Error("Please log in again to join this event.");
      }

      const response = await fetch(
        `${API_URL}/api/events/${eventId}/join`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 409) {
        setJoined(true);
        setMessage("You have already joined this event.");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Could not join this event.");
      }

      setJoined(true);
      setMessage(
        data.message || "You have successfully joined this event!"
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setJoining(false);
    }
  }

  // Loading state
  if (loading || isPending) {
    return (
      <main className="min-h-screen bg-base-100 p-10 text-center text-base-content">
        Loading event...
      </main>
    );
  }

  // Event not found or unavailable
  if (error && !event) {
    return (
      <main className="min-h-screen bg-base-100 px-6 py-20 text-center text-base-content">
        <h1 className="text-3xl font-bold">Event unavailable</h1>

        <p className="mt-4 text-base-content/70">
          {error}
        </p>

        <Link
          href="/events"
          className="btn btn-primary mt-8 rounded-full"
        >
          Back to Events
        </Link>
      </main>
    );
  }

  if (!event) return null;

  const eventDate = new Date(event.eventDate);
  const hasStarted = eventDate <= new Date();

  return (
    <main className="min-h-screen bg-base-100 px-6 py-14 text-base-content">
      <div className="mx-auto max-w-5xl">

        <Link
          href="/events"
          className="font-semibold text-secondary hover:underline"
        >
          ← Back to Events
        </Link>

        <div className="mt-8 overflow-hidden rounded-3xl border border-base-content/10">

          {event.imageUrl && (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="h-72 w-full object-cover sm:h-96"
            />
          )}

          <div className="p-6 sm:p-10">

            <span className="text-sm font-bold uppercase tracking-widest text-secondary">
              {event.eventType}
            </span>

            <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">
              {event.title}
              <span className="text-accent">.</span>
            </h1>

            <div className="mt-6 flex flex-wrap gap-5 text-sm text-base-content/70">
              <p>📍 {event.location}</p>

              <p>
                📅 {eventDate.toLocaleString()}
              </p>
            </div>

            <div className="my-8 border-t border-base-content/10" />

            <h2 className="text-2xl font-bold">
              About this event
            </h2>

            <p className="mt-4 whitespace-pre-line leading-8 text-base-content/80">
              {event.description}
            </p>

            {event.createdBy?.name && (
              <p className="mt-6 text-sm text-base-content/60">
                Organized by {event.createdBy.name}
              </p>
            )}

            <div className="mt-10 border-t border-base-content/10 pt-8">

              {message && (
                <div
                  role="status"
                  className="mb-5 rounded-xl border border-success/30 bg-success/10 p-4 text-sm"
                >
                  {message}
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="mb-5 rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error"
                >
                  {error}
                </div>
              )}

              {joined ? (
                <button
                  disabled
                  className="btn btn-success w-full rounded-full sm:w-auto"
                >
                  ✓ You&apos;ve Joined This Event
                </button>
              ) : hasStarted ? (
                <p className="font-semibold text-base-content/60">
                  This event has already started or passed.
                </p>
              ) : (
                <button
                  onClick={handleJoin}
                  disabled={joining}
                  className="btn btn-primary w-full rounded-full sm:w-auto"
                >
                  {joining
                    ? "Joining..."
                    : session?.user
                      ? "Join This Event"
                      : "Log In to Join"}
                </button>
              )}

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Suspense fallback while Next.js resolves the event URL
export default function EventDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-base-100 p-10 text-center text-base-content">
          Loading event details...
        </main>
      }
    >
      <EventDetailsContent />
    </Suspense>
  );
}
