import React, { useState } from 'react';
import { ChevronDown, Clock, Filter } from 'lucide-react';
import  { Avatar ,AvatarFallback, AvatarImage } from './ui/avatar';
import { ConversationListProps } from './types';



const ConversationList: React.FC<ConversationListProps> = ({ 
  conversations, 
  activeId,
  onSelectConversation 
}) => {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <>
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold">Your inbox</h1>
        
        <div className="flex items-center justify-between mt-4">
          <button 
            className="flex items-center text-sm font-medium text-gray-600"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <span>5 Open</span>
            <ChevronDown size={16} className="ml-1" />
          </button>
          
          <button 
            className="flex items-center text-sm font-medium text-gray-600"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <span>Waiting longest</span>
            <ChevronDown size={16} className="ml-1" />
          </button>
        </div>
        
        {filterOpen && (
          <div className="mt-2 p-2 bg-gray-50 rounded-md">
            <div className="flex items-center mb-2">
              <Filter size={14} className="mr-2 text-gray-500" />
              <span className="text-sm font-medium">Filter conversations</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                Unassigned
              </button>
              <button className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                Assigned to me
              </button>
              <button className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                Priority
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {conversations.map(conversation => (
          <div 
            key={conversation.id}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
              activeId === conversation.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <div className="flex items-start">
              <div className="relative mr-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conversation.avatar} alt={conversation.name} />
                  <AvatarFallback className={conversation.avatarColor}>{conversation.name[0]}</AvatarFallback>
                </Avatar>
                {conversation.isOnline && (
                  <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-white"></span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium truncate">{conversation.name}</h3>
                    {conversation.source && (
                      <span className="ml-1 text-xs text-gray-500">· {conversation.source}</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                </div>
                
                <p className="mt-1 text-sm text-gray-600 truncate">{conversation.preview}</p>
                
                {conversation.priority && (
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                      {conversation.priority === 'high' ? '⚡ High Priority' : 'Priority'}
                    </span>
                  </div>
                )}
                
                {conversation.waitTime && (
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <Clock size={12} className="mr-1" />
                    <span>Waiting {conversation.waitTime}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ConversationList;