import { captureEvent, readClientEvent } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 4096) {
    return Response.json({ message: "Event is too large." }, { status: 400 });
  }
  const body = await request.json().catch(() => null);
  const event = readClientEvent(body);
  if (!event) {
    return Response.json({ message: "Event is not valid." }, { status: 400 });
  }
  await captureEvent({ request, ...event });
  return new Response(null, { status: 204 });
}
