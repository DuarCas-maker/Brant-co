export const budgetRanges = [
  "less_than_500",
  "500_999",
  "1000_1999",
  "2000_2999",
  "3000_4999",
  "5000_7499",
  "7500_plus",
  "not_sure",
] as const;

export type BudgetRange = (typeof budgetRanges)[number];

export const budgetLabelsByLocale = {
  en: {
    less_than_500: "Less than USD 500",
    "500_999": "USD 500–999",
    "1000_1999": "USD 1,000–1,999",
    "2000_2999": "USD 2,000–2,999",
    "3000_4999": "USD 3,000–4,999",
    "5000_7499": "USD 5,000–7,499",
    "7500_plus": "USD 7,500+",
    not_sure: "Not sure yet",
  },
  es: {
    less_than_500: "Menos de USD 500",
    "500_999": "USD 500–999",
    "1000_1999": "USD 1.000–1.999",
    "2000_2999": "USD 2.000–2.999",
    "3000_4999": "USD 3.000–4.999",
    "5000_7499": "USD 5.000–7.499",
    "7500_plus": "USD 7.500+",
    not_sure: "Todavía no estoy seguro",
  },
} satisfies Record<"en" | "es", Record<BudgetRange, string>>;

export type QualificationStatus = "qualified" | "review" | "nurture";

export type ServiceFit =
  | "Growth & Content Systems"
  | "Marketing & Sales Operations"
  | "Automation & Integrations"
  | "Integrated Growth System"
  | "Special Software Project"
  | "Unclear / Needs Discovery";

export type PublicAssessmentResult = {
  status: QualificationStatus;
  potentialFocus: string;
  message: string;
  bookingUrl: string | null;
};
