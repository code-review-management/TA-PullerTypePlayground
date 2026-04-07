import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI;

export async function callGeminiToGenerateSuggestion(systemPrompt: string, userPrompt: string) : Promise<string> {
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set in the environment.");
    }

    if (!genAI) {
        genAI = new GoogleGenerativeAI(apiKey);
    }

    const model = genAI.getGenerativeModel({
        model: "gemini-3-flash-preview",
        systemInstruction: systemPrompt
    })

    try {
        console.log("Calling model!");
        const result = await model.generateContent(userPrompt);
        const responseText = result.response.text();
        console.log("----Gemini response----");
        console.log(responseText);
        return responseText;
    } catch (error){
        console.log("Error when calling gemini: " + error);
        throw error;
    }
}