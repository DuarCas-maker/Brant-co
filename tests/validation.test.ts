import { describe, expect, it } from "vitest";
import { discoveryMessageSchema, finalizeDiscoverySchema, leadCaptureSchema } from "@/lib/validation/schemas";

const uuid = "550e8400-e29b-41d4-a716-446655440000";

describe("lead capture validation", () => {
  it("accepts valid contact details", () => {
    expect(leadCaptureSchema.safeParse({ name: "Alex Rivera", email: "ALEX@example.com", phone: "+34 600 000 000", idempotencyKey: uuid }).success).toBe(true);
  });

  it("accepts and preserves a supported locale", () => {
    const parsed = leadCaptureSchema.parse({ name: "Alex Rivera", email: "alex@example.com", phone: "+34 600 000 000", idempotencyKey: uuid, locale: "es" });
    expect(parsed.locale).toBe("es");
  });

  it("rejects invalid email, empty fields and malformed phone", () => {
    expect(leadCaptureSchema.safeParse({ name: "", email: "invalid", phone: "abc", idempotencyKey: uuid }).success).toBe(false);
  });
});

describe("discovery validation", () => {
  it("allows only text turns 1 through 4", () => {
    expect(discoveryMessageSchema.safeParse({ leadId: uuid, turn: 4, message: "A useful answer" }).success).toBe(true);
    expect(discoveryMessageSchema.safeParse({ leadId: uuid, turn: 5, message: "Free text budget" }).success).toBe(false);
  });

  it("rejects invalid ids and excessive messages", () => {
    expect(discoveryMessageSchema.safeParse({ leadId: "bad", turn: 1, message: "x".repeat(3001) }).success).toBe(false);
  });

  it("requires a valid budget at finalization", () => {
    expect(finalizeDiscoverySchema.safeParse({ leadId: uuid, budgetRange: "1000_1999" }).success).toBe(true);
    expect(finalizeDiscoverySchema.safeParse({ leadId: uuid, budgetRange: "custom" }).success).toBe(false);
  });
});
