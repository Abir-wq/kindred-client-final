"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "../../lib/auth-client";
import { GITHUB_AUTH_ENABLED } from "../../lib/api-url";

export default function LinkGithubPage() {
  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLinkGithub() {
    if (loading || !session) return;

    setError("");
    setLoading(true);

    try {
      const result = await authClient.linkSocial({
        provider: "github",
        callbackURL: `${window.location.origin}/`,
      });

      if (result.error) {
        setError(
          result.error.message || "Could not link GitHub. Please try again."
        );
        setLoading(false);
      }
    } catch (err) {
      setError(
        err.message || "Could not connect to GitHub. Please try again."
      );
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-12">
      <section className="w-full max-w-md rounded-3xl border border-base-content/10 bg-base-100 p-8 shadow-xl">
        <h1 className="text-2xl font-bold">Connect your GitHub account</h1>

        {isPending ? (
          <p className="mt-4" role="status">
            Checking your sign-in…
          </p>
        ) : !GITHUB_AUTH_ENABLED ? (
          <div className="mt-4">
            <p>GitHub sign-in is not enabled for this deployment. You can continue using your email and password.</p>
            <Link
              href="/login"
              className="btn btn-primary mt-6 rounded-full"
            >
              Go to login
            </Link>
          </div>
        ) : !session ? (
          <div className="mt-4">
            <p>Please sign in with your email and password first.</p>
            <Link
              href="/login"
              className="btn btn-primary mt-6 rounded-full"
            >
              Go to login
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-4 text-sm text-base-content/70">
              Link GitHub to your current Kindred account so you can use
              either GitHub or your email and password to sign in.
            </p>

            <p className="mt-3 text-sm text-base-content/70">
              Use the GitHub account with the same email address as your
              Kindred account.
            </p>

            {error && (
              <p
                role="alert"
                className="mt-5 rounded-xl bg-error/10 p-3 text-sm text-error"
              >
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleLinkGithub}
              disabled={loading}
              className="btn btn-primary mt-6 w-full rounded-full"
            >
              {loading ? "Opening GitHub…" : "Link my GitHub account"}
            </button>
          </>
        )}
      </section>
    </main>
  );
}
