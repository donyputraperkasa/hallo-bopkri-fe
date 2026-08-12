import { forward } from "@/lib/backend";

type Context = { params: Promise<{ path: string[] }> };

export const GET = (request: Request, context: Context) =>
  forward(request, context, true);

export const POST = (request: Request, context: Context) =>
  forward(request, context, true);

export const PATCH = (request: Request, context: Context) =>
  forward(request, context, true);
