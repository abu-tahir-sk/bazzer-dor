import { toNextJsHandler } from "better-auth/next-js";
import { assertAuthConfiguration, auth } from "../../../lib/auth";

const handlers = toNextJsHandler(auth);

export async function GET(request: Request) {
  assertAuthConfiguration();
  return handlers.GET(request);
}

export async function POST(request: Request) {
  assertAuthConfiguration();
  return handlers.POST(request);
}
