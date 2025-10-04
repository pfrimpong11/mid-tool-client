import { APIClient } from './apiClient';
import {
  BreastCancerDiagnosisResponse,
  BreastCancerDiagnosisListResponse,
  BreastCancerDiagnosisUpdate,
  BreastCancerAnalysisType
} from '../types';

class BreastCancerService extends APIClient {
  private static instance: BreastCancerService;

  public static getInstance(): BreastCancerService {
    if (!BreastCancerService.instance) {
      BreastCancerService.instance = new BreastCancerService();
    }
    return BreastCancerService.instance;
  }

  /**
   * Upload a medical image for breast cancer diagnosis
   */
  async diagnoseBreastCancer(
    file: File, 
    analysisType?: BreastCancerAnalysisType, 
    notes?: string
  ): Promise<BreastCancerDiagnosisResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (analysisType) {
      formData.append('analysis_type', analysisType);
    }
    
    if (notes) {
      formData.append('notes', notes);
    }

    return this.post<BreastCancerDiagnosisResponse>('/breast-cancer/diagnose', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Get all breast cancer diagnosis results for the current user
   */
  async getBreastCancerDiagnoses(skip: number = 0, limit: number = 100): Promise<BreastCancerDiagnosisListResponse> {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });

    return this.get<BreastCancerDiagnosisListResponse>(`/breast-cancer/?${params}`);
  }

  /**
   * Get a specific breast cancer diagnosis result by ID
   */
  async getBreastCancerDiagnosis(diagnosisId: number): Promise<BreastCancerDiagnosisResponse> {
    return this.get<BreastCancerDiagnosisResponse>(`/breast-cancer/${diagnosisId}`);
  }

  /**
   * Update breast cancer diagnosis notes
   */
  async updateBreastCancerDiagnosis(diagnosisId: number, update: BreastCancerDiagnosisUpdate): Promise<BreastCancerDiagnosisResponse> {
    return this.patch<BreastCancerDiagnosisResponse>(`/breast-cancer/${diagnosisId}`, update);
  }

  /**
   * Delete a breast cancer diagnosis result
   */
  async deleteBreastCancerDiagnosis(diagnosisId: number): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`/breast-cancer/${diagnosisId}`);
  }

  // Note: Image URLs are now direct Cloudinary URLs
  // These methods are no longer needed as images are served directly from Cloudinary
  // The image_url field in BreastCancerDiagnosisResponse contains the direct URL

  /**
   * Format prediction class for display
   */
  formatBreastCancerPredictionClass(predictedClass: string, analysisType?: string): string {
    // Handle BI-RADS classifications
    if (analysisType === 'birads' || predictedClass.includes('BI-RADS')) {
      switch (predictedClass) {
        case 'BI-RADS 1 (Negative)':
          return 'BI-RADS 1: Negative';
        case 'BI-RADS 2 (Benign)':
          return 'BI-RADS 2: Benign Finding';
        case 'BI-RADS 3 (Probably Benign)':
          return 'BI-RADS 3: Probably Benign';
        case 'BI-RADS 4 (Suspicious)':
          return 'BI-RADS 4: Suspicious';
        case 'BI-RADS 5 (Highly Suspicious)':
          return 'BI-RADS 5: Highly Suspicious';
        default:
          return predictedClass;
      }
    }

    // Handle pathological classifications
    switch (predictedClass.toLowerCase()) {
      case 'benign':
        return 'Benign Tissue';
      case 'malignant':
        return 'Malignant Tissue';
      case 'normal':
        return 'Normal Tissue';
      default:
        return predictedClass;
    }
  }

  /**
   * Get severity level based on prediction and confidence
   */
  getBreastCancerSeverityLevel(predictedClass: string, confidence: number, analysisType?: string): 'normal' | 'warning' | 'critical' {
    // Handle BI-RADS classifications
    if (analysisType === 'birads' || predictedClass.includes('BI-RADS')) {
      if (predictedClass.includes('BI-RADS 1') || predictedClass.includes('BI-RADS 2')) {
        return 'normal';
      } else if (predictedClass.includes('BI-RADS 3')) {
        return 'warning';
      } else if (predictedClass.includes('BI-RADS 4') || predictedClass.includes('BI-RADS 5')) {
        return 'critical';
      }
    }

    // Handle pathological classifications
    if (predictedClass.toLowerCase() === 'normal' || predictedClass.toLowerCase() === 'benign') {
      return 'normal';
    }
    
    if (predictedClass.toLowerCase() === 'malignant') {
      return 'critical';
    }
    
    // Fallback to confidence-based assessment
    if (confidence >= 0.8) {
      return 'critical';
    } else if (confidence >= 0.6) {
      return 'warning';
    }
    
    return 'normal';
  }

  /**
   * Get confidence level description
   */
  getConfidenceLevel(confidence: number): 'low' | 'medium' | 'high' {
    if (confidence >= 0.8) return 'high';
    if (confidence >= 0.6) return 'medium';
    return 'low';
  }

  /**
   * Get analysis type display name
   */
  getAnalysisTypeDisplayName(analysisType: string): string {
    switch (analysisType) {
      case 'birads':
        return 'BI-RADS Classification';
      case 'pathological':
        return 'Pathological Analysis';
      case 'both':
        return 'Comprehensive Analysis';
      default:
        return 'Breast Cancer Analysis';
    }
  }

  /**
   * Get analysis type description
   */
  getAnalysisTypeDescription(analysisType: string): string {
    switch (analysisType) {
      case 'birads':
        return 'Mammography imaging analysis using BI-RADS classification system';
      case 'pathological':
        return 'Histological tissue analysis for cancer detection';
      case 'both':
        return 'Combined BI-RADS and pathological analysis';
      default:
        return 'Advanced breast cancer diagnostic analysis';
    }
  }

  /**
   * Determine if result shows concerning findings
   */
  hasConcerningFindings(diagnosis: BreastCancerDiagnosisResponse): boolean {
    const severity = this.getBreastCancerSeverityLevel(
      diagnosis.predicted_class, 
      diagnosis.confidence_score, 
      diagnosis.analysis_type
    );
    
    return severity === 'critical' || severity === 'warning';
  }

  /**
   * Get recommendations based on diagnosis result
   */
  getRecommendations(diagnosis: BreastCancerDiagnosisResponse): string[] {
    const recommendations: string[] = [];
    const severity = this.getBreastCancerSeverityLevel(
      diagnosis.predicted_class, 
      diagnosis.confidence_score, 
      diagnosis.analysis_type
    );

    if (severity === 'critical') {
      recommendations.push('Immediate consultation with oncologist recommended');
      recommendations.push('Consider additional imaging or biopsy');
      recommendations.push('Follow-up within 1-2 weeks');
    } else if (severity === 'warning') {
      recommendations.push('Follow-up with healthcare provider');
      recommendations.push('Consider repeat imaging in 6 months');
      recommendations.push('Monitor for any changes');
    } else {
      recommendations.push('Continue routine screening');
      recommendations.push('Next screening in 1-2 years as recommended');
    }

    return recommendations;
  }
}

// Export singleton instance
export const breastCancerService = BreastCancerService.getInstance();
export default breastCancerService;