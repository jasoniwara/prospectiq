export type Question = {
  id: string;
  text: string;
  labelLow: string;
  labelHigh: string;
  category: "Execution" | "Knowledge" | "Influence" | "Resilience";
  subcategory: string;
};

export type QuestionGroup = {
  id: string;
  title: string;
  questions: Question[];
};

const SCHOOL_1: Question = {
  id: "school-1",
  text: "Your teacher hands out an assignment. How closely do you read the instructions before starting?",
  labelLow: "I dive straight in",
  labelHigh: "I read everything twice",
  category: "Execution",
  subcategory: "Attention to Detail",
};

const SCHOOL_2: Question = {
  id: "school-2",
  text: "Your team loses because of you. How much of the blame do you absorb?",
  labelLow: "I look outward",
  labelHigh: "I look inward",
  category: "Execution",
  subcategory: "Ownership",
};

const SCHOOL_3: Question = {
  id: "school-3",
  text: "You have an exam Monday on a topic you're just okay at. How hard are you studying this weekend?",
  labelLow: "I wing it",
  labelHigh: "I grind it out",
  category: "Execution",
  subcategory: "Work Ethic",
};

const SCHOOL_4: Question = {
  id: "school-4",
  text: "You have an exam Monday on a topic you ignored all semester. How hard are you studying this weekend?",
  labelLow: "I take my chances",
  labelHigh: "I make up for it",
  category: "Execution",
  subcategory: "Preparation",
};

const SCHOOL_5: Question = {
  id: "school-5",
  text: "You get an hour with the richest person alive. How strong is your money plan afterwards?",
  labelLow: "I walk away empty",
  labelHigh: "I walk away with a plan",
  category: "Knowledge",
  subcategory: "Capacity",
};

const SCHOOL_6: Question = {
  id: "school-6",
  text: "You find a video on a topic you've never thought about. How far down the rabbit hole do you go?",
  labelLow: "I move on quickly",
  labelHigh: "I go all the way down",
  category: "Knowledge",
  subcategory: "Curiosity",
};

const SCHOOL_7: Question = {
  id: "school-7",
  text: "AI is doing your graded assignment but might be wrong. How likely are you to just do it yourself?",
  labelLow: "I trust the AI",
  labelHigh: "I trust myself",
  category: "Knowledge",
  subcategory: "Critical Thinking",
};

const SCHOOL_8: Question = {
  id: "school-8",
  text: "One problem left on your homework. Teacher's coming. You need a 100. How likely are you to go with your gut?",
  labelLow: "I skip it",
  labelHigh: "I go with my gut",
  category: "Knowledge",
  subcategory: "Intuition",
};

const LOSS_1: Question = {
  id: "loss-1",
  text: "Your team loses because of you. How well do you take the criticism and adjust?",
  labelLow: "I tune it out",
  labelHigh: "I take it and adjust",
  category: "Resilience",
  subcategory: "Coachability",
};

const LOSS_2: Question = {
  id: "loss-2",
  text: "Daily warmups. Easy but annoying. How much effort do you put in every time?",
  labelLow: "I go through the motions",
  labelHigh: "I give it everything",
  category: "Resilience",
  subcategory: "Discipline",
};

const LOSS_3: Question = {
  id: "loss-3",
  text: "Your team loses because of you. How likely are you to own it before anyone says a word?",
  labelLow: "I wait to be called out",
  labelHigh: "I step up first",
  category: "Resilience",
  subcategory: "Accountability",
};

const GROUP_1: Question = {
  id: "group-1",
  text: "Group project, strangers. How likely are you to speak up and give feedback?",
  labelLow: "I stay quiet",
  labelHigh: "I speak up",
  category: "Influence",
  subcategory: "Vocality",
};

const GROUP_2: Question = {
  id: "group-2",
  text: "Your group is stuck on a decision. How likely are you to be the one who makes the call?",
  labelLow: "I wait for someone else",
  labelHigh: "I make the call",
  category: "Influence",
  subcategory: "Decisiveness",
};

const GROUP_3: Question = {
  id: "group-3",
  text: "Room full of people you don't know. How likely are you to introduce yourself first?",
  labelLow: "I wait to be approached",
  labelHigh: "I go first",
  category: "Influence",
  subcategory: "Initiative",
};

const GROUP_4: Question = {
  id: "group-4",
  text: "A group member misses a deadline for a family emergency. How likely are you to check in?",
  labelLow: "I move on",
  labelHigh: "I check in",
  category: "Influence",
  subcategory: "Consideration",
};

const MISC_1: Question = {
  id: "misc-1",
  text: "Your most important group member goes out sick for a week. How confident are you directing the team through it?",
  labelLow: "I freeze up",
  labelHigh: "I take control",
  category: "Resilience",
  subcategory: "Adaptability",
};

export const QUESTION_GROUPS: QuestionGroup[] = [
  {
    id: "school",
    title: "At School",
    questions: [SCHOOL_1, SCHOOL_3, SCHOOL_4, SCHOOL_7, SCHOOL_8, LOSS_2],
  },
  {
    id: "loss",
    title: "After a Loss",
    questions: [LOSS_1, LOSS_3, SCHOOL_2],
  },
  {
    id: "group",
    title: "In a Group Project",
    questions: [GROUP_1, GROUP_2, GROUP_3, GROUP_4, MISC_1],
  },
  {
    id: "misc",
    title: "Miscellaneous",
    questions: [SCHOOL_5, SCHOOL_6],
  },
];

export const ALL_QUESTIONS: Question[] = QUESTION_GROUPS.flatMap((g) => g.questions);

export const CATEGORIES = ["Execution", "Knowledge", "Influence", "Resilience"] as const;

export const SUBCATEGORIES: Record<string, string[]> = {
  Execution: ["Attention to Detail", "Ownership", "Work Ethic", "Preparation"],
  Knowledge: ["Capacity", "Curiosity", "Critical Thinking", "Intuition"],
  Influence: ["Vocality", "Decisiveness", "Initiative", "Consideration"],
  Resilience: ["Coachability", "Discipline", "Accountability", "Adaptability"],
};
