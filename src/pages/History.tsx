import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  History as HistoryIcon, 
  Search, 
  Filter, 
  Calendar,
  FileText,
  Eye,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Brain,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { MedicalDiagnosis } from '@/types';
import { medicalService } from '@/lib/medicalService';
import { DiagnosisResults } from '@/components/medical/DiagnosisResults';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export const History: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [diagnoses, setDiagnoses] = useState<MedicalDiagnosis[]>([]);
  const [totalDiagnoses, setTotalDiagnoses] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<MedicalDiagnosis | null>(null);
  const [analysisTypeFilter, setAnalysisTypeFilter] = useState<string>('all');
  
  const itemsPerPage = 8;

  useEffect(() => {
    loadDiagnoses();
  }, [currentPage]);

  const loadDiagnoses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const skip = (currentPage - 1) * itemsPerPage;
      const response = await medicalService.getAllDiagnoses(skip, itemsPerPage);
      
      setDiagnoses(response.results);
      setTotalDiagnoses(response.total);
    } catch (err) {
      console.error('Failed to load diagnoses:', err);
      setError(err instanceof Error ? err.message : 'Failed to load diagnosis history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    loadDiagnoses();
  };

  const handleDeleteDiagnosis = async (diagnosis: MedicalDiagnosis) => {
    if (!confirm('Are you sure you want to delete this diagnosis? This action cannot be undone.')) {
      return;
    }

    try {
      await medicalService.deleteDiagnosis(diagnosis);
      await loadDiagnoses(); // Reload the list
    } catch (err) {
      console.error('Failed to delete diagnosis:', err);
      // Could show a toast notification here
    }
  };

  const filteredDiagnoses = diagnoses.filter(diagnosis => {
    const matchesSearch = diagnosis.predicted_class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (diagnosis.notes && diagnosis.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Handle analysis type filtering
    let matchesAnalysisType = false;
    
    if (analysisTypeFilter === 'all') {
      matchesAnalysisType = true;
    } else if (analysisTypeFilter === 'stroke') {
      matchesAnalysisType = diagnosis.diagnosis_type === 'stroke';
    } else if (analysisTypeFilter === 'brain_tumor') {
      matchesAnalysisType = diagnosis.diagnosis_type === 'brain_tumor';
    } else if (analysisTypeFilter === 'breast_cancer_birads') {
      matchesAnalysisType = diagnosis.diagnosis_type === 'breast_cancer' && 
        diagnosis.analysis_type === 'birads';
    } else if (analysisTypeFilter === 'breast_cancer_pathological') {
      matchesAnalysisType = diagnosis.diagnosis_type === 'breast_cancer' && 
        diagnosis.analysis_type === 'pathological';
    } else if (analysisTypeFilter === 'breast_cancer_both') {
      matchesAnalysisType = diagnosis.diagnosis_type === 'breast_cancer' && 
        diagnosis.analysis_type === 'both';
    }
    
    return matchesSearch && matchesAnalysisType;
  });

  const totalPages = Math.ceil(totalDiagnoses / itemsPerPage);

  const getStatusColor = (diagnosis: MedicalDiagnosis) => {
    const severity = medicalService.getSeverityLevel(diagnosis);
    
    switch (severity) {
      case 'normal': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityIcon = (diagnosis: MedicalDiagnosis) => {
    const severity = medicalService.getSeverityLevel(diagnosis);
    
    switch (severity) {
      case 'normal':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Brain className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  if (selectedDiagnosis) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedDiagnosis(null)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to History
          </Button>
          <h1 className="text-2xl font-bold">Diagnosis Details</h1>
        </div>
        
        <DiagnosisResults 
          diagnosis={selectedDiagnosis}
          onUpdate={(updated) => {
            setSelectedDiagnosis(updated);
            // Update in the list as well
            setDiagnoses(prev => 
              prev.map(d => d.id === updated.id ? updated : d)
            );
          }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-[var(--gradient-medical)] flex items-center justify-center">
            <HistoryIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="medical-heading text-2xl">Diagnosis History</h1>
            <p className="clinical-text">View and manage previous medical analyses</p>
          </div>
        </div>
        
        <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={cn("h-4 w-4 mr-1", isLoading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search diagnoses by prediction class or notes..."
            className="medical-input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select 
              value={analysisTypeFilter} 
              onChange={(e) => setAnalysisTypeFilter(e.target.value)}
              className="appearance-none bg-background border border-input rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Analyses</option>
              <option value="stroke">Stroke</option>
              <option value="brain_tumor">Brain Tumor</option>
              <option value="breast_cancer_birads">BI-RADS</option>
              <option value="breast_cancer_pathological">Pathological</option>
              <option value="breast_cancer_both">Comprehensive Breast</option>
            </select>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Date Range
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-muted-foreground">Loading diagnosis history...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <p className="font-medium">Failed to load diagnosis history</p>
                <p className="text-sm text-red-500">{error}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3"
              onClick={handleRefresh}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !error && diagnoses.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Diagnoses Found</h3>
              <p className="text-muted-foreground mb-4">
                You haven't performed any brain tumor analyses yet.
              </p>
              <Button variant="medical">
                Start New Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Grid */}
      {!isLoading && !error && filteredDiagnoses.length > 0 && (
        <>
          <div className="grid gap-4">
            {filteredDiagnoses.map((diagnosis) => (
              <Card key={diagnosis.id} className="medical-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Thumbnail */}
                      <div className="w-16 h-16 bg-black rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={medicalService.getDiagnosisImageUrl(diagnosis)}
                          alt="Medical Scan"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-3">
                          {getSeverityIcon(diagnosis)}
                          <h3 className="font-semibold text-lg">
                            {medicalService.formatPredictionClass(diagnosis)}
                          </h3>
                          <Badge 
                            variant="outline" 
                            className={getStatusColor(diagnosis)}
                          >
                            {medicalService.getSeverityLevel(diagnosis)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Type: </span>
                            <span className="font-medium">{medicalService.getDiagnosisTypeDisplayName(diagnosis.diagnosis_type)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Confidence: </span>
                            <span className={cn("font-medium", getConfidenceColor(diagnosis.confidence_score))}>
                              {(diagnosis.confidence_score * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Date: </span>
                            <span className="font-medium">{formatDate(diagnosis.created_at)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">ID: </span>
                            <span className="font-medium">#{diagnosis.id}</span>
                          </div>
                        </div>

                        {diagnosis.notes && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {diagnosis.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDiagnosis(diagnosis)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteDiagnosis(diagnosis)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalDiagnoses)} of {totalDiagnoses} diagnoses
              </p>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};