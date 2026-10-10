import "server-only";

import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import type { BetterAuthOptions } from "better-auth";
import { authDb } from "./mongodb";
import { nextCookies } from "better-auth/next-js";

const socialProviders: NonNullable<BetterAuthOptions["socialProviders"]> = {};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  appName: "বাজার দর",
  baseURL: process.env.BETTER_AUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  trustedOrigins: process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`, process.env.BETTER_AUTH_URL].filter(Boolean) as string[] : undefined,
  secret:
    process.env.BETTER_AUTH_SECRET ??
    "bazaar-dor-development-only-secret-do-not-use-in-production",
  database: mongodbAdapter(authDb),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 8,
  },
  socialProviders,
  plugins: [nextCookies()],
});

export function assertAuthConfiguration() {
  if (process.env.NODE_ENV === "production" && !process.env.BETTER_AUTH_SECRET) {
    throw new Error("BETTER_AUTH_SECRET must be set before enabling authentication in production.");
  }
  if (process.env.NODE_ENV === "production" && !process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI must point to a persistent MongoDB database in production.");
  }
  if (process.env.NODE_ENV === "production" && !process.env.MONGODB_AUTH_DB) {
    throw new Error("MONGODB_AUTH_DB must be set so auth data is isolated from app data.");
  }
}
