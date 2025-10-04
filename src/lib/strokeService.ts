import { APIClient } from './apiClient';
import {
  StrokeDiagnosisResponse,
  StrokeDiagnosisListResponse,
  StrokeDiagnosisUpdate
} from '../types';

class StrokeService extends APIClient {
  private static instance: StrokeService;

  public static getInstance(): StrokeService {
    if (!StrokeService.instance) {
      StrokeService.instance = new StrokeService();
    }
    return StrokeService.instance;
  }

  /**
   * Upload an MRI image for stroke diagnosis
   */
  async diagnoseStroke(file: File, notes?: string): Promise<StrokeDiagnosisResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (notes) {
      formData.append('notes', notes);
    }

    return this.post<StrokeDiagnosisResponse>('/stroke/diagnose', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Get all stroke diagnosis results for the current user
   */
  async getStrokeDiagnoses(skip: number = 0, limit: number = 100): Promise<StrokeDiagnosisListResponse> {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });

    return this.get<StrokeDiagnosisListResponse>(`/stroke/?${params}`);
  }

  /**
   * Get a specific stroke diagnosis result by ID
   */
  async getStrokeDiagnosis(diagnosisId: number): Promise<StrokeDiagnosisResponse> {
    return this.get<StrokeDiagnosisResponse>(`/stroke/${diagnosisId}`);
  }

  /**
   * Update stroke diagnosis notes
   */
  async updateStrokeDiagnosis(diagnosisId: number, update: StrokeDiagnosisUpdate): Promise<StrokeDiagnosisResponse> {
    return this.patch<StrokeDiagnosisResponse>(`/stroke/${diagnosisId}`, update);
  }

  /**
   * Delete a stroke diagnosis result
   */
  async deleteStrokeDiagnosis(diagnosisId: number): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`/stroke/${diagnosisId}`);
  }

  /**
   * Format prediction class for display
   */
  formatStrokePredictionClass(predictedClass: string): string {
    switch (predictedClass.toLowerCase()) {
      case 'hemorrhagic_stroke':
        return 'Hemorrhagic Stroke';
      case 'ischemic_stroke':
        return 'Ischemic Stroke';
      case 'no_stroke':
        return 'No Stroke Detected';
      default:
        return predictedClass;
    }
  }

  /**
   * Get stroke description
   */
  getStrokeDescription(predictedClass: string): string {
    switch (predictedClass.toLowerCase()) {
      case 'hemorrhagic_stroke':
        return 'Bleeding in the brain caused by a ruptured blood vessel';
      case 'ischemic_stroke':
        return 'Blood clot blocking blood flow to the brain';
      case 'no_stroke':
        return 'No signs of stroke detected in the scan';
      default:
        return '';
    }
  }

  /**
   * Get severity level based on prediction and confidence
   */
  getSeverityLevel(predictedClass: string, confidence: number): 'normal' | 'warning' | 'critical' {
    if (predictedClass.toLowerCase() === 'no_stroke') {
      return 'normal';
    }
    
    // Both hemorrhagic and ischemic strokes are serious
    if (confidence >= 0.7) {
      return 'critical';
    } else if (confidence >= 0.5) {
      return 'warning';
    }
    
    return 'normal';
  }

  /**
   * Get severity color class
   */
  getSeverityColorClass(severity: 'normal' | 'warning' | 'critical'): string {
    switch (severity) {
      case 'normal':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-orange-600 bg-orange-50';
      case 'critical':
        return 'text-red-600 bg-red-50';
    }
  }

  /**
   * Get recommendations based on stroke type
   */
  getRecommendations(predictedClass: string): string[] {
    switch (predictedClass.toLowerCase()) {
      case 'hemorrhagic_stroke':
        return [
          'Immediate emergency medical attention required',
          'Control blood pressure',
          'May require surgical intervention',
          'Close monitoring in intensive care'
        ];
      case 'ischemic_stroke':
        return [
          'Immediate emergency medical attention required',
          'Time-critical treatment (thrombolysis) within 4.5 hours',
          'Consider mechanical thrombectomy if applicable',
          'Start antiplatelet therapy as soon as possible'
        ];
      case 'no_stroke':
        return [
          'Continue regular health check-ups',
          'Maintain healthy lifestyle',
          'Monitor blood pressure regularly',
          'Consult physician if symptoms develop'
        ];
      default:
        return ['Consult with a medical professional for interpretation'];
    }
  }

  /**
   * Format confidence score as percentage
   */
  formatConfidence(confidence: number): string {
    return `${(confidence * 100).toFixed(1)}%`;
  }
}

// Export singleton instance
export const strokeService = StrokeService.getInstance();
export default strokeService;
