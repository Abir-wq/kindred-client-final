"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "../../lib/auth-client";

export default function AuthStatus() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const result = await authClient.signOut();

      if (result?.error) {
        throw new Error(result.error.message || "Could not sign out.");
      }

      router.replace("/");
      router.refresh();
    } catch (err) {
      setError(err.message || "Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (isPending) return null;

  if (session?.user) {
    return (
      <div className="flex flex-col items-end gap-1">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          className="btn btn-primary rounded-full px-5"
        >
          {loading ? "Signing out..." : "Logout"}
        </button>
        {error && (
          <span role="alert" className="max-w-56 text-right text-xs text-error">
            {error}
          </span>
        )}
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="btn btn-primary rounded-full px-5"
    >
      Login
    </Link>
  );
}
