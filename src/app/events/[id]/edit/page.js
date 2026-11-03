
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "../../../../lib/auth-client";
import { API_URL } from "../../../../lib/api-url";

const EVENT_TYPES = [
  "Tree Planting",
  "Community Cleanup",
  "Food Donation",
  "Clothing Distribution",
  "Education",
  "Other",
];

const initialForm = {
  title: "",
  description: "",
  eventType: "",
  imageUrl: "",
  location: "",
  eventDate: "",
};

function toLocalDateTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

  return date.toISOString().slice(0, 16);
}

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;

  const { data: session, isPending } = authClient.useSession();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (isPending || !session?.user || !eventId) {
      return;
    }

    let cancelled = false;

    async function loadEvent() {
      setFetching(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/api/events/${eventId}`,
          { cache: "no-store" }
        );

        const data = await response.json();

        if (!response.ok || !data.event) {
          throw new Error(data.message || "Could not load this event.");
        }

        if (!cancelled) {
          setForm({
            title: data.event.title || "",
            description: data.event.description || "",
            eventType: data.event.eventType || "",
            imageUrl: data.event.imageUrl || "",
            location: data.event.location || "",
            eventDate: toLocalDateTime(data.event.eventDate),
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load this event.");
        }
      } finally {
        if (!cancelled) {
          setFetching(false);
        }
      }
    }

    loadEvent();

    return () => {
      cancelled = true;
    };
  }, [isPending, session, eventId]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (
      form.title.trim().length < 5 ||
      form.title.trim().length > 120
    ) {
      setError("Title must contain between 5 and 120 characters.");
      return;
    }

    if (
      form.description.trim().length < 20 ||
      form.description.trim().length > 3000
    ) {
      setError("Description must contain between 20 and 3000 characters.");
      return;
    }

    if (!EVENT_TYPES.includes(form.eventType)) {
      setError("Please select a valid event category.");
      return;
    }

    try {
      const image = new URL(form.imageUrl.trim());

      if (!["http:", "https:"].includes(image.protocol)) {
        throw new Error("Invalid image URL.");
      }
    } catch {
      setError("Please enter a valid HTTP or HTTPS image URL.");
      return;
    }

    if (
      form.location.trim().length < 2 ||
      form.location.trim().length > 200
    ) {
      setError("Location must contain between 2 and 200 characters.");
      return;
    }

    const selectedDate = new Date(form.eventDate);

    if (
      !form.eventDate ||
      Number.isNaN(selectedDate.getTime()) ||
      selectedDate <= new Date()
    ) {
      setError("Please select a future event date and time.");
      return;
    }

    setLoading(true);

    try {
      const tokenResponse = await fetch(
        `${API_URL}/api/auth/token`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        throw new Error(
          "Could not get your authentication token. Please log in again."
        );
      }

      const response = await fetch(
        `${API_URL}/api/events/${eventId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({
            title: form.title.trim(),
            description: form.description.trim(),
            eventType: form.eventType,
            imageUrl: form.imageUrl.trim(),
            location: form.location.trim(),
            eventDate: selectedDate.toISOString(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not update the event."
        );
      }

      router.push(`/events/${eventId}`);
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  }

  if (isPending || !session?.user) {
    return (
      <main className="min-h-screen bg-base-100 p-10 text-center text-base-content">
        Checking your login...
      </main>
    );
  }

  if (fetching) {
    return (
      <main className="min-h-screen bg-base-100 p-10 text-center text-base-content">
        Loading event details...
      </main>
    );
  }

  if (error && !form.title) {
    return (
      <main className="min-h-screen bg-base-100 px-6 py-16 text-base-content">
        <div className="mx-auto max-w-2xl rounded-2xl border border-error/30 p-8 text-center">
          <h1 className="text-2xl font-bold">
            Unable to load event
          </h1>
          <p className="mt-4 text-error">{error}</p>
          <Link
            href="/my-events"
            className="btn btn-primary mt-6 rounded-full"
          >
            Back to My Events
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-100 px-6 py-16 text-base-content">
      <div className="mx-auto max-w-3xl">

        <Link
          href="/my-events"
          className="text-sm font-semibold text-secondary hover:underline"
        >
          ← Back to My Events
        </Link>

        <div className="mb-10 mt-8">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-secondary">
            Update your community event
          </p>

          <h1 className="text-4xl font-extrabold sm:text-5xl">
            Edit Event<span className="text-accent">.</span>
          </h1>

          <p className="mt-4 text-base-content/70">
            Make changes to your event details and keep your community informed.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-base-content/10 bg-base-100 p-6 shadow-sm sm:p-10"
        >
          <div>
            <label htmlFor="title" className="mb-2 block font-semibold">
              Event Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              minLength={5}
              maxLength={120}
              value={form.title}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-2 block font-semibold">
              Event Description
            </label>

            <textarea
              id="description"
              name="description"
              required
              minLength={20}
              maxLength={3000}
              rows={6}
              value={form.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
            />
          </div>

          <div>
            <label htmlFor="eventType" className="mb-2 block font-semibold">
              Event Category
            </label>

            <select
              id="eventType"
              name="eventType"
              required
              value={form.eventType}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="" disabled>
                Choose an event category
              </option>

              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="imageUrl" className="mb-2 block font-semibold">
              Event Image URL
            </label>

            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              required
              maxLength={2048}
              value={form.imageUrl}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label htmlFor="location" className="mb-2 block font-semibold">
              Event Location
            </label>

            <input
              id="location"
              name="location"
              type="text"
              required
              minLength={2}
              maxLength={200}
              value={form.location}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label htmlFor="eventDate" className="mb-2 block font-semibold">
              Event Date and Time
            </label>

            <input
              id="eventDate"
              name="eventDate"
              type="datetime-local"
              required
              value={form.eventDate}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full rounded-full"
          >
            {loading ? "Saving changes..." : "Update Event"}
          </button>

          <p className="text-center text-xs text-base-content/50">
            Your changes will be saved after successful submission.
          </p>
        </form>
      </div>
    </main>
  );
}
