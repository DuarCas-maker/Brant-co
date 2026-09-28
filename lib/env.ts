import { z } from "zod";

const serverEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  RATE_LIMIT_SALT: z.string().min(16),
});

const discoveryEnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(20),
  OPENAI_DISCOVERY_MODEL: z.string().min(1).default("gpt-5-mini"),
});

export class ConfigurationError extends Error {
  constructor(message = "Server configuration is incomplete.") {
    super(message);
    this.name = "ConfigurationError";
  }
}

export function getServerEnv() {
  const result = serverEnvSchema.safeParse(process.env);
  if (!result.success) {
    console.error("Server configuration validation failed", {
      fields: result.error.issues.map((issue) => issue.path.join(".")),
    });
    throw new ConfigurationError();
  }
  return result.data;
}

export function getDiscoveryEnv() {
  const result = discoveryEnvSchema.safeParse(process.env);
  if (!result.success) {
    console.error("Guided assessment configuration validation failed", {
      fields: result.error.issues.map((issue) => issue.path.join(".")),
    });
    throw new ConfigurationError("Guided assessment configuration is incomplete.");
  }
  return result.data;
}
