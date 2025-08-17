import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import fs from "fs/promises";
import path from "path";

// Initialize Google Gemini model
const model = google("gemini-2.0-flash");

interface Flashcard {
  question: string;
  answer: string;
}

/**
 * Generate flashcard questions from context using Google Gemini
 * @param contextText The text content to generate questions from
 * @returns Array of flashcard Q&A pairs
 */
export async function generateQuestions(contextText: string): Promise<Flashcard[]> {
  try {
    // Read the prompt template
    const promptPath = path.join(process.cwd(), "src", "question_generation_prompt.md");
    const promptTemplate = await fs.readFile(promptPath, "utf-8");
    
    // Replace {{Topic}} with the actual context
    const prompt = promptTemplate.replace("{{Topic}}", contextText);
    
    // Call Gemini to generate flashcards
    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.7,
      maxRetries: 2,
    });
    
    // Parse the response to extract flashcards
    const flashcards = parseFlashcards(text);
    
    return flashcards;
  } catch (error) {
    console.error("Error generating questions:", error);
    return [];
  }
}

/**
 * Parse AI response to extract flashcard Q&A pairs
 * @param text The AI response containing flashcard tags
 * @returns Array of parsed flashcards
 */
function parseFlashcards(text: string): Flashcard[] {
  const flashcards: Flashcard[] = [];
  
  // Regular expression to match flashcard tags
  const flashcardRegex = /<flashcard>\s*Q:\s*(.*?)\s*A:\s*(.*?)\s*(?:Explanation:.*?)?\s*<\/flashcard>/gs;
  
  let match;
  while ((match = flashcardRegex.exec(text)) !== null) {
    const question = match[1]?.trim();
    const answer = match[2]?.trim();
    
    if (question && answer) {
      flashcards.push({
        question,
        answer,
      });
    }
  }
  
  return flashcards;
}