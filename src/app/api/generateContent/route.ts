import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();
  console.log("from the frontend", body);
  const { chatSuggestion, stream = false } = body;

  if (stream) {
    // Handle streaming response
    const encoder = new TextEncoder();
    
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          const response = await ai.models.generateContent({ 
            model: "gemini-2.0-flash",
            contents: `      
            You are an AI agent for customer support that generates content of 50-60 words about this topic: ${chatSuggestion} 
            Provide a helpful and concise response.
            `,
          });

          const responseText = response.text || "";
          // Simulate streaming by splitting text into chunks
          const words = responseText.split(' '); //words is an array of the response from the gemini 
          
            //now we need to select each words and send it to the backend 

          for (let i = 0; i < words.length; i++) {
            const chunk = i === 0 ? words[i] : ' ' + words[i];
           
            
            const streamData = `data: ${JSON.stringify({ content: chunk })}\n\n`;
            controller.enqueue(encoder.encode(streamData));
            
            // Add a small delay to simulate real streaming
            await new Promise(resolve => setTimeout(resolve, 50));
          }
          
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          const errorData = `data: ${JSON.stringify({ error: "Failed to generate content" })}\n\n`;
          controller.enqueue(encoder.encode(errorData));
          controller.close();
        }
      }
    });
     console.log("readable stream !",readableStream)
    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } 
}