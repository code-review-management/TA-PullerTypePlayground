import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  CodeEditResponse,
  CodeEditResponseSchema,
} from "@/types/request.types";
import { zodToJsonSchema } from "zod-to-json-schema";

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

  const rawJsonSchema = zodToJsonSchema(CodeEditResponseSchema as any);
  delete rawJsonSchema.$schema;

  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    systemInstruction: systemPrompt,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: rawJsonSchema as any,
    },
  });

  try {
    console.log("Calling model!");
    const result = await model.generateContent(userPrompt);
    return CodeEditResponseSchema.parse(JSON.parse(result.response.text()));
  } catch (error) {
    console.log("Error when calling gemini: " + error);
    throw error;
  }
}
