import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import type { Question } from "@prisma/client";

// Transcribe audio using OpenAI Whisper
export async function transcribeAudio(audioBase64: string): Promise<string> {
  // Convert base64 to buffer
  const audioBuffer = Buffer.from(audioBase64, 'base64');
  
  // Create a File-like object from the buffer
  const audioFile = new File([audioBuffer], 'audio.webm', { type: 'audio/webm' });
  
  // Create FormData and append the file
  const formData = new FormData();
  formData.append('file', audioFile);
  formData.append('model', 'whisper-1');
  
  // Call OpenAI Whisper API directly
  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error(`Transcription failed: ${response.statusText}`);
  }
  
  const result = await response.json() as { text: string };
  return result.text;
}

// Evaluate answer using Google Gemini
export async function evaluateAnswer(
  userAnswer: string,
  correctAnswer: string,
  question: string
): Promise<{ feedback: string; score: number }> {
  const prompt = `
You are evaluating a student's answer to a flashcard question.

Question: ${question}
Correct Answer: ${correctAnswer}
Student's Answer: ${userAnswer}

Evaluate the student's answer and provide:
1. Brief, encouraging feedback (1-2 sentences)
2. A score from 1-4 based on accuracy:
   - 1 (Again): Completely wrong or no understanding
   - 2 (Hard): Partially correct but significant gaps
   - 3 (Good): Mostly correct with minor issues
   - 4 (Easy): Perfect or near-perfect answer

Respond in JSON format:
{
  "feedback": "Your encouraging feedback here",
  "score": 1-4
}
`;

  try {
    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      prompt,
      temperature: 0.3, // Lower temperature for consistent evaluation
    });
    
    // Clean the response - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.slice(7); // Remove ```json
    }
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.slice(3); // Remove ```
    }
    if (cleanedText.endsWith('```')) {
      cleanedText = cleanedText.slice(0, -3); // Remove trailing ```
    }
    cleanedText = cleanedText.trim();
    
    // Parse the JSON response
    const result = JSON.parse(cleanedText) as { feedback: string; score: number };
    
    // Ensure score is within valid range
    if (result.score < 1) result.score = 1;
    if (result.score > 4) result.score = 4;
    
    return result;
  } catch (error) {
    console.error('Error evaluating answer:', error);
    // Fallback response
    return {
      feedback: "I couldn't fully evaluate your answer, but keep practicing!",
      score: 2, // Default to "Hard" for safety
    };
  }
}

// Main evaluation function combining transcription and evaluation
export async function processVoiceAnswer(
  audioBase64: string,
  question: Question & { context?: { name: string } }
): Promise<{
  transcription: string;
  feedback: string;
  score: number;
}> {
  // Step 1: Transcribe the audio
  const transcription = await transcribeAudio(audioBase64);
  
  // Step 2: Evaluate the answer
  const { feedback, score } = await evaluateAnswer(
    transcription,
    question.answer,
    question.question
  );
  
  return {
    transcription,
    feedback,
    score,
  };
}