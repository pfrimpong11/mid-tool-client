import React from 'react';
import { User, Bot, Download, Eye, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ChatMessageProps {
  message: ChatMessage;
}

export const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.type === 'user';
  const isAI = message.type === 'ai';

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'secondary';
    if (confidence >= 0.9) return 'default';
    if (confidence >= 0.7) return 'outline';
    return 'destructive';
  };

  const getConfidenceText = (confidence?: number) => {
    if (!confidence) return 'Unknown';
    return `${(confidence * 100).toFixed(1)}%`;
  };

  return (
    <div className={cn(
      "flex w-full",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex max-w-4xl space-x-3",
        isUser ? "flex-row-reverse space-x-reverse" : "flex-row"
      )}>
        {/* Avatar */}
        <div className={cn(
          "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-medical-blue text-white"
        )}>
          {isUser ? (
            <User className="h-4 w-4" />
          ) : (
            <Bot className="h-4 w-4" />
          )}
        </div>

        {/* Message Content */}
        <div className={cn(
          "flex-1 space-y-2",
          isUser ? "items-end" : "items-start"
        )}>
          {/* Message Header */}
          <div className={cn(
            "flex items-center space-x-2 text-xs text-muted-foreground",
            isUser ? "justify-end" : "justify-start"
          )}>
            <span className="font-medium">
              {isUser ? 'You' : 'Medical AI Assistant'}
            </span>
            <span>•</span>
            <span>{format(message.timestamp, 'HH:mm')}</span>
            
            {isAI && message.metadata?.confidence && (
              <>
                <span>•</span>
                <Badge 
                  variant={getConfidenceColor(message.metadata.confidence)}
                  className="text-xs px-2 py-0"
                >
                  {getConfidenceText(message.metadata.confidence)} confidence
                </Badge>
              </>
            )}
          </div>

          {/* Message Body */}
          <div className={cn(
            "medical-card p-4 rounded-lg",
            isUser 
              ? "bg-primary text-primary-foreground ml-12" 
              : "bg-card mr-12"
          )}>
            {/* Text Content */}
            {message.content && (
              <div className={cn(
                "prose prose-sm max-w-none",
                isUser ? "prose-invert" : ""
              )}>
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="medical-heading text-lg mb-2">{children}</h1>,
                    h2: ({ children }) => <h2 className="medical-heading text-base mb-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="medical-heading text-sm mb-1">{children}</h3>,
                    p: ({ children }) => <p className="clinical-text mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="clinical-text space-y-1 ml-4">{children}</ul>,
                    ol: ({ children }) => <ol className="clinical-text space-y-1 ml-4">{children}</ol>,
                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}

            {/* Images */}
            {message.images && message.images.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {message.images.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt={image.filename}
                        className="w-full h-48 object-cover rounded-md border border-border"
                      />
                      
                      {/* Image Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center space-x-2">
                        <Button variant="secondary" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="secondary" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>

                      {/* Image Info */}
                      <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white p-2 rounded text-xs">
                        <div className="font-medium">{image.filename}</div>
                        <div className="text-white/80">
                          {image.type.toUpperCase()} • {image.metadata.bodyPart}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Metadata */}
            {isAI && message.metadata && (
              <div className="mt-3 pt-3 border-t border-border space-y-2">
                {message.metadata.analysisType && (
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-medium">Analysis Type:</span>
                    <Badge variant="outline" className="text-xs">
                      {message.metadata.analysisType.replace('_', ' ')}
                    </Badge>
                  </div>
                )}
                
                {message.metadata.processingTime && (
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>Processing time: {message.metadata.processingTime.toFixed(1)}s</span>
                  </div>
                )}

                {message.metadata.findings && message.metadata.findings.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-medium">Key Findings:</span>
                    <div className="space-y-1">
                      {message.metadata.findings.map((finding) => (
                        <div key={finding.id} className="flex items-center space-x-2 text-xs">
                          {finding.severity === 'critical' && (
                            <AlertTriangle className="h-3 w-3 text-destructive" />
                          )}
                          <span className={cn(
                            "px-2 py-1 rounded text-xs font-medium",
                            finding.severity === 'normal' && "bg-success-light text-success",
                            finding.severity === 'abnormal' && "bg-warning-light text-warning",
                            finding.severity === 'critical' && "bg-destructive-light text-destructive"
                          )}>
                            {finding.finding}
                          </span>
                          <span className="text-muted-foreground">
                            ({(finding.confidence * 100).toFixed(0)}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Message Status */}
          {message.status === 'error' && (
            <div className="flex items-center space-x-1 text-xs text-destructive">
              <AlertTriangle className="h-3 w-3" />
              <span>Failed to send message</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};