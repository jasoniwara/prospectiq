import { CATEGORIES, SUBCATEGORIES } from "./questions";

export type Category = (typeof CATEGORIES)[number];

export type Tier = "Weakness" | "Developing" | "Strength" | "Elite";

export function tierForScore(score: number): Tier {
  if (score >= 9) return "Elite";
  if (score >= 7) return "Strength";
  if (score >= 4) return "Developing";
  return "Weakness";
}

const ARCHETYPES: Record<string, string> = {
  "Execution-Knowledge": "The Operator",
  "Execution-Influence": "The Conductor",
  "Execution-Resilience": "The Workhorse",
  "Knowledge-Execution": "The Architect",
  "Knowledge-Influence": "The Authority",
  "Knowledge-Resilience": "The Scholar",
  "Influence-Execution": "The Catalyst",
  "Influence-Knowledge": "The Communicator",
  "Influence-Resilience": "The Anchor",
  "Resilience-Execution": "The Grinder",
  "Resilience-Knowledge": "The Student",
  "Resilience-Influence": "The Rallier",
};

export type AnswerInput = {
  questionId: string;
  category: string;
  subcategory: string;
  value: number;
};

export type SubcategoryScore = {
  subcategory: string;
  score: number;
};

export type CategoryResult = {
  category: Category;
  score: number;
  variance: number;
  tier: Tier;
  subcategories: SubcategoryScore[];
};

export type ScoringResult = {
  categories: CategoryResult[]; // ranked highest to lowest
  primary: Category;
  secondary: Category;
  archetype: string;
};

function calcVariance(scores: number[]): number {
  const mean = scores.reduce((s, v) => s + v, 0) / scores.length;
  return scores.reduce((s, v) => s + (v - mean) ** 2, 0) / scores.length;
}

export function computeScores(answers: AnswerInput[]): ScoringResult {
  const categories: CategoryResult[] = CATEGORIES.map((category) => {
    const subNames = SUBCATEGORIES[category];
    const subcategories: SubcategoryScore[] = subNames.map((sub) => {
      const answer = answers.find(
        (a) => a.category === category && a.subcategory === sub
      );
      return { subcategory: sub, score: answer ? answer.value : 0 };
    });
    const subScores = subcategories.map((s) => s.score);
    const score =
      Math.round(
        (subScores.reduce((sum, v) => sum + v, 0) / subScores.length) * 10
      ) / 10;
    const variance = calcVariance(subScores);
    return { category, score, variance, tier: tierForScore(score), subcategories };
  });

  const ranked = [...categories].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    // Tie: lower variance wins (more consistent strength)
    return a.variance - b.variance;
  });

  const primary = ranked[0].category;
  const secondary = ranked[1].category;
  const archetype = ARCHETYPES[`${primary}-${secondary}`];

  return { categories: ranked, primary, secondary, archetype };
}
