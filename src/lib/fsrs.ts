import { fsrs, generatorParameters, Rating, State, type Card } from "ts-fsrs";
import type { Question } from "@prisma/client";

// Initialize FSRS with default parameters
const params = generatorParameters();
const f = fsrs(params);

// Convert Prisma Question to FSRS Card
export function questionToCard(question: Question): Card {
  return {
    due: question.due,
    stability: question.stability,
    difficulty: question.difficulty,
    elapsed_days: question.elapsedDays,
    scheduled_days: question.scheduledDays,
    learning_steps: question.learningSteps,
    reps: question.reps,
    lapses: question.lapses,
    state: question.state as State,
    last_review: question.lastReview ?? undefined,
  };
}

// Convert FSRS Card to Prisma Question update data
export function cardToQuestionUpdate(card: Card) {
  return {
    due: card.due,
    stability: card.stability,
    difficulty: card.difficulty,
    elapsedDays: card.elapsed_days,
    scheduledDays: card.scheduled_days,
    learningSteps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    lastReview: card.last_review,
  };
}

// Process a review and return updated card data
export function processReview(question: Question, rating: Rating, now = new Date()) {
  const card = questionToCard(question);
  const schedulingCards = f.repeat(card, now);
  
  // Select the appropriate card based on rating
  let updatedCard: Card;
  switch (rating) {
    case Rating.Again:
      updatedCard = schedulingCards[Rating.Again].card;
      break;
    case Rating.Hard:
      updatedCard = schedulingCards[Rating.Hard].card;
      break;
    case Rating.Good:
      updatedCard = schedulingCards[Rating.Good].card;
      break;
    case Rating.Easy:
      updatedCard = schedulingCards[Rating.Easy].card;
      break;
    default:
      updatedCard = schedulingCards[Rating.Good].card;
  }
  
  return cardToQuestionUpdate(updatedCard);
}

// Get scheduling options for a question
export function getSchedulingOptions(question: Question, now = new Date()) {
  const card = questionToCard(question);
  return f.repeat(card, now);
}

// Export Rating and State enums for use in other files
export { Rating, State };

// Helper to check if a question is due for review
export function isDue(question: Question, now = new Date()): boolean {
  return question.due <= now;
}

// Helper to get default FSRS values for new questions
export function getDefaultFSRSValues() {
  return {
    due: new Date(),
    stability: 4.0,
    difficulty: 5.0,
    elapsedDays: 0,
    scheduledDays: 0,
    learningSteps: 0,
    reps: 0,
    lapses: 0,
    state: State.New,
    lastReview: null,
  };
}