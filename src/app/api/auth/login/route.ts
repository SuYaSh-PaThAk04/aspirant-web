import { apiPost } from "@/lib/api";

const phonePattern = /^[6-9]\d{9}$/;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { phone?: unknown } | null;
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  if (!phonePattern.test(phone)) {
    return Response.json({ message: "Enter a valid mobile number." }, { status: 400 });
  }

  try {
    const result = await apiPost("/api/public/user/login", { phone });
    if (!result.ok) {
      const message = typeof result.data.message === "string" ? result.data.message : "Could not send the code.";
      return Response.json({ message }, { status: result.status });
    }
    return Response.json({ phone });
  } catch (error) {
    console.error("Could not reach the Aspirant API for login", error);
    return Response.json({ message: "Could not send the code." }, { status: 502 });
  }
}
