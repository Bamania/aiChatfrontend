"use client"
import React, { useState } from 'react';
import ConversationList from '../components/Conversational';
import ChatWindow from '../components/Chatwindow';
import DetailsSidebar from '../components/Sidebar';
import { conversations, activeConversation } from '../mockdata/data';

const ChatInterface: React.FC = () => {
  const [activeChat, setActiveChat] = useState(activeConversation);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [composerContent, setComposerContent] = useState('');

  // Function to handle adding content to composer
  const handleAddToComposer = (content: string) => {
    setComposerContent(content);
  };

  const handleSelectConversation = (id: string) => {
    const selected = conversations.find(c => c.id === id);
    if (selected) {
      setActiveChat(selected);
      setIsMobileMenuOpen(false);
    }
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex flex-col w-full max-w-7xl h-[85vh]">
      <div className="flex flex-1 bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Mobile menu button */}
        <div className="md:hidden absolute top-4 left-4 z-50">
          <button 
            onClick={handleToggleMobileMenu}
            className="p-2 bg-white rounded-full shadow-md"
            type="button"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Conversation List - Hidden on mobile unless menu is open */}
        <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-1/4 border-r border-gray-200`}>
          <ConversationList 
            conversations={conversations} 
            activeId={activeChat.id} 
            onSelectConversation={handleSelectConversation}
          />
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          <ChatWindow 
            conversation={activeChat} 
            initialContent={composerContent}
            onToggleSidebar={handleToggleSidebar}
          />
        </div>

        {/* Details Sidebar - Hidden on mobile and can be toggled */}
        <div className={`${isSidebarOpen ? 'flex' : 'hidden'} lg:flex flex-col w-full md:w-1/4 border-l border-gray-200`}>
          <DetailsSidebar 
            // conversation={activeChat} 
            onAddToComposer={handleAddToComposer} 
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;