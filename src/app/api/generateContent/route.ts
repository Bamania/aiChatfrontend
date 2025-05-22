import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();
  console.log("from the frotned",body)
  const { chatSuggestion } = body;
  const response = await ai.models.generateContent({ 
        model: "gemini-2.0-flash",
        contents: `      
        You are an ai agent that is here for the customer support , that generate content of 50-60 words over this topic ${chatSuggestion} 
        make sure the output is in the following format only ! which is {content:"generatred_content on the topic"}
      `,
      });
      console.log("response text !",response.text)
 const SplitResponse = response.text?.split("`")
  if (!SplitResponse) {
    return { suggestions: [] };
  }
  const getSuggestions = SplitResponse[3]?.split("json")
  if (!getSuggestions || !getSuggestions[1]) {
    return { suggestions: [] };
  }
  const getParsedSuggestions = JSON.parse(getSuggestions[1]);

  // e.g. Insert new user into your DB

 
  return  NextResponse.json({
    message:getParsedSuggestions
  });
}