import { z } from "zod";
import { budgetRanges } from "@/types/discovery";

const localeSchema = z.enum(["en", "es"]).default("en");

const safeText = (minimum: number, maximum: number) =>
  z.string().trim().min(minimum).max(maximum).refine((value) => !/[<>]/.test(value), {
    message: "Please remove angle brackets.",
  });

export const leadCaptureSchema = z.object({
  name: safeText(2, 80),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  phone: z
    .string()
    .trim()
    .min(7)
    .max(24)
    .regex(/^\+?[0-9()\-\s.]+$/, "Enter a valid WhatsApp number."),
  idempotencyKey: z.string().uuid(),
  locale: localeSchema,
});

export const discoveryMessageSchema = z.object({
  leadId: z.string().uuid(),
  turn: z.number().int().min(1).max(4),
  message: safeText(2, 3000),
  locale: localeSchema,
});

export const finalizeDiscoverySchema = z.object({
  leadId: z.string().uuid(),
  budgetRange: z.enum(budgetRanges),
  locale: localeSchema,
});

export type LeadCaptureInput = z.infer<typeof leadCaptureSchema>;
export type DiscoveryMessageInput = z.infer<typeof discoveryMessageSchema>;
