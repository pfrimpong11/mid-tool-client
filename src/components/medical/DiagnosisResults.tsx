import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Brain, 
  Calendar, 
  Target, 
  FileImage, 
  Edit2, 
  Save, 
  X, 
  Download,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Info
} from 'lucide-react';
import { DiagnosisResponse, DiagnosisUpdate } from '@/types';
import { diagnosisService } from '@/lib/diagnosisService';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface DiagnosisResultsProps {
  diagnosis: DiagnosisResponse;
  onUpdate?: (updatedDiagnosis: DiagnosisResponse) => void;
  showActions?: boolean;
  className?: string;
}

export const DiagnosisResults: React.FC<DiagnosisResultsProps> = ({
  diagnosis,
  onUpdate,
  showActions = true,
  className
}) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(diagnosis.notes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showSegmentation, setShowSegmentation] = useState(false);

  const handleSaveNotes = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);
      const update: DiagnosisUpdate = { notes };
      const updatedDiagnosis = await diagnosisService.updateDiagnosis(diagnosis.id, update);
      onUpdate?.(updatedDiagnosis);
      setIsEditingNotes(false);
    } catch (error) {
      console.error('Failed to update notes:', error);
      // Could show a toast notification here
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setNotes(diagnosis.notes || '');
    setIsEditingNotes(false);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBadge = (confidence: number) => {
    const level = diagnosisService.getConfidenceLevel(confidence);
    
    switch (level) {
      case 'high':
        return <Badge variant="outline" className="text-green-600 border-green-600">High Confidence</Badge>;
      case 'medium':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Medium Confidence</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-red-600 border-red-600">Low Confidence</Badge>;
    }
  };

  const getSeverityIcon = (predictedClass: string, confidence: number) => {
    const severity = diagnosisService.getSeverityLevel(predictedClass, confidence);
    
    switch (severity) {
      case 'normal':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getSeverityMessage = (predictedClass: string, confidence: number) => {
    if (predictedClass.toLowerCase() === 'notumor') {
      return 'No tumor detected in the brain scan. This is a normal result.';
    }
    
    const tumorType = diagnosisService.formatPredictionClass(predictedClass);
    const confidenceLevel = diagnosisService.getConfidenceLevel(confidence);
    
    if (confidenceLevel === 'high') {
      return `High confidence detection of ${tumorType}. Recommend immediate consultation with a neurologist.`;
    } else if (confidenceLevel === 'medium') {
      return `Possible ${tumorType} detected. Further examination and additional imaging may be required.`;
    } else {
      return `Low confidence result. Additional imaging and expert review recommended.`;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP p');
    } catch {
      return dateString;
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Main Results Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center">
              <Brain className="h-6 w-6 mr-2 text-primary" />
              Brain Tumor Analysis Results
            </CardTitle>
            <div className="flex items-center space-x-2">
              {getSeverityIcon(diagnosis.predicted_class, diagnosis.confidence_score)}
              {getConfidenceBadge(diagnosis.confidence_score)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Diagnosis Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground flex items-center">
                <Target className="h-4 w-4 mr-1" />
                Diagnosis
              </Label>
              <p className="text-2xl font-bold">
                {diagnosisService.formatPredictionClass(diagnosis.predicted_class)}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Confidence Score</Label>
              <p className={cn("text-2xl font-bold", getConfidenceColor(diagnosis.confidence_score))}>
                {(diagnosis.confidence_score * 100).toFixed(1)}%
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Analysis Date
              </Label>
              <p className="text-sm font-medium">
                {formatDate(diagnosis.created_at)}
              </p>
            </div>
          </div>

          {/* Clinical Interpretation */}
          <div className="space-y-3">
            <Label className="text-sm text-muted-foreground">Clinical Interpretation</Label>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm leading-relaxed">
                {getSeverityMessage(diagnosis.predicted_class, diagnosis.confidence_score)}
              </p>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-muted-foreground">Clinical Notes</Label>
              {showActions && !isEditingNotes && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingNotes(true)}
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>

            {isEditingNotes ? (
              <div className="space-y-3">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add clinical notes, observations, or recommendations..."
                  className="min-h-[100px]"
                />
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={handleSaveNotes}
                    disabled={isSaving}
                  >
                    {isSaving ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Save className="h-4 w-4" />}
                    <span className="ml-1">Save</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-muted rounded-lg min-h-[60px]">
                {diagnosis.notes ? (
                  <p className="text-sm">{diagnosis.notes}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No clinical notes added</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original Image */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <FileImage className="h-5 w-5 mr-2" />
              Original MRI Scan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
              <img
                src={diagnosis.image_url}
                alt="Original MRI Scan"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
            {showActions && (
              <div className="flex space-x-2 mt-4">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Full Screen
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Segmentation Image */}
        {diagnosis.segmentation_url && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Tumor Segmentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
                <img
                  src={diagnosis.segmentation_url}
                  alt="Tumor Segmentation"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>
              {showActions && (
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Full Screen
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Disclaimer */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-yellow-800">
                Important Medical Disclaimer
              </p>
              <p className="text-sm text-yellow-700">
                This AI analysis is for informational purposes only and should not replace professional medical diagnosis. 
                Always consult with qualified healthcare professionals for medical decisions and treatment plans.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};