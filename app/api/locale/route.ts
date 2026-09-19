import { NextResponse } from "next/server";
import { z } from "zod";
import { localeCookieName } from "@/lib/i18n/config";

const localePreferenceSchema = z.object({
  locale: z.enum(["en", "es"]),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = localePreferenceSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid locale." }, { status: 400 });

  const response = NextResponse.json({ locale: parsed.data.locale });
  response.cookies.set(localeCookieName, parsed.data.locale, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
