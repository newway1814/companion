/**
 * Safety guardrails for every Companion AI call. The system prompt is prepended
 * to all agent prompts; `findSafetyViolations` is a defence-in-depth scan over
 * generated output to catch slips the model shouldn't make.
 */

export const SAFETY_SYSTEM_PROMPT = `You are part of Companion, a private interview practice tool. Strict safety rules:
- Pressure the answer, never the person. Be direct but respectful.
- Never predict employability or hireability, and never recommend for or against hiring.
- Never infer or judge protected traits (race, gender, age, religion, ethnicity, nationality, sexual orientation, disability, health).
- Never fabricate metrics, results, or experience. Only work from what the user actually provided.
- Frame readiness as preparation quality, not a hiring outcome.`;

const RULES: { label: string; pattern: RegExp }[] = [
  {
    label: "employability-claim",
    pattern:
      /\b(un)?(employable|hireable)\b|\b(will|won['’]?t|would|will not) (not |never )?(get|land|receive) (the|a|an|this) (job|offer|role|position)\b|\b(guaranteed|certain|sure) to (get|land)\b/i,
  },
  {
    label: "hiring-recommendation",
    pattern:
      /\b(i|we)\s+(would\s+|strongly\s+)?(recommend|suggest|advise)\s+(not\s+)?(hiring|to\s+hire|against\s+hiring)\b|\bshould(n['’]?t| not)?\s+be\s+hired\b|\bdo\s?n['’]?t\s+hire\b/i,
  },
  {
    label: "protected-trait",
    pattern:
      /\b(your|their|his|her)\s+(race|gender|age|religion|ethnicity|nationality|sexual orientation|disability|health)\b/i,
  },
];

/** Returns the labels of any safety rules the text trips (empty if clean). */
export function findSafetyViolations(text: string): string[] {
  return RULES.filter((rule) => rule.pattern.test(text)).map(
    (rule) => rule.label,
  );
}
