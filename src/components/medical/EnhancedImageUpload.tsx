import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileImage, AlertCircle, Brain, Loader2, CheckCircle2, Heart, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { 
  DiagnosisResponse, 
  BreastCancerDiagnosisResponse,
  FileUploadProgress, 
  MedicalAnalysisType,
  BreastCancerAnalysisType,
  MedicalDiagnosis 
} from '@/types';
import { diagnosisService } from '@/lib/diagnosisService';
import { breastCancerService } from '@/lib/breastCancerService';
import { strokeService } from '@/lib/strokeService';

interface EnhancedImageUploadProps {
  onDiagnosisComplete?: (diagnosis: MedicalDiagnosis) => void;
  defaultAnalysisType?: MedicalAnalysisType;
  maxFiles?: number;
  className?: string;
}

export const EnhancedImageUpload: React.FC<EnhancedImageUploadProps> = ({
  onDiagnosisComplete,
  defaultAnalysisType = 'stroke',
  maxFiles = 1,
  className
}) => {
  const [uploadProgress, setUploadProgress] = useState<FileUploadProgress[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<MedicalDiagnosis | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Analysis type selection
  const [analysisType, setAnalysisType] = useState<MedicalAnalysisType>(defaultAnalysisType);
  const [breastCancerAnalysisType, setBreastCancerAnalysisType] = useState<BreastCancerAnalysisType>(BreastCancerAnalysisType.BOTH);

  const analysisTypes = [
    {
      value: 'stroke' as MedicalAnalysisType,
      label: 'Stroke Analysis',
      description: 'MRI brain scan analysis for stroke detection',
      icon: Stethoscope,
      color: 'from-purple-500 to-purple-600'
    },
    {
      value: 'brain_tumor' as MedicalAnalysisType,
      label: 'Brain Tumor Analysis',
      description: 'MRI brain scan analysis for tumor detection',
      icon: Brain,
      color: 'from-blue-500 to-blue-600'
    },
    {
      value: 'breast_cancer' as MedicalAnalysisType,
      label: 'Breast Cancer Analysis',
      description: 'Mammography and tissue analysis',
      icon: Heart,
      color: 'from-pink-500 to-pink-600'
    }
  ];

  const breastCancerSubTypes = [
    {
      value: BreastCancerAnalysisType.BIRADS,
      label: 'BI-RADS Classification',
      description: 'Mammography analysis using BI-RADS system'
    },
    {
      value: BreastCancerAnalysisType.PATHOLOGICAL,
      label: 'Pathological Analysis',
      description: 'Tissue/histology analysis'
    },
    {
      value: BreastCancerAnalysisType.BOTH,
      label: 'Comprehensive Analysis',
      description: 'Both BI-RADS and pathological analysis'
    }
  ];

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setError(null);
    setDiagnosis(null);

    // Create upload progress entry
    const progressEntry: FileUploadProgress = {
      id: Math.random().toString(36).substr(2, 9),
      filename: file.name,
      progress: 0,
      status: 'uploading'
    };

    setUploadProgress([progressEntry]);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviews([reader.result as string]);
    };
    reader.readAsDataURL(file);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      
      setUploadProgress([{
        ...progressEntry,
        progress: Math.min(progress, 90)
      }]);

      if (progress >= 90) {
        clearInterval(interval);
        // Start actual diagnosis process
        processDiagnosis(file, progressEntry);
      }
    }, 100);
  }, [analysisType, breastCancerAnalysisType]);

  const processDiagnosis = async (file: File, progressEntry: FileUploadProgress) => {
    try {
      setIsProcessing(true);
      
      // Update progress to processing
      setUploadProgress([{
        ...progressEntry,
        progress: 95,
        status: 'processing'
      }]);

      let result: MedicalDiagnosis;

      if (analysisType === 'stroke') {
        const strokeResult = await strokeService.diagnoseStroke(file, notes || undefined);
        result = {
          ...strokeResult,
          analysis_type: undefined,
          segmentation_url: undefined
        };
      } else if (analysisType === 'brain_tumor') {
        const brainResult = await diagnosisService.diagnoseBrainTumor(file, notes || undefined);
        result = {
          ...brainResult,
          analysis_type: undefined
        };
      } else {
        const breastResult = await breastCancerService.diagnoseBreastCancer(
          file, 
          breastCancerAnalysisType, 
          notes || undefined
        );
        result = {
          ...breastResult,
          segmentation_url: undefined
        };
      }
      
      // Complete progress
      setUploadProgress([{
        ...progressEntry,
        progress: 100,
        status: 'completed'
      }]);

      setDiagnosis(result);
      onDiagnosisComplete?.(result);
      
    } catch (err) {
      console.error('Diagnosis failed:', err);
      setError(err instanceof Error ? err.message : 'Diagnosis failed. Please try again.');
      
      setUploadProgress([{
        ...progressEntry,
        progress: 0,
        status: 'error',
        error: err instanceof Error ? err.message : 'Upload failed'
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff', '.webp']
    },
    maxFiles,
    disabled: isProcessing
  });

  const handleReset = () => {
    setPreviews([]);
    setUploadProgress([]);
    setDiagnosis(null);
    setError(null);
    setNotes('');
  };

  const getCurrentAnalysisConfig = () => {
    const analysisConfig = analysisTypes.find(type => type.value === analysisType);
    return analysisConfig;
  };

  const analysisConfig = getCurrentAnalysisConfig();

  return (
    <div className={cn('space-y-6', className)}>
      {/* Analysis Type Selection */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Stethoscope className="h-5 w-5 mr-2" />
            Analysis Type Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={analysisType}
            onValueChange={(value) => setAnalysisType(value as MedicalAnalysisType)}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {analysisTypes.map((type) => (
              <div key={type.value} className="space-y-2">
                <Label 
                  htmlFor={type.value}
                  className={cn(
                    'flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md',
                    analysisType === type.value 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' 
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <RadioGroupItem value={type.value} id={type.value} />
                  <div className={cn(
                    'h-10 w-10 rounded-lg bg-gradient-to-br flex items-center justify-center',
                    type.color
                  )}>
                    <type.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{type.label}</div>
                    <div className="text-sm text-muted-foreground">{type.description}</div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>

          {/* Breast Cancer Sub-type Selection */}
          {analysisType === 'breast_cancer' && (
            <div className="mt-4 pt-4 border-t">
              <Label className="text-sm font-medium mb-3 block">Breast Cancer Analysis Type</Label>
              <Select value={breastCancerAnalysisType} onValueChange={(value) => setBreastCancerAnalysisType(value as BreastCancerAnalysisType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select analysis type" />
                </SelectTrigger>
                <SelectContent>
                  {breastCancerSubTypes.map((subType) => (
                    <SelectItem key={subType.value} value={subType.value}>
                      <div className="space-y-1">
                        <div className="font-medium">{subType.label}</div>
                        <div className="text-xs text-muted-foreground">{subType.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Upload Section */}
      <Card className={cn(
        'transition-colors',
        analysisConfig ? `border-${analysisConfig.color.split('-')[1]}-200 bg-${analysisConfig.color.split('-')[1]}-50/30` : ''
      )}>
        <CardHeader>
          <CardTitle className="flex items-center">
            {analysisConfig && <analysisConfig.icon className="h-5 w-5 mr-2" />}
            Upload Medical Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isProcessing && uploadProgress.length === 0 && !diagnosis && (
            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                isDragActive 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' 
                  : 'border-gray-300 hover:border-gray-400',
                isProcessing && 'pointer-events-none opacity-50'
              )}
            >
              <input {...getInputProps()} />
              <Upload className={cn(
                'mx-auto h-12 w-12 mb-4',
                isDragActive ? 'text-blue-500' : 'text-gray-400'
              )} />
              <p className="text-lg font-medium mb-2">
                {isDragActive ? 'Drop your medical image here' : 'Upload medical image for analysis'}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop or click to select • PNG, JPG, JPEG up to 10MB
              </p>
              <Badge variant="outline" className="mb-2">
                {analysisConfig?.label}
              </Badge>
            </div>
          )}

          {/* Preview and Progress */}
          {previews.length > 0 && (
            <div className="space-y-4">
              <div className="grid gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    {!isProcessing && !diagnosis && (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={handleReset}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Upload Progress */}
              {uploadProgress.map((progress) => (
                <div key={progress.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{progress.filename}</span>
                    <span className="text-sm text-muted-foreground">
                      {progress.status === 'processing' ? 'Analyzing...' : `${Math.round(progress.progress)}%`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        progress.status === 'completed' ? 'bg-green-500' : 
                        progress.status === 'error' ? 'bg-red-500' :
                        progress.status === 'processing' ? 'bg-blue-500 animate-pulse' : 'bg-blue-500'
                      )}
                      style={{ width: `${progress.progress}%` }}
                    />
                  </div>
                  {progress.error && (
                    <div className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {progress.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Notes Input */}
          {previews.length > 0 && !diagnosis && (
            <div className="space-y-2 mt-4">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any relevant notes about the scan or patient history..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-700 font-medium">Analysis Failed</span>
              </div>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="mt-3"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex items-center justify-center space-x-3 py-6">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              <span className="text-lg font-medium">Processing your medical image...</span>
            </div>
          )}

          {/* Success - Analysis Complete */}
          {diagnosis && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <div className="flex items-center mb-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-green-700 font-medium">Analysis Complete</span>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Result: </span>
                  <Badge variant="outline" className="ml-1">
                    {diagnosis.predicted_class}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Confidence: </span>
                  <span className="font-medium">
                    {(diagnosis.confidence_score * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Analysis Type: </span>
                  <span className="font-medium">
                    {analysisConfig?.label}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="mt-3"
              >
                Analyze Another Image
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};