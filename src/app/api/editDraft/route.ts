import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Im using  NAIVE NEXT REQUEST AS THE reqeuest param,since the api aint that complex 
export async function POST(request: NextRequest) {  try {
    // Parse the request body
    const body = await request.json();
    const {draftContent,tone}=body;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `
  Please rewrite the following content in a ${tone} tone:

  "${draftContent}"

  Respond ONLY with a valid JSON object in this exact format:
  {"content": "REPHRASED_CONTENT_HERE"}

  Do not include any explanations, markdown, or extra text. Only return the JSON object as specified.
      `,
    });
      const SplitResponse = response.text?.split("`")
      if (!SplitResponse) {
        return NextResponse.json({ content: [] }, { status: 400 });
      }
      const newDraft = SplitResponse[3]?.split("json")
      if (!newDraft || !newDraft[1]) {
        return NextResponse.json({ content: [] }, { status: 400 });
      }
      const getParsedcontent = JSON.parse(newDraft[1]);

      // e.g. Insert new user into your DB

     
      return  NextResponse.json({
        message:getParsedcontent
      });
    
  } catch (error) {
    console.error('Error editing draft:', error);
    return NextResponse.json(
      { message: 'Internal server error' }, 
      { status: 500 }
    );
  }
}