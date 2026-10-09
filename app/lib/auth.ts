import "server-only";

import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import Database from "better-sqlite3";
import { betterAuth } from "better-auth";
import type { BetterAuthOptions } from "better-auth";
import { Pool } from "pg";

const databaseDirectory = resolve(process.cwd(), ".data");
const database = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : (() => {
      mkdirSync(databaseDirectory, { recursive: true });
      return new Database(resolve(databaseDirectory, "bazaar-auth.sqlite"));
    })();

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
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret:
    process.env.BETTER_AUTH_SECRET ??
    "bazaar-dor-development-only-secret-do-not-use-in-production",
  database,
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 8,
  },
  socialProviders,
});

export function assertAuthConfiguration() {
  if (process.env.NODE_ENV === "production" && !process.env.BETTER_AUTH_SECRET) {
    throw new Error("BETTER_AUTH_SECRET must be set before enabling authentication in production.");
  }
  if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must point to persistent PostgreSQL storage in production.");
  }
}
