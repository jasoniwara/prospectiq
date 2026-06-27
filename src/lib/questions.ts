export type Question = {
  id: string;
  text: string;
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
  text: "Your teacher hands out a multiple choice assignment. On a scale of 1-10, how closely do you read the instructions?",
  category: "Execution",
  subcategory: "Attention to Detail",
};

const SCHOOL_2: Question = {
  id: "school-2",
  text: "Your team loses an important game and it's your fault. On a scale of 1-10, how much of the blame do you absorb, rather than deflect?",
  category: "Execution",
  subcategory: "Ownership",
};

const SCHOOL_3: Question = {
  id: "school-3",
  text: "You have an exam coming up the following Monday on a topic you feel 'aight' about. Over the weekend, how hard are you studying?",
  category: "Execution",
  subcategory: "Work Ethic",
};

const SCHOOL_4: Question = {
  id: "school-4",
  text: "You have an exam coming up the following Monday on a topic you didn't pay attention to in class. Over the weekend, how hard are you studying?",
  category: "Execution",
  subcategory: "Preparation",
};

const SCHOOL_5: Question = {
  id: "school-5",
  text: "You're able to sit with the richest person alive for a conversation to pick their brain. If someone asked afterwards what your plan was to make money, on a scale of 1-10, how successful do you think your plan would be?",
  category: "Knowledge",
  subcategory: "Capacity",
};

const SCHOOL_6: Question = {
  id: "school-6",
  text: "You watch a YouTube video about a really interesting topic. On a scale of 1-10, how far down the rabbit hole do you go before moving on to the next video?",
  category: "Knowledge",
  subcategory: "Curiosity",
};

const SCHOOL_7: Question = {
  id: "school-7",
  text: "You're using ChatGPT to help you on an assignment graded on accuracy, but ChatGPT can always be wrong. On a scale of 1-10, assuming you can't use other sources, how likely are you to do the problems yourself?",
  category: "Knowledge",
  subcategory: "Critical Thinking",
};

const SCHOOL_8: Question = {
  id: "school-8",
  text: "Your teacher is coming around to collect homework, and you have one problem left to solve. You need this 100. On a scale of 1-10, how likely are you to pick the one that feels right rather than try to solve it?",
  category: "Knowledge",
  subcategory: "Intuition",
};

const LOSS_1: Question = {
  id: "loss-1",
  text: "Your team loses an important game and it's your fault. On a scale of 1-10, how well do you take the sometimes brutally honest criticism and make adjustments?",
  category: "Resilience",
  subcategory: "Coachability",
};

const LOSS_2: Question = {
  id: "loss-2",
  text: "A class has daily warmups that are easy but annoying. On a scale of 1-10, how much dedication will you put into completing those warmups to the best of your ability?",
  category: "Resilience",
  subcategory: "Discipline",
};

const LOSS_3: Question = {
  id: "loss-3",
  text: "Your team loses an important game and it's your fault. On a scale of 1-10, how often do you take responsibility for the loss without someone else verbally handing it to you?",
  category: "Resilience",
  subcategory: "Accountability",
};

const GROUP_1: Question = {
  id: "group-1",
  text: "You're in a group project and you barely know anyone else in the group. On a scale of 1-10, how likely are you to share your ideas and offer feedback?",
  category: "Influence",
  subcategory: "Vocality",
};

const GROUP_2: Question = {
  id: "group-2",
  text: "You're in a group project and you barely know anyone else in the group. You all have to make a decision on how you'll move forward. On a scale of 1-10, how likely is it that you'll be the one to choose how the group progresses?",
  category: "Influence",
  subcategory: "Decisiveness",
};

const GROUP_3: Question = {
  id: "group-3",
  text: "You're in a group project and you barely know anyone else in the group. On a scale of 1-10, how likely is it that you'll be the first one to introduce yourself?",
  category: "Influence",
  subcategory: "Initiative",
};

const GROUP_4: Question = {
  id: "group-4",
  text: "You're in a group project and you barely know anyone else in the group. A member of the group lets you know that they're going to miss a big deadline due to a family emergency. On a scale of 1-10, how likely are you to follow up with that group member while they've gone or after they've returned?",
  category: "Influence",
  subcategory: "Consideration",
};

const MISC_1: Question = {
  id: "misc-1",
  text: "You're in a group project and you barely know anyone else in the group. One member is out sick for the next week, and they had the most important part of the project. On a scale of 1-10, how confident are you that you can direct your team through the changing responsibilities?",
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
