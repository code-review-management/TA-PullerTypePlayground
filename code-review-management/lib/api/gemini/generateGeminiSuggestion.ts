import { GoogleGenerativeAI, SchemaType, Schema } from "@google/generative-ai";
import {
  CodeEditResponse,
  CodeEditResponseSchema,
} from "@/types/request.types";

//Our gemAI model. It gets initialized using the API key. We cache it so we don't need to initialize it every call
let genAI: GoogleGenerativeAI;

// Gemini Schema. This is the output gemini is required to send (in theory, I am not sure how strict it adheres to this lol)
const geminiCodeEditSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    deleteRange: {
      type: SchemaType.OBJECT,
      properties: {
        minInclusiveLine: { type: SchemaType.INTEGER }, 
        maxExclusiveLine: { type: SchemaType.INTEGER },
      },
      required: ["minInclusiveLine", "maxExclusiveLine"],
    },
    additionBlock: {
      type: SchemaType.OBJECT,
      properties: {
        insertionCode: { type: SchemaType.STRING },
      },
      required: ["insertionCode"],
    },
  },
  required: ["deleteRange", "additionBlock"],
};

/**
 * Function calls the model with the aproprotate system and user prompt
 * @param systemPrompt 
 * @param userPrompt 
 * @returns returns the suggestion with the specified schema. Noteably, it requires a range for deletion and the full code for insertion
 */
export async function callGeminiToGenerateSuggestion(
  systemPrompt: string,
  userPrompt: string,
): Promise<CodeEditResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in the environment.");
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    systemInstruction: systemPrompt,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: geminiCodeEditSchema,
    },
  });

  try {
    const result = await model.generateContent(userPrompt);
    const parsedData = JSON.parse(result.response.text());
    const dataToValidate = Array.isArray(parsedData) ? parsedData[0] : parsedData;
    return CodeEditResponseSchema.parse(dataToValidate);
  } catch (error) {
    console.log("Error when calling gemini: " + error);
    throw error;
  }
}
