import { describe, expect, it } from "vitest";
import { handleApiFailure } from "@/lib/api-response";
import { ConfigurationError } from "@/lib/env";
import { DiscoveryProviderError } from "@/lib/openai/discovery";

describe("safe API failures", () => {
  it("returns a recoverable OpenAI error without provider details", async () => {
    const response = handleApiFailure(new DiscoveryProviderError());
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error: "We couldn't process that response right now. Your answer is safe—please retry.",
    });
  });

  it("returns a safe missing-configuration message", async () => {
    const response = handleApiFailure(new ConfigurationError());
    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.error).not.toContain("KEY");
  });

  it("does not expose persistence errors", async () => {
    const response = handleApiFailure(new Error("SUPABASE_SERVICE_ROLE_KEY=secret"));
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).not.toContain("secret");
  });
});
