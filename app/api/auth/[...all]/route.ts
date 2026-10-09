import { getMigrations } from "better-auth/db/migration";
import { toNextJsHandler } from "better-auth/next-js";
import { assertAuthConfiguration, auth } from "../../../lib/auth";

const handlers = toNextJsHandler(auth);
let migrationPromise: Promise<void> | undefined;

async function prepareAuth() {
  assertAuthConfiguration();
  if (!migrationPromise) {
    migrationPromise = (async () => {
      const migrations = await getMigrations(auth.options);
      if (migrations.toBeCreated.length || migrations.toBeAdded.length) {
        await migrations.runMigrations();
      }
    })().catch((error: unknown) => {
      migrationPromise = undefined;
      throw error;
    });
  }
  await migrationPromise;
}

export async function GET(request: Request) {
  await prepareAuth();
  return handlers.GET(request);
}

export async function POST(request: Request) {
  await prepareAuth();
  return handlers.POST(request);
}
