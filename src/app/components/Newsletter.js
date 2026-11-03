
"use client";

import { useState } from "react";
import { API_URL } from "../../lib/api-url";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubscribe(e) {
    e.preventDefault();
    setStatus("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Subscription failed.");
      }

      setStatus(data.message || "Successfully subscribed!");
      setEmail("");
    } catch (error) {
      setStatus(error.message || "Could not subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="mx-auto max-w-6xl px-6 pb-16"
    >
      <div className="grid gap-8 rounded-3xl bg-base-200 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="kindred-muted text-xs font-bold uppercase tracking-widest">
            Stay connected
          </p>

          <h2 id="newsletter-heading" className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            A little inspiration.
            <br />
            A bigger difference.
          </h2>

          <p className="kindred-muted mt-4 max-w-lg leading-7">
            Community stories, volunteering ideas, and opportunities to
            give back—all in one place.
          </p>
        </div>

        <div>
          <form onSubmit={handleSubscribe}>
            <label htmlFor="newsletter-email" className="mb-3 block text-sm font-semibold">
              Your email address
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="newsletter-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input min-w-0 w-full flex-1 rounded-full bg-base-100"
              />

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary rounded-full px-6"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
          </form>

          <p role="status" aria-live="polite" className="mt-3 text-xs leading-6">
            {status || "Join the Kindred community newsletter."}
          </p>
        </div>
      </div>
    </section>
  );
}
