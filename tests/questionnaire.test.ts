import { describe, expect, it } from "vitest";
import { getQuestionnaire } from "@/content/questionnaire";

describe("five-question assessment contract", () => {
  it.each(["en", "es"] as const)("defines the same five questions in %s", (locale) => {
    const questions = getQuestionnaire(locale);
    expect(questions).toHaveLength(5);
    expect(questions.map((question) => question.id)).toEqual(["challenges", "priority", "decisionStage", "budgetRange", "businessContext"]);
    expect(questions[0].kind).toBe("multi");
    expect(questions[0].allowOther).toBe(true);
    expect(questions[1].kind).toBe("single");
    expect(questions[1].allowOther).toBe(true);
    expect(questions[2].allowOther).not.toBe(true);
    expect(questions[3].allowOther).not.toBe(true);
    expect(questions[4].kind).toBe("text");
  });

  it("uses the requested Spanish wording and available options", () => {
    const questions = getQuestionnaire("es");
    expect(questions[0].options?.map((option) => option.value)).not.toContain("unclear");
    expect(questions[1].options?.map((option) => option.value)).not.toContain("unknown");
    expect(questions[2].title).toBe("¿Qué tan cerca están de tomar una decisión sobre este proyecto?");
    expect(questions[2].options?.map((option) => option.value)).not.toContain("approved_90");
    expect(questions[3].title).toBe("¿Qué rango de inversión han reservado?");
    expect(questions[3].options?.at(-1)).toEqual({ value: "5000_plus", label: "USD 5.000 o más" });
    expect(questions[4].title).toBe("En unas pocas líneas, cuéntanos a qué se dedica la empresa, cuántas personas forman el equipo, cómo funciona actualmente el proceso que quieres mejorar y dónde está el principal bloqueo.");
  });
});
