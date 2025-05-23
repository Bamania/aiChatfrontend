"use client"
import React, { useEffect, useState, useRef } from 'react';
import { MoreHorizontal, Phone, MoonStar, X, Send, Paperclip, Smile, Zap, Trash2, Square, ChevronDown, Heading1, Brush, Check, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


import { Conversation, Message } from '../feature/types';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { connectWebSocket, sendMessage } from '@/lib/useSocket';
import { ChatWindowProps } from './types';



const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, onToggleSidebar,initialContent='' }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(conversation.messages || []);
  const [content, setContent] = useState(initialContent)
  const [isAIGenerated] = useState(!!initialContent) //to track the content 
  const [AiIcon, setAiIcon] = useState(false)
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [showToneDropdown, setShowToneDropdown] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
      // Ensure the composer is open when content is added (imp edge cases)
    }
  }, [initialContent]);
  useEffect(() => {
    // the callback function here will define the way u want to handle the data !
    
    const socket = connectWebSocket(handleIncomingResponse);
    
    return () => {
      socket.close(); 
    };
  }, []);
  
  
  
  
  
  
  const handleIncomingResponse=(msg:any)=>{
   console.log("Incoming response" ,msg)
  }  
  const handleContent=()=>{
    
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {

  setContent(e.target.value);

  if(e.target.value.trim() === '') {
    setAiIcon(false);
  } else {
    setAiIcon(true);
  }}



  const handleSendMessage = () => {
    if (!content.trim()) return;
    
    // Send message to websocket
    sendMessage(content);
    
    // Create new message object
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      content: content,
      sender: 'agent', // Assuming 'agent' means messages sent by the current user
      timestamp: new Date(),
      status: 'sent'
    };
    
    // Add message to the messages array
    setMessages([...messages, newMsg]);
    
    // Clear the input field
    setContent('');
  };

  const formatTimestamp = (timestamp: Date) => {
    // Simple formatting for demo purposes
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <h2 className="text-lg font-bold ">{conversation.name}</h2>
          
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-1 text-gray-600 bg-gray-100 rounded-lg   transition-colors" title="Details" onClick={onToggleSidebar}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 7h18M3 12h18M3 17h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button className="p-1 bg-gray-100 rounded-lg  transition-colors" title="Snooze">
            <MoonStar size={20} />
          </button>
          <button className="px-4 flex justify-center items-center py-1 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors">
            <X size={16} className="mr-1 inline-block" />
            Close
          </button>
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
              <div className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
                {message.sender === 'user' && (
                  <div className="flex-shrink-0 mr-2">
                 <Avatar>
  <AvatarImage src={conversation.avatar} alt={conversation.name} />
  <AvatarFallback className={conversation.avatarColor}>{conversation.name[0]}</AvatarFallback>
</Avatar>
                  </div>
                )}
                
                <div className={`rounded-lg p-3.5 ${
                  message.sender === 'user' 
                    ? 'bg-gray-100 text-gray-800' 
                    : 'bg-blue-100 text-blue-900'
                }`}>
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  <div className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-gray-500' : 'text-blue-700'
                  }`}>
                    {formatTimestamp(message.timestamp)}
                    {message.status === 'seen' && ' · Seen'}
                  </div>
                </div>
                
                {message.sender === 'agent' && message.status && (
                    <div className="flex-shrink-0 ml-2 p-1">
                    <Avatar>
                      <AvatarImage src="/agent-avatar.png" alt="Agent" />
                      <AvatarFallback className="rounded-full p-1">A</AvatarFallback>
                    </Avatar>
                    </div>
                )}
              </div>
            </div>
          ))}
          
          {conversation.waitingNotice && (
            <div className="flex justify-center my-4">
              <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm">
                {conversation.waitingNotice}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Message input */}
      <div className="w-full mx-auto">
      <div className="bg-white rounded- shadow-sm border border-gray-200">
        {/* Header */}
        <div className="px-4 py-2 flex items-center border-b gap-3 border-gray-100 rounded-t-md shadow-sm">
          <div className="flex items-center text-base font-semibold text-gray-800">
            <span className="mr-1">Chat</span>
              className="p-1 rounded-full hover:bg-blue-100 transition-colors"
              title="Attach file"
            >Icon && (
              <Paperclip size={16} className="text-gray-500" />ms-center bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-2 text-xs font-medium animate-pulse">
            </button>size={14} className="mr-1" />
            <buttonaft
              className="p-1 rounded-full hover:bg-blue-100 transition-colors"
              title="More"
            >v className="ml-auto flex items-center space-x-2">
              <MoreHorizontal size={16} className="text-gray-500" />
            </button>me="p-1 rounded-full hover:bg-blue-100 transition-colors"
          </div>tle="Attach file"
        </div>
              <Paperclip size={16} className="text-gray-500" />
        {/* Input area */}
        <div className="p-3">
          <textareaName="p-1 rounded-full hover:bg-blue-100 transition-colors"
            className="w-full bg-transparent resize-none focus:outline-none text-sm min-h-[60px]"
            placeholder="Use ⌘K for shortcuts"
            rows={1}orizontal size={16} className="text-gray-500" />
            value={content}
                onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }area
            }}f={textareaRef}
          />className="w-full bg-transparent resize-none focus:outline-none text-sm min-h-[60px]"
        </div>aceholder="Use ⌘K for shortcuts"
            rows={1}
        {/* Footer */}tent}
        <div className="px-3 py-2 flex justify-between items-center border-t border-gray-100">
          <div className="flex space-x-3">
            <button className="text-gray-500 hover:text-gray-700">
              <Zap size={18} />t()
            </button>eSendMessage()
            <button className="text-gray-500 hover:text-gray-700">
              <Square size={18} />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <Smile size={18} />
            </button>}
          </div>ssName="px-3 py-2 flex justify-between items-center border-t border-gray-100">
          <div className="flex items-center">
            <button className="text-gray-500 hover:text-gray-700">
              className="bg-white text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-md text-sm font-medium flex items-center"
              onClick={handleSendMessage}
            <button className="text-gray-500 hover:text-gray-700">
            > <Square size={18} />
              Sendon>
              <ChevronDown size={14} className="ml-1" />gray-700">
            </button>size={18} />
          </div>tton>
        </div>v>
      </div>iv className="flex items-center">
    </div>  <button
    {AiIcon && (    className="bg-white text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-md text-sm font-medium flex items-center"
  <DropdownMenu>          onClick={handleSendMessage}
    <DropdownMenuTrigger asChild>          
      <button className="flex items-center bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-2 text-xs font-medium hover:bg-blue-200 transition-colors">            >
        <Brush size={14} className="mr-1" />





































export default ChatWindow;};  );    </div>)}  </DropdownMenu>    </DropdownMenuContent>      </DropdownMenuItem>        <span className="mr-2">🌐</span> Translate...      <DropdownMenuItem onClick={() => handleToneSelection('translate')} className="cursor-pointer">      </DropdownMenuItem>        <span className="mr-2">✏️</span> Fix grammar & spelling      <DropdownMenuItem onClick={() => handleToneSelection('fix')} className="cursor-pointer">      </DropdownMenuItem>        <span className="mr-2">🎩</span> More formal      <DropdownMenuItem onClick={() => handleToneSelection('formal')} className="cursor-pointer">      </DropdownMenuItem>        <span className="mr-2">😊</span> More friendly      <DropdownMenuItem onClick={() => handleToneSelection('friendly')} className="cursor-pointer">      </DropdownMenuItem>        <span className="mr-2">💼</span> Professional      <DropdownMenuItem onClick={() => handleToneSelection('professional')} className="cursor-pointer">    <DropdownMenuContent align="start" className="w-48">    </DropdownMenuTrigger>      </button>        )}          </>            <ChevronDown size={12} className="ml-1" />            AI Draft          <>        ) : (          </>            Drafting...            <Loader2 size={12} className="mr-1 animate-spin" />          <>        {isLoadingAI ? (              <ChevronDown size={14} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ChatWindow;