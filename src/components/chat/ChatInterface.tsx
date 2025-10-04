import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChatMessageComponent } from './ChatMessage';
import { ImageUpload } from '../medical/ImageUpload';
import { useAppStore } from '@/store/useAppStore';
import { ChatMessage, MedicalImage } from '@/types';
import { dummyChatMessages } from '@/data/dummyData';
import { cn } from '@/lib/utils';

export const ChatInterface: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [currentImages, setCurrentImages] = useState<MedicalImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { currentSession, updateSession } = useAppStore();
  const messages = currentSession?.messages || dummyChatMessages;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() && currentImages.length === 0) return;

    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'user',
      content: message,
      images: currentImages.length > 0 ? currentImages : undefined,
      timestamp: new Date(),
      status: 'sent'
    };

    // Add user message
    if (currentSession) {
      updateSession(currentSession.id, {
        messages: [...messages, newMessage],
        updatedAt: new Date()
      });
    }

    // Clear input
    setMessage('');
    setCurrentImages([]);
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'ai',
        content: generateAIResponse(message, currentImages),
        timestamp: new Date(),
        status: 'completed',
        metadata: {
          confidence: 0.85 + Math.random() * 0.1,
          analysisType: currentImages.length > 0 ? 'multimodal_analysis' : 'text_analysis',
          processingTime: 1.2 + Math.random() * 2
        }
      };

      if (currentSession) {
        updateSession(currentSession.id, {
          messages: [...messages, newMessage, aiResponse],
          updatedAt: new Date()
        });
      }
      
      setIsProcessing(false);
    }, 2000 + Math.random() * 3000);
  };

  const generateAIResponse = (userMessage: string, images: MedicalImage[]): string => {
    if (images.length > 0) {
      return `I've analyzed the ${images.length} medical image(s) you provided along with your query: "${userMessage}"\n\n## Analysis Results\n\n**Image Type**: ${images[0].type.toUpperCase()}\n**Body Part**: ${images[0].metadata.bodyPart}\n**Study Date**: ${images[0].metadata.studyDate}\n\n### Key Findings:\n- No acute abnormalities detected in the visible structures\n- Normal anatomical positioning and alignment\n- Good image quality and contrast\n\n### Recommendations:\n1. Clinical correlation recommended\n2. Follow-up if symptoms persist\n3. Consider additional views if clinically indicated\n\n*Note: This analysis is for educational purposes. Please consult with a qualified radiologist for official interpretation.*`;
    } else {
      return `Thank you for your question: "${userMessage}"\n\nI'm here to help with medical image analysis and healthcare-related inquiries. For the most accurate analysis, please upload medical images (X-rays, CT scans, MRIs, etc.) along with your questions.\n\n### How I can assist you:\n- **Medical Image Analysis**: Upload and analyze various types of medical imaging\n- **Diagnostic Support**: Provide insights on potential findings\n- **Report Generation**: Create structured medical reports\n- **Educational Information**: Explain medical conditions and procedures\n\nPlease feel free to upload medical images for a more comprehensive analysis.`;
    }
  };

  const handleImagesUploaded = (images: MedicalImage[]) => {
    setCurrentImages(prev => [...prev, ...images]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessageComponent key={msg.id} message={msg} />
        ))}
        
        {isProcessing && (
          <div className="flex justify-start">
            <div className="medical-card max-w-2xl p-4">
              <div className="flex items-center space-x-2">
                <div className="pulse-medical h-2 w-2 bg-primary rounded-full"></div>
                <div className="pulse-medical h-2 w-2 bg-primary rounded-full" style={{ animationDelay: '0.2s' }}></div>
                <div className="pulse-medical h-2 w-2 bg-primary rounded-full" style={{ animationDelay: '0.4s' }}></div>
                <span className="clinical-text text-sm ml-2">AI is analyzing your request...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Image Upload Area */}
      {isUploading && (
        <div className="border-t border-border p-4">
          <ImageUpload
            onImagesUploaded={handleImagesUploaded}
            maxFiles={3}
          />
        </div>
      )}

      {/* Current Images Preview */}
      {currentImages.length > 0 && (
        <div className="border-t border-border p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="medical-heading text-sm">Attached Images ({currentImages.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentImages.map((image, index) => (
              <div key={image.id} className="relative">
                <img
                  src={image.url}
                  alt={image.filename}
                  className="h-16 w-16 object-cover rounded-md border border-border"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-5 w-5"
                  onClick={() => setCurrentImages(prev => prev.filter((_, i) => i !== index))}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your medical question or request an analysis..."
              className="medical-input min-h-[50px] max-h-32 resize-none pr-12"
              disabled={isProcessing}
            />
            
            <div className="absolute right-2 bottom-2 flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsUploading(!isUploading)}
                disabled={isProcessing}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={isProcessing}
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button
            variant="medical"
            size="lg"
            onClick={handleSendMessage}
            disabled={(!message.trim() && currentImages.length === 0) || isProcessing}
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{message.length}/2000</span>
        </div>
      </div>
    </div>
  );
};