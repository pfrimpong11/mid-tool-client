import { diagnosisService } from './diagnosisService';
import { breastCancerService } from './breastCancerService';
import { strokeService } from './strokeService';
import { 
  DiagnosisResponse, 
  DiagnosisListResponse,
  BreastCancerDiagnosisResponse, 
  BreastCancerDiagnosisListResponse,
  BreastCancerAnalysisType,
  MedicalDiagnosis,
  MedicalAnalysisType
} from '../types';

class MedicalService {
  private static instance: MedicalService;

  public static getInstance(): MedicalService {
    if (!MedicalService.instance) {
      MedicalService.instance = new MedicalService();
    }
    return MedicalService.instance;
  }

  /**
   * Get all diagnoses (brain tumor, breast cancer, and stroke) for the current user
   */
  async getAllDiagnoses(skip: number = 0, limit: number = 100): Promise<{
    results: MedicalDiagnosis[];
    total: number;
    brainTumorTotal: number;
    breastCancerTotal: number;
    strokeTotal: number;
  }> {
    try {
      // Fetch all three types of diagnoses
      const [brainTumorResults, breastCancerResults, strokeResults] = await Promise.all([
        diagnosisService.getDiagnoses(0, 1000), // Get all for proper counting/sorting
        breastCancerService.getBreastCancerDiagnoses(0, 1000),
        strokeService.getStrokeDiagnoses(0, 1000) // Add stroke diagnoses
      ]);

      // Convert to unified format
      const brainTumorDiagnoses: MedicalDiagnosis[] = brainTumorResults.results.map(d => ({
        ...d,
        analysis_type: undefined // Brain tumor doesn't have analysis_type
      }));

      const breastCancerDiagnoses: MedicalDiagnosis[] = breastCancerResults.results.map(d => ({
        ...d,
        segmentation_url: undefined // Breast cancer doesn't have segmentation
      }));

      const strokeDiagnoses: MedicalDiagnosis[] = strokeResults.results.map(d => ({
        ...d,
        analysis_type: undefined, // Stroke doesn't have analysis_type
        segmentation_url: undefined // Stroke doesn't have segmentation
      }));

      // Combine and sort by date (most recent first)
      const allDiagnoses = [...brainTumorDiagnoses, ...breastCancerDiagnoses, ...strokeDiagnoses]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      // Apply pagination
      const paginatedResults = allDiagnoses.slice(skip, skip + limit);

      return {
        results: paginatedResults,
        total: allDiagnoses.length,
        brainTumorTotal: brainTumorResults.total,
        breastCancerTotal: breastCancerResults.total,
        strokeTotal: strokeResults.total
      };
    } catch (error) {
      console.error('Failed to fetch all diagnoses:', error);
      throw error;
    }
  }

