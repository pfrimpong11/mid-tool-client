import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileImage, AlertCircle, Brain, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DiagnosisResponse, FileUploadProgress } from '@/types';
import { diagnosisService } from '@/lib/diagnosisService';

interface ImageUploadProps {
  onDiagnosisComplete?: (diagnosis: DiagnosisResponse) => void;
  maxFiles?: number;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onDiagnosisComplete,
  maxFiles = 1, // Brain tumor diagnosis is typically one image at a time
  className
}) => {
  const [uploadProgress, setUploadProgress] = useState<FileUploadProgress[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0]; // Take only the first file for brain tumor diagnosis
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
        progress: Math.min(progress, 90) // Keep it at 90% until actual processing
      }]);

      if (progress >= 90) {
        clearInterval(interval);
        // Start actual diagnosis process
        processDiagnosis(file, progressEntry);
      }
    }, 100);
  }, []);

  const processDiagnosis = async (file: File, progressEntry: FileUploadProgress) => {
    try {
      setIsProcessing(true);
      
      // Update progress to processing
      setUploadProgress([{
        ...progressEntry,
        progress: 95,
        status: 'processing'
      }]);

      // Call diagnosis API
      const result = await diagnosisService.diagnoseBrainTumor(file, notes || undefined);
      
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
        status: 'error'
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.bmp', '.tiff']
    },
    maxFiles: 1,
    multiple: false
  });

  const removePreview = () => {
    setPreviews([]);
    setUploadProgress([]);
    setDiagnosis(null);
    setError(null);
    setNotes('');
  };

  const resetUpload = () => {
    removePreview();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityBadge = (predictedClass: string, confidence: number) => {
    const severity = diagnosisService.getSeverityLevel(predictedClass, confidence);
    
    switch (severity) {
      case 'normal':
        return <Badge variant="outline" className="text-green-600 border-green-600">Normal</Badge>;
      case 'warning':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Attention</Badge>;
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Dropzone */}
      {!diagnosis && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-[var(--transition-medical)]",
            isDragActive 
              ? "border-primary bg-medical-blue-light" 
              : "border-border hover:border-primary hover:bg-clinical-gray/50",
            "medical-card",
            isProcessing && "cursor-not-allowed opacity-50"
          )}
        >
          <input {...getInputProps()} disabled={isProcessing} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 rounded-full bg-clinical-gray">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h3 className="medical-heading text-lg">
                {isDragActive ? 'Drop MRI scan here' : 'Upload MRI Brain Scan'}
              </h3>
              <p className="clinical-text text-sm">
                Drag & drop your MRI brain scan for tumor analysis
              </p>
              <p className="clinical-text text-xs">
                Supports JPEG, PNG, TIFF • Single file • Up to 10MB
              </p>
            </div>

            {!isProcessing && (
              <Button variant="medical" size="lg">
                <FileImage className="mr-2 h-4 w-4" />
                Select MRI Scan
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Notes Input */}
      {previews.length > 0 && !diagnosis && (
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Add any relevant clinical notes or observations..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isProcessing}
            className="min-h-[80px]"
          />
        </div>
      )}

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              {getStatusIcon(uploadProgress[0].status)}
              <span className="ml-2">
                {uploadProgress[0].status === 'uploading' && 'Uploading...'}
                {uploadProgress[0].status === 'processing' && 'Analyzing Brain Scan...'}
                {uploadProgress[0].status === 'completed' && 'Analysis Complete'}
                {uploadProgress[0].status === 'error' && 'Analysis Failed'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium truncate">
                  {uploadProgress[0].filename}
                </span>
                <span className="text-xs text-muted-foreground">
                  {uploadProgress[0].progress.toFixed(0)}%
                </span>
              </div>
              
              <div className="w-full bg-clinical-gray rounded-full h-2">
                <div 
                  className={cn(
                    "h-2 rounded-full transition-all duration-500",
                    uploadProgress[0].status === 'error' ? "bg-red-500" : "bg-primary"
                  )}
                  style={{ width: `${uploadProgress[0].progress}%` }}
                />
              </div>

              {uploadProgress[0].status === 'processing' && (
                <p className="text-xs text-muted-foreground">
                  AI is analyzing your brain scan for tumor detection...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">Analysis Failed</p>
                <p className="text-sm text-red-500">{error}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3"
              onClick={resetUpload}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Diagnosis Results */}
      {diagnosis && (
        <Card className="border-green-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                Analysis Complete
              </CardTitle>
              {getSeverityBadge(diagnosis.predicted_class, diagnosis.confidence_score)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Prediction */}
              <div>
                <Label className="text-sm text-muted-foreground">Diagnosis</Label>
                <p className="text-lg font-semibold">
                  {diagnosisService.formatPredictionClass(diagnosis.predicted_class)}
                </p>
              </div>

              {/* Confidence */}
              <div>
                <Label className="text-sm text-muted-foreground">Confidence Score</Label>
                <p className={cn("text-lg font-semibold", getConfidenceColor(diagnosis.confidence_score))}>
                  {(diagnosis.confidence_score * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Notes */}
            {diagnosis.notes && (
              <div>
                <Label className="text-sm text-muted-foreground">Notes</Label>
                <p className="text-sm">{diagnosis.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2 pt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={resetUpload}
              >
                Analyze Another Scan
              </Button>
              <Button 
                variant="medical" 
                size="sm"
                onClick={() => {
                  // Navigate to detailed view or export report
                  console.log('View detailed results for diagnosis:', diagnosis.id);
                }}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Preview */}
      {previews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Uploaded Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative group">
              <img
                src={previews[0]}
                alt="MRI Brain Scan"
                className="w-full max-w-md mx-auto h-64 object-contain rounded-md border"
              />
              {!isProcessing && !diagnosis && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={removePreview}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};