import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Users, TvMinimal, Bot } from 'lucide-react';
// Fix the Avatar import
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { connectWebSocket } from '@/lib/useSocket';
import { AIResponse, DetailsSidebarProps } from './types';
import character from "../../public/ben-sweet-2LowviVHZ-E-unsplash.jpg"
 
const DetailsSidebar: React.FC<DetailsSidebarProps> = ({ onAddToComposer }) => {

  const [activeTab, setActiveTab] = useState<'copilot' | 'details'>('copilot');
  const [aiData, setAiData] = useState<AIResponse | null>(null);
  const [userInput, setUserInput] = useState<string>('');  const [chatMessages, setChatMessages] = useState<{text: string, isUser: boolean, isStreaming?: boolean}[]>([]);
  const socketRef = useRef<null | WebSocket>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [aiStatus, setAiStatus] = useState<null | string>(null);
  const [streamingText, setStreamingText] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  console.log(isStreaming)
   
  useEffect(() => { 
    // Enhanced scrolling behavior that ensures messages are visible
    if (chatContainerRef.current) {
      // Use a small timeout to ensure DOM updates are complete
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [chatMessages, aiStatus, streamingText]); // Also scroll when AI status changes or streaming text updates

  const updateAicontext = (msg: string) => {
    console.log("message from server", msg);
    try {
      const parsedData: AIResponse = JSON.parse(msg);
      console.log("parsed data after receiving it from the server", parsedData);
      setAiData(parsedData);
      // Don't log aiData here, it won't have updated yet due to React's state update mechanism
    } catch (error) {
      console.error("Failed to parse AI response:", error);
    }
  };
  const sendMessage = async () => {
    if (!userInput.trim() || !socketRef.current) return;
    
    // Add user message to chat
    setChatMessages(prev => [...prev, {
      text: userInput,
      isUser: true
    }]);
    
    try {
      socketRef.current.send(JSON.stringify({ message: userInput }));
      setAiStatus("Thinking...");

      // Simulate AI stages with real transitions
      setTimeout(() => setAiStatus("Looking for an answer..."), 1000);
      setTimeout(() => setAiStatus("Generating response..."), 2500);

      // Start streaming response
      await streamAIResponse(userInput);
      
    } catch (error) {
      console.error("Error sending message:", error);
      setAiStatus(null);
      setIsStreaming(false);
    }
    
    // Clear the input field
    setUserInput('');
  };

  const streamAIResponse = async (message: string) => {
    try {
      const response = await fetch("/api/generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatSuggestion: message,
          stream: true
        }),
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      // Clear AI status and start streaming
      setAiStatus(null);
      setIsStreaming(true);
      setStreamingText('');

      // Add empty AI message that will be updated with streaming text
      setChatMessages(prev => [...prev, {
        text: '',
        isUser: false,
        isStreaming: true
      }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          // Streaming complete
          setIsStreaming(false);
          setChatMessages(prev => 
            prev.map((msg, index) => 
              index === prev.length - 1 && msg.isStreaming 
                ? { ...msg, text: accumulatedText, isStreaming: false }
                : msg
            )
          );
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                accumulatedText += data.content;
                setStreamingText(accumulatedText);
                
                // Update the last message with streaming text
                setChatMessages(prev => 
                  prev.map((msg, index) => 
                    index === prev.length - 1 && msg.isStreaming 
                      ? { ...msg, text: accumulatedText }
                      : msg
                  )
                );
              }
            } catch (e) {
              console.log(e)
            }
          }
        }
      }
    } catch (error) {
      console.error("Error streaming AI response:", error);
      setAiStatus(null);
      setIsStreaming(false);
      
      // Add error message
      setChatMessages(prev => [...prev, {
        text: "Sorry, I encountered an error generating a response.",
        isUser: false
      }]);
    }
  };

  useEffect(() => {
    // Connect only once when component mounts
    socketRef.current = connectWebSocket(updateAicontext);
    
    return () => {
      if (socketRef.current) {
        socketRef.current.close(); // clean up on component unmount
      }
    };
  }, []);



  return (
    <div className="flex flex-col h-full border-l  border-gray-200">
      {/* Header Tabs - match image style */}
      <div className="flex border-b border-gray-200 h-12 items-end px-2">
        <button 
          className={`flex gap-2 justify-center items-center h-full pb-0.5 text-center text-[15px] font-medium tracking-tight transition-colors duration-150 border-b-2 ${
            activeTab === 'copilot' 
              ? 'text-blue-600 border-blue-600' 
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
          style={{letterSpacing: 0.1}}
          onClick={() => setActiveTab('copilot')}
        >
          
          <TvMinimal className='w-4 h-4 '/>
          AI Copilot
        </button>
        <button 
          className={`flex-1 h-full pb-0.5 text-center text-[15px] font-medium tracking-tight transition-colors duration-150 border-b-2 ${
            activeTab === 'details' 
              ? 'text-blue-600 border-blue-600' 
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
          style={{letterSpacing: 0.1}}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
      
      </div>

      {activeTab === 'copilot' && (
        <div className="flex-1 flex flex-col bg-[#FAFAFB] overflow-hidden">
          {chatMessages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              {/* Centered icon and text */}
              <div className="flex flex-col items-center justify-center">
                <div className="mb-4 flex justify-center">
                  {/* Dummy Fin AI Copilot icon (rounded square with smile) */}
                  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" rx="4" fill="#1F2937"/>
                    <rect x="9" y="9" width="6" height="6" rx="2" fill="white"/>
                    <rect x="10.5" y="11" width="3" height="1.2" rx="0.6" fill="#1F2937"/>
                    <rect x="11.25" y="12.5" width="1.5" height="0.5" rx="0.25" fill="#1F2937"/>
                  </svg>
                </div>
<h3 className="text-lg font-medium mb-2">Hi, I&apos;m Becha Ai</h3>
                <p className="text-gray-500 text-sm mb-4">Ask me anything about this conversation.</p>
              </div>              {/* Show only one suggestion from WebSocket if available */}
              {aiData && aiData.suggestions && aiData.suggestions.length > 0 && (
                <div className="w-full flex flex-col items-center mt-2">
                  <div
                    className="bg-white rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 shadow mb-2 w-11/12 max-w-md text-left transition-all duration-150"
                    onClick={() => aiData.suggestions && setUserInput(aiData.suggestions[0])}
                  >
                    <span className="font-medium text-xs text-gray-500 mr-1">Suggested</span> {aiData.suggestions[0]}
                  </div>
                  
                  {/* Add to Composer button for suggestions */}
                  {onAddToComposer && (
                    <div className="mb-2 flex justify-start w-11/12 max-w-md">
                      <button
                        onClick={() => {
                          if (aiData && aiData.suggestions && aiData.suggestions.length > 0) {
                            onAddToComposer(aiData.suggestions[0]);
                          }
                        }}
                        className="text-blue-600 text-xs flex items-center hover:text-blue-800 transition-colors"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                          <path d="M12 4V20M20 12L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Add to Composer
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div 
              className="flex-1 overflow-y-auto px-4 py-3 scroll-smooth" 
              ref={chatContainerRef}
              style={{ scrollBehavior: 'smooth' }}
            >
              {/* Chat messages */}
              <div className="space-y-4">
                {chatMessages.map((message, index) => (
                  <div key={index} className="w-full">
                    {message.isUser ? (
                      // User message section
                      <div className="mb-6">
                        {/* YOU header */}
                        <div className="flex  flex-col  items-start gap-1 ">
                          <div className="flex  items-center gap-2 ">
                          <Image src={character} alt="profile img"
                          className='object-cover w-6 h-6  rounded-full ' />
                          <span className="text-sm font-medium text-gray-700">YOU</span>
                          </div>
                       
                        {/* User message */}
                        <div className=" text-black rounded-lg rounded-bl-none max-w-[85%] ml-8">
                          {message.text}
                        </div>
                         </div>
                        
                      </div>
                    ) : (
                      // AI message section  
                      <div className="mb-6">
                        {/* BECHA header */}                        <div className="flex items-center mb-3">
                          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-2">
                           <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" rx="4" fill="white"/>
                    <rect x="9" y="9" width="6" height="6" rx="2" fill="#8B5CF6"/>
                    <rect x="10.5" y="11" width="3" height="1.2" rx="0.6" fill="white"/>
                    <rect x="11.25" y="12.5" width="1.5" height="0.5" rx="0.25" fill="white"/>
                  </svg>
                          </div>
                          <span className="text-sm font-medium text-gray-700">BECHA</span>
                        </div>
                          {/* AI message */}
                        <div className="ml-8">
                          <div className="bg-gradient-to-r from-purple-100 to-purple-200 text-gray-800 border border-gray-200 py-2 px-3 rounded-lg rounded-bl-none max-w-[85%]">
                            {message.text}
                            {message.isStreaming && (
                              <span className="inline-block w-2 h-4 bg-gray-600 ml-1 animate-pulse"></span>
                            )}
                          </div>
                          
                          {/* Add to Composer button for AI messages */}
                          {onAddToComposer && (
                            <button
                              onClick={() => onAddToComposer(message.text)}
                              className="text-blue-600 text-xs mt-2 flex items-center bg-white rounded-lg px-2 py-1 border border-gray-200 hover:bg-gray-50 transition-all duration-200"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                                <path d="M12 4V20M20 12L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Add to Composer
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* AI Status thinking indicator */}
                {aiStatus && (
                  <div className="mb-6">
                    {/* BECHA header for thinking state */}
                    <div className="flex items-center mb-3">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-2">
                        <Bot size={14} className="text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">BECHA</span>
                    </div>
                    
                    <div className="ml-8">
                      <div className="bg-gradient-to-r from-purple-100 to-purple-200 text-gray-700 py-2 px-3 rounded-lg rounded-bl-none max-w-[85%] flex items-center animate-pulse border border-gray-200">
                        {aiStatus === "Thinking..." && <span className="mr-2">🧠</span>}
                        {aiStatus === "Looking for an answer..." && <span className="mr-2">🔍</span>}
                        {aiStatus === "Generating response..." && <span className="mr-2">⚙️</span>}
                        {aiStatus}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom input area, fixed to bottom */}
          <div className="w-full px-3 pb-4 pt-2 bg-transparent">            {/* Always show suggestions if available, regardless of chat messages */}
            {aiData && aiData.suggestions && aiData.suggestions.length > 0 && (
              <div className="mb-2">
                <div 
                  className="bg-white rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 shadow mb-1"
                  onClick={() => aiData.suggestions && setUserInput(aiData.suggestions[0])}
                >
                  <span className="font-medium text-xs text-gray-500 mr-1">Suggested</span> {aiData.suggestions[0]}
                </div>
                
                
                
              </div>
            )}            {/* Fallback suggestion when no API suggestions are available */}
            {!(aiData && aiData.suggestions && aiData.suggestions.length > 0) && (
              <div className="mb-2">
                <div 
                  className="bg-white rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 shadow mb-1"
                  onClick={() => setUserInput('How do I get a refund?')}
                >
                  <span className="font-medium text-xs text-gray-500 mr-1">Suggested</span> <span role="img" aria-label="wave">👋</span> How do I get a refund?
                </div>
                
                {/* Add to Composer button for fallback suggestion */}
               
              </div>
            )}
            <div className="relative">
              <input 
                type="text" 
                className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white placeholder-gray-400 shadow"
                placeholder="Ask a question..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button 
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                onClick={sendMessage}
                tabIndex={-1}
                aria-label="Send"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'details' && (
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center mb-4">
              <span className="text-sm font-medium text-gray-500 w-24">Assignee</span>
                <div className="flex items-center">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="" alt="Brian Byrne" />
                  <AvatarFallback className="bg-purple-600 text-white text-xs flex items-center justify-center">
                  B
                  </AvatarFallback>
                </Avatar>
                <span className="ml-2 text-sm">Brian Byrne</span>
                </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-500 w-24">Team</span>
              <div className="flex items-center">
                <Users size={16} className="text-gray-400" />
                <span className="ml-2 text-sm">Unassigned</span>
              </div>
            </div>
          </div>
          
       
          
       
        </div>
      )}
    </div>
  );
};

export default DetailsSidebar;