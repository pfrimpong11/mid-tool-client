import { APIClient } from './apiClient';
import {
  DiagnosisResponse,
  DiagnosisListResponse,
  DiagnosisUpdate,
  ApiResponse
} from '../types';

class DiagnosisService extends APIClient {
  private static instance: DiagnosisService;

  public static getInstance(): DiagnosisService {
    if (!DiagnosisService.instance) {
      DiagnosisService.instance = new DiagnosisService();
    }
    return DiagnosisService.instance;
  }

  /**
   * Upload an MRI image for brain tumor diagnosis
   */
  async diagnoseBrainTumor(file: File, notes?: string): Promise<DiagnosisResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (notes) {
      formData.append('notes', notes);
    }

    return this.post<DiagnosisResponse>('/diagnosis/diagnose', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Get all diagnosis results for the current user
   */
  async getDiagnoses(skip: number = 0, limit: number = 100): Promise<DiagnosisListResponse> {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });

    return this.get<DiagnosisListResponse>(`/diagnosis/?${params}`);
  }

  /**
   * Get a specific diagnosis result by ID
   */
  async getDiagnosis(diagnosisId: number): Promise<DiagnosisResponse> {
    return this.get<DiagnosisResponse>(`/diagnosis/${diagnosisId}`);
  }

  /**
   * Update diagnosis notes
   */
  async updateDiagnosis(diagnosisId: number, update: DiagnosisUpdate): Promise<DiagnosisResponse> {
    return this.patch<DiagnosisResponse>(`/diagnosis/${diagnosisId}`, update);
  }

  /**
   * Delete a diagnosis result
   */
  async deleteDiagnosis(diagnosisId: number): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`/diagnosis/${diagnosisId}`);
  }


  /**
   * Format prediction class for display
   */
  formatPredictionClass(predictedClass: string): string {
    switch (predictedClass.toLowerCase()) {
      case 'glioma':
        return 'Glioma Tumor';
      case 'meningioma':
        return 'Meningioma Tumor';
      case 'notumor':
        return 'No Tumor Detected';
      case 'pituitary':
        return 'Pituitary Tumor';
      default:
        return predictedClass;
    }
  }

  /**
   * Get severity level based on prediction and confidence
   */
  getSeverityLevel(predictedClass: string, confidence: number): 'normal' | 'warning' | 'critical' {
    if (predictedClass.toLowerCase() === 'notumor') {
      return 'normal';
    }
    
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
}

// Export singleton instance
export const diagnosisService = DiagnosisService.getInstance();
export default diagnosisService;