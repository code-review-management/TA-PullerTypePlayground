import { GoogleGenerativeAI } from "@google/generative-ai";
import { CodeEditResponse, CodeEditResponseSchema } from "@/types/request.types";

let genAI: GoogleGenerativeAI;


const cachedResult = `\`\`\`json
{
    "deleteRange": {
        "minInclusiveLine": 860,
        "maxExclusiveLine": 903
    },
    "additionBlock": {
        "insertionCode": "public struct EnemySyncTaskState\\n{\\n    public float workApplied;\\n    public ushort workNeeded;\\n    public byte effortThreshold;\\n    public byte effortCount;\\n    public float timeOfSync;\\n    public sbyte changeDirection;\\n    public BidTaskType bidTaskType;\\n\\n    public EnemySyncTaskState(int workNeeded, int effortThreshold, double timeOfSync, int changeDirection, BidTaskType bidType)\\n    {\\n        this.workNeeded = (ushort)workNeeded;\\n        this.effortThreshold = (byte)effortThreshold;\\n        this.changeDirection = (sbyte)changeDirection;\\n\\n        workApplied = 0;\\n        effortCount = 0;\\n        this.timeOfSync = (float)timeOfSync;\\n        bidTaskType = bidType;\\n    }\\n\\n    public EnemySyncTaskState(float workApplied, int workNeeded, int effortThreshold, int effortCount, double timeOfSync,\\n        int changeDirection, BidTaskType bidTaskType)\\n    {\\n        this.workApplied = workApplied;\\n        this.workNeeded = (ushort)workNeeded;\\n        this.effortThreshold = (byte)effortThreshold;\\n        this.effortCount = (byte)effortCount;\\n        this.timeOfSync = (float)timeOfSync;\\n        this.changeDirection = (sbyte)changeDirection;\\n        this.bidTaskType = bidTaskType;\\n    }\\n}\\n\\n#endregion\\npublic enum BidTaskType : byte\\n{\\n    FireWeapon,\\n    RepairRoomDamage,\\n    PutOutFire,\\n    RepairDestroyedRoom\\n}"
    }
}
\`\`\``;

export async function callGeminiToGenerateSuggestion(systemPrompt: string, userPrompt: string) : Promise<CodeEditResponse> {
    
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
        // console.log("System prompt: \n" + systemPrompt);
        // console.log("User prompt: " + userPrompt);
        // const result = await model.generateContent(userPrompt);
        // const responseText = result.response.text();
        // console.log("----Gemini response----");
        // console.log(responseText);
        return parseGeminiJsonResponse(cachedResult);
    } catch (error){
        console.log("Error when calling gemini: " + error);
        throw error;
    }
}

export function parseGeminiJsonResponse(rawResponse: string): CodeEditResponse {
  const start = rawResponse.indexOf('{');
  const end = rawResponse.lastIndexOf('}');

  if (start === -1 || end === -1) {
    throw new Error("Could not find a valid JSON structure in the response.");
  }
  
  const cleanText = rawResponse.slice(start, end + 1);
  let rawJson: unknown;
  try {
    rawJson = JSON.parse(cleanText);
  } catch (error) {
    throw new Error("Failed to parse JSON string. The LLM output might be malformed.");
  }

  const result = CodeEditResponseSchema.safeParse(rawJson);

  if (!result.success) {
    console.error("Zod Validation Error:", result.error.format());
    throw new Error("LLM output did not match the expected schema.");
  }

  return result.data;
}