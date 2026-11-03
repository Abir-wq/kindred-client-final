"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "../../lib/auth-client";
import { GITHUB_AUTH_ENABLED } from "../../lib/api-url";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  const isBusy = loading || githubLoading;

  async function handleSubmit(event) {
    event.preventDefault();

    if (isBusy) return;

    setError("");
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(
          result.error.message ||
            "Login failed. Please check your details."
        );
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGithubSignIn() {
    if (isBusy) return;

    setError("");
    setGithubLoading(true);

    try {
      const result = await authClient.signIn.social({
        provider: "github",
        callbackURL: `${window.location.origin}/`,
      });

      if (result.error) {
        setError(
          result.error.message ||
            "Could not start GitHub sign-in. Please try again."
        );
        setGithubLoading(false);
      }
    } catch (err) {
      setError(
        err.message ||
          "Could not connect to GitHub sign-in. Please try again."
      );
      setGithubLoading(false);
    }
  }

  return (
    <main className="flex min-h-[75vh] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-base-content/10 bg-base-100 p-8 shadow-xl">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-3xl font-extrabold tracking-tight"
          >
            kindred<span className="text-accent">.</span>
          </Link>

          <h1 className="mt-6 text-2xl font-bold">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-base-content/60">
            Sign in to continue building your community.
          </p>
        </div>

        {error && (
          <p
            id="login-error"
            role="alert"
            className="mb-5 rounded-xl bg-error/10 p-3 text-sm text-error"
          >
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          aria-describedby={error ? "login-error" : undefined}
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              disabled={isBusy}
              className="input input-bordered w-full rounded-xl"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              disabled={isBusy}
              className="input input-bordered w-full rounded-xl"
            />
          </div>

          <button
            type="submit"
            disabled={isBusy}
            className="btn btn-primary w-full rounded-full"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {GITHUB_AUTH_ENABLED && (
          <>
            <div className="divider my-6 text-xs text-base-content/50">
              OR
            </div>

            <button
              type="button"
              onClick={handleGithubSignIn}
              disabled={isBusy}
              className="btn btn-outline w-full rounded-full"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M12 .75a11.25 11.25 0 0 0-3.558 21.923c.563.104.768-.244.768-.542 0-.267-.01-.974-.015-1.912-3.13.68-3.79-1.51-3.79-1.51-.512-1.3-1.25-1.646-1.25-1.646-1.022-.699.077-.685.077-.685 1.13.08 1.725 1.16 1.725 1.16 1.005 1.722 2.638 1.224 3.28.936.102-.727.393-1.224.715-1.506-2.499-.284-5.126-1.25-5.126-5.563 0-1.23.44-2.233 1.16-3.02-.116-.284-.503-1.43.11-2.98 0 0 .945-.302 3.094 1.154A10.8 10.8 0 0 1 12 6.19c.956.004 1.918.13 2.816.379 2.148-1.456 3.092-1.154 3.092-1.154.615 1.55.228 2.696.112 2.98.722.787 1.158 1.79 1.158 3.02 0 4.324-2.631 5.276-5.138 5.554.404.35.765 1.042.765 2.1 0 1.516-.014 2.738-.014 3.11 0 .3.203.65.774.54A11.25 11.25 0 0 0 12 .75Z" />
              </svg>

              {githubLoading
                ? "Redirecting to GitHub..."
                : "Continue with GitHub"}
            </button>
          </>
        )}

        <p className="mt-6 text-center text-sm text-base-content/60">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
