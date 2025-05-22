"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Trash2, Smile, Zap, MoreHorizontal, X, MessageSquareText } from "lucide-react"

interface ComposerProps {
  initialContent?: string;
  onClose?: () => void;
}

export default function Composer({ initialContent = '', onClose }: ComposerProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [content, setContent] = useState(initialContent)
  const [isAIGenerated] = useState(!!initialContent) // Track if content was added from AI
  
  // Update content when initialContent changes
  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
      setIsOpen(true); // Ensure the composer is open when content is added
    }
  }, [initialContent]);
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg p-4 border  animate-fadeIn transition-all duration-300 transform">{/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center justify-center gap-2 ">
          <MessageSquareText className="w-4 mt-1 h-4" />
            
           <span className="text-md font-bold">Chat</span>
            <button onClick={() => setIsOpen(!isOpen)} className="ml-2 text-gray-600">
              <ChevronDown size={16} />
            </button>
          </div>
          {/* Add close button */}
          {onClose && (
            <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
              <X size={18} />
            </button>
          )}
        </div>

        {isOpen && (
          <>
            {/* Question */}
            <div className="mb-4">
              <h3 className="font-medium text-gray-800 mb-2">Question</h3>
              <textarea 
                className="w-full p-2 border  rounded-md bg-white min-h-[80px] text-gray-700"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            {/* Summary */}
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Summary</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Customer bought a product in November as a Christmas gift, but it was not needed.</li>
                <li>Customer wants a refund for the unopened product.</li>
                <li>Teammate asks for product name, purchase location, and email.</li>
                <li>
                  Teammate informs customer that refunds are only available for orders within 60 days and must meet
                  return condition requirements.
                </li>
                <li>Customer's order was placed over 60 days ago, but they request an exception.</li>
              </ul>
            </div>            {/* Footer */}
            <div className="flex justify-between mt-6 pt-2 border-t ">
              <div className="flex space-x-4">
                <button className="text-gray-600">
                  <Zap size={18} />
                </button>
                
                <button className="text-gray-600">
                  <Trash2 size={18} />
                </button>
                <button className="text-gray-600">
                  <Smile size={18} />
                </button>
               
               
              </div>
              <button 
                className={`${isAIGenerated ? 'bg-black' : ''} text-white px-4 py-1 rounded-md text-sm font-medium hover:opacity-90 transition-opacity`}
                onClick={() => onClose && onClose()}
              >
                {isAIGenerated ? 'Send ' : 'Add note'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
