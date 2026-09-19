import { createHash } from "node:crypto";
import { getServerEnv } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

function getClientAddress(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-real-ip") || forwarded || "unknown";
}

export async function enforceRateLimit(request: Request, scope: string, limit: number) {
  const env = getServerEnv();
  const address = getClientAddress(request);
  const keyHash = createHash("sha256").update(`${env.RATE_LIMIT_SALT}:${scope}:${address}`).digest("hex");
  const now = new Date();
  now.setUTCSeconds(0, 0);

  const { data, error } = await getSupabaseAdmin().rpc("consume_rate_limit", {
    p_key_hash: keyHash,
    p_window_start: now.toISOString(),
    p_limit: limit,
  });
  if (error) {
    console.error("Rate limit check failed", { scope, error: error.message });
    throw new Error("Rate limit unavailable.");
  }
  return data === true;
}