  /**
   * Get statistics for dashboard (now uses dedicated statistics endpoints)
   */
  async getDashboardStats(): Promise<{
    totalDiagnoses: number;
    brainTumorDiagnoses: number;
    breastCancerDiagnoses: number;
    strokeDiagnoses: number;
    criticalFindings: number;
    normalFindings: number;
    recentActivity: MedicalDiagnosis[];
  }> {
    try {
      // Import statisticsService here to avoid circular dependency
      const { statisticsService } = await import('./statisticsService');
      
      // Get dashboard stats from dedicated endpoint
      const dashboardStats = await statisticsService.getDashboardStats();
      
      // Get recent activity
      const recentActivity = await statisticsService.getRecentActivity(10);
      
      // Convert recent activity to MedicalDiagnosis format
      const formattedRecentActivity: MedicalDiagnosis[] = recentActivity.map(activity => ({
        id: activity.id,
        diagnosis_type: activity.diagnosis_type,
        predicted_class: activity.predicted_class,
        confidence_score: activity.confidence_score,
        image_url: activity.image_url || '', // Use the actual image URL from statistics
        segmentation_url: activity.segmentation_url || undefined,
        notes: activity.notes || undefined,
        created_at: activity.created_at,
        analysis_type: undefined,
        birads_result: undefined,
        pathological_result: undefined
      }));

      return {
        totalDiagnoses: dashboardStats.total_diagnoses,
        brainTumorDiagnoses: dashboardStats.brain_tumor_diagnoses,
        breastCancerDiagnoses: dashboardStats.breast_cancer_diagnoses,
        strokeDiagnoses: dashboardStats.stroke_diagnoses || 0,
        criticalFindings: dashboardStats.critical_findings,
        normalFindings: dashboardStats.normal_findings,
        recentActivity: formattedRecentActivity
      };
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  }

  /**
   * Get unified severity level for any diagnosis type
   */
  getSeverityLevel(diagnosis: MedicalDiagnosis): 'normal' | 'warning' | 'critical' {
    if (diagnosis.diagnosis_type === 'brain_tumor') {
      return diagnosisService.getSeverityLevel(diagnosis.predicted_class, diagnosis.confidence_score);
    } else if (diagnosis.diagnosis_type.startsWith('breast_cancer')) {
      return breastCancerService.getBreastCancerSeverityLevel(
        diagnosis.predicted_class, 
        diagnosis.confidence_score, 
        diagnosis.analysis_type
      );
    } else if (diagnosis.diagnosis_type === 'stroke') {
      // Use imported strokeService for severity level
      return strokeService.getSeverityLevel(diagnosis.predicted_class, diagnosis.confidence_score);
    }
    
    // Fallback
    return 'normal';
  }

  /**
   * Format prediction class for display for any diagnosis type
   */
  formatPredictionClass(diagnosis: MedicalDiagnosis): string {
    if (diagnosis.diagnosis_type === 'brain_tumor') {
      return diagnosisService.formatPredictionClass(diagnosis.predicted_class);
    } else if (diagnosis.diagnosis_type.startsWith('breast_cancer')) {
      return breastCancerService.formatBreastCancerPredictionClass(
        diagnosis.predicted_class, 
        diagnosis.analysis_type
      );
    } else if (diagnosis.diagnosis_type === 'stroke') {
      // Use imported strokeService for formatting
      return strokeService.formatStrokePredictionClass(diagnosis.predicted_class);
    }
    
    return diagnosis.predicted_class;
  }

  /**
   * Get diagnosis type display name
   */
  getDiagnosisTypeDisplayName(diagnosisType: string): string {
    switch (diagnosisType) {
      case 'brain_tumor':
        return 'Brain Tumor Analysis';
      case 'breast_cancer_birads':
        return 'BI-RADS Classification';
      case 'breast_cancer_pathological':
        return 'Pathological Analysis';
      case 'breast_cancer_both':
        return 'Comprehensive Breast Analysis';
      case 'stroke':
        return 'Stroke Analysis';
      default:
        return 'Medical Analysis';
    }
  }

  /**
   * Get the appropriate image URL for a diagnosis
   */
  getDiagnosisImageUrl(diagnosis: MedicalDiagnosis): string {
    // Since we now use Cloudinary URLs directly, just return the image_url field
    return diagnosis.image_url;
  }

  /**
   * Get the appropriate segmentation URL for a diagnosis (brain tumor only)
   */
  getDiagnosisSegmentationUrl(diagnosis: MedicalDiagnosis): string | null {
    // Since we now use Cloudinary URLs directly, just return the segmentation_url field
    return diagnosis.segmentation_url || null;
  }

  /**
   * Delete a diagnosis of any type
   */
  async deleteDiagnosis(diagnosis: MedicalDiagnosis): Promise<{ message: string }> {
    if (diagnosis.diagnosis_type === 'brain_tumor') {
      return diagnosisService.deleteDiagnosis(diagnosis.id);
    } else if (diagnosis.diagnosis_type === 'stroke') {
      return strokeService.deleteStrokeDiagnosis(diagnosis.id);
    } else if (diagnosis.diagnosis_type === 'breast_cancer') {
      return breastCancerService.deleteBreastCancerDiagnosis(diagnosis.id);
    }
    
    throw new Error('Unknown diagnosis type');
  }

  /**
   * Update diagnosis notes
   */
  async updateDiagnosisNotes(diagnosis: MedicalDiagnosis, notes: string): Promise<MedicalDiagnosis> {
    if (diagnosis.diagnosis_type === 'brain_tumor') {
      const updated = await diagnosisService.updateDiagnosis(diagnosis.id, { notes });
      return { ...updated, analysis_type: undefined };
    } else if (diagnosis.diagnosis_type === 'stroke') {
      const updated = await strokeService.updateStrokeDiagnosis(diagnosis.id, { notes });
      return { ...updated, analysis_type: undefined, segmentation_url: undefined };
    } else if (diagnosis.diagnosis_type === 'breast_cancer') {
      const updated = await breastCancerService.updateBreastCancerDiagnosis(diagnosis.id, { notes });
      return { ...updated, segmentation_url: undefined };
    }
    
    throw new Error('Unknown diagnosis type');
  }

  /**
   * Get analysis types for UI selection
   */
  getAnalysisTypes(): { value: MedicalAnalysisType; label: string; description: string }[] {
    return [
      {
        value: 'stroke',
        label: 'Stroke Analysis',
        description: 'MRI brain scan analysis for stroke detection and classification'
      },
      {
        value: 'brain_tumor',
        label: 'Brain Tumor Analysis',
        description: 'MRI brain scan analysis for tumor detection and classification'
      },
      {
        value: 'breast_cancer',
        label: 'Breast Cancer Analysis', 
        description: 'Mammography and tissue analysis for breast cancer detection'
      }
    ];
  }

  /**
   * Get breast cancer analysis sub-types
   */
  getBreastCancerAnalysisTypes(): { value: BreastCancerAnalysisType; label: string; description: string }[] {
    return [
      {
        value: BreastCancerAnalysisType.BIRADS,
        label: 'BI-RADS Classification',
        description: 'Mammography imaging analysis using BI-RADS system'
      },
      {
        value: BreastCancerAnalysisType.PATHOLOGICAL,
        label: 'Pathological Analysis',
        description: 'Histological tissue analysis for cancer detection'
      },
      {
        value: BreastCancerAnalysisType.BOTH,
        label: 'Comprehensive Analysis',
        description: 'Both BI-RADS and pathological analysis'
      }
    ];
  }
}

// Export singleton instance
export const medicalService = MedicalService.getInstance();
export default medicalService;