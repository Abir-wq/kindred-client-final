const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const API_URL = configuredApiUrl.replace(/\/+$/, "");

export const GITHUB_AUTH_ENABLED =
  process.env.NEXT_PUBLIC_GITHUB_AUTH_ENABLED === "true";
