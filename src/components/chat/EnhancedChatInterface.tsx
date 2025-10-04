import React, { useState, useRef, useEffect } from 'react';
import { 
  Paperclip, 
  Mic, 
  MoreVertical, 
  Sparkles, 
  Clock, 
  Brain, 
  Upload,
  FileImage,
  X,
  Zap,
  Shield,
  Activity,
  ChevronDown,
  Plus,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { ChatMessageComponent } from './ChatMessage';
import { EnhancedImageUpload } from '../medical/EnhancedImageUpload';
import { useAppStore } from '@/store/useAppStore';
import { ChatMessage, MedicalImage, MedicalDiagnosis } from '@/types';
import { dummyChatMessages } from '@/data/dummyData';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const EnhancedChatInterface: React.FC = () => {
  const [currentImages, setCurrentImages] = useState<MedicalImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<'quick' | 'detailed' | 'research'>('quick');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { currentSession, updateSession } = useAppStore();
  const messages = currentSession?.messages || dummyChatMessages;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analysisTypes = [
    { id: 'quick', label: 'Quick Scan', icon: Zap, description: 'Fast preliminary analysis' },
    { id: 'detailed', label: 'Detailed Analysis', icon: Brain, description: 'Comprehensive diagnostic review' },
    { id: 'research', label: 'Research Mode', icon: Activity, description: 'In-depth clinical research' }
  ];

  const handleImagesUploaded = (images: MedicalImage[]) => {
    setCurrentImages(prev => [...prev, ...images]);
  };

  const handleDiagnosisComplete = (diagnosis: MedicalDiagnosis) => {
    // Handle diagnosis completion
    console.log('Diagnosis completed:', diagnosis);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900/20">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 dark:bg-slate-900/80 dark:border-slate-700/50 p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center shadow-lg">
                <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Medical Analysis
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
                  Intelligent diagnostic assistance powered by advanced AI
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Analysis Mode Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                  {analysisTypes.find(t => t.id === analysisMode)?.icon && 
                    React.createElement(analysisTypes.find(t => t.id === analysisMode)!.icon, { className: "h-3 w-3 sm:h-4 sm:w-4" })
                  }
                  <span className="hidden sm:inline">
                    {analysisTypes.find(t => t.id === analysisMode)?.label}
                  </span>
                  <span className="sm:hidden">
                    {analysisTypes.find(t => t.id === analysisMode)?.label.split(' ')[0]}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 sm:w-64">
                {analysisTypes.map((type) => (
                  <DropdownMenuItem 
                    key={type.id}
                    onClick={() => setAnalysisMode(type.id as any)}
                    className="flex flex-col items-start gap-1 p-3"
                  >
                    <div className="flex items-center gap-2">
                      <type.icon className="h-4 w-4" />
                      <span className="font-medium">{type.label}</span>
                    </div>
                    <span className="text-xs text-slate-500">{type.description}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 sm:h-10 sm:w-10"
            >
              {isExpanded ? <Minimize2 className="h-3 w-3 sm:h-4 sm:w-4" /> : <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />}
            </Button>
          </div>
        </div>

        {/* Analysis Mode Selector */}
        <div className="mt-3 sm:mt-4 flex flex-wrap gap-1 sm:gap-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <Brain className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Upload medical images above for AI-powered analysis</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto px-4">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 flex items-center justify-center mb-4 sm:mb-6">
              <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 sm:mb-3">
              Welcome to AI Medical Analysis
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 leading-relaxed">
              Upload medical images for intelligent diagnostic assistance.
              Our AI analyzes scans, identifies potential findings, and provides detailed insights.
            </p>

            <div className="flex justify-center w-full max-w-sm">
              <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer w-full" onClick={() => {}}>
                <div className="flex flex-col items-center text-center gap-3 sm:gap-4">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 flex items-center justify-center">
                    <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-1">Upload Medical Images</h3>
                    <p className="text-sm text-slate-500">Start with X-rays, CT scans, MRIs, or ultrasounds</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <>
            {/* {messages.map((msg) => (
              <ChatMessageComponent key={msg.id} message={msg} />
            ))} */}
            
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 dark:bg-slate-800/80 dark:border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-xs sm:max-w-2xl shadow-lg">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                    <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
                      <Brain className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                    </div>
                    <span className="font-medium text-sm sm:text-base text-slate-900 dark:text-slate-100">AI Analysis in Progress</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-blue-600 rounded-full animate-pulse"></div>
                      <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 ml-2 sm:ml-3">
                      Processing your medical data...
                    </span>
                  </div>
                  <div className="mt-2 sm:mt-3 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="h-3 w-3 inline mr-1" />
                    Estimated time: {analysisMode === 'quick' ? '30-60' : analysisMode === 'detailed' ? '2-5' : '5-10'} seconds
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        
        <div ref={messagesEndRef} />
      </div>



      {/* Current Images Preview */}
      {currentImages.length > 0 && (
        <div className="border-t border-slate-200/50 dark:border-slate-700/50 bg-white/50 backdrop-blur-sm dark:bg-slate-900/50 p-3 sm:p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
              <FileImage className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              <span className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                Attached Images ({currentImages.length})
              </span>
              <Badge variant="outline" className="text-xs">
                Ready for analysis
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {currentImages.map((image, index) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.url}
                    alt={image.filename}
                    className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-lg border-2 border-slate-200 dark:border-slate-700 shadow-sm"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-5 w-5 sm:h-6 sm:w-6"
                      onClick={() => setCurrentImages(prev => prev.filter((_, i) => i !== index))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="absolute -bottom-1 -right-1">
                    <Badge variant="secondary" className="text-xs px-1 sm:px-1.5 py-0.5">
                      {image.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Image Upload Area - Always Visible */}
      <div className="border-t border-slate-200/50 dark:border-slate-700/50 bg-white/80 backdrop-blur-xl dark:bg-slate-900/80 p-3 sm:p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100">Upload Medical Images for Analysis</h3>
              <Badge variant="secondary" className="text-xs">
                Max 3 files
              </Badge>
            </div>
          </div>
          <EnhancedImageUpload
            onDiagnosisComplete={handleDiagnosisComplete}
            maxFiles={3}
          />
        </div>
      </div>
    </div>
  );
};