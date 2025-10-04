// Healthcare Chatbot Types

// Healthcare Chatbot Types

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone_number?: string;
  is_active: boolean;
  is_verified: boolean;
  gdpr_consent: boolean;
  gdpr_consent_date?: string;
  marketing_consent: boolean;
  marketing_consent_date?: string;
  // Profile settings
  role?: string;
  institution?: string;
  // Preferences
  dark_mode: boolean;
  interface_scale: string;
  default_analysis_model: string;
  // Notification settings
  email_notifications: boolean;
  push_notifications: boolean;
  analysis_notifications: boolean;
  report_notifications: boolean;
  // Privacy settings
  data_retention_period: string;
  anonymous_analytics: boolean;
  data_sharing: boolean;
  created_at: string;
  updated_at: string;
}

// Authentication Types
export interface UserCreate {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  gdpr_consent: boolean;
  marketing_consent?: boolean;
}

export interface UserLogin {
  username_or_email: string;
  password: string;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface PasswordReset {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface ChangePassword {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface UserUpdate {
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  phone_number?: string;
  is_active?: boolean;
}

// Account deletion types
export interface AccountDeletion {
  password: string;
  confirm_deletion: boolean;
}

// Settings Types
export interface UserSettings {
  // Profile settings
  role?: string;
  institution?: string;
  // Preferences
  dark_mode: boolean;
  interface_scale: string;
  default_analysis_model: string;
  // Notification settings
  email_notifications: boolean;
  push_notifications: boolean;
  analysis_notifications: boolean;
  report_notifications: boolean;
  // Privacy settings
  data_retention_period: string;
  anonymous_analytics: boolean;
  data_sharing: boolean;
}

export interface UserSettingsUpdate {
  // Profile settings
  role?: string;
  institution?: string;
  // Preferences
  dark_mode?: boolean;
  interface_scale?: string;
  default_analysis_model?: string;
  // Notification settings
  email_notifications?: boolean;
  push_notifications?: boolean;
  analysis_notifications?: boolean;
  report_notifications?: boolean;
  // Privacy settings
  data_retention_period?: string;
  anonymous_analytics?: boolean;
  data_sharing?: boolean;
}

export interface MedicalImage {
  id: string;
  filename: string;
  url: string;
  type: 'xray' | 'ct' | 'mri' | 'ultrasound' | 'dicom';
  uploadedAt: Date;
  metadata: {
    width: number;
    height: number;
    size: number;
    modality?: string;
    bodyPart?: string;
    studyDate?: string;
    patientId?: string;
  };
  annotations?: ImageAnnotation[];
}

export interface ImageAnnotation {
  id: string;
  type: 'rectangle' | 'circle' | 'arrow' | 'text';
  coordinates: {
    x: number;
    y: number;
    width?: number;
    height?: number;
    radius?: number;
  };
  label: string;
  confidence?: number;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  images?: MedicalImage[];
  timestamp: Date;
  status: 'sending' | 'sent' | 'processing' | 'completed' | 'error';
  metadata?: {
    confidence?: number;
    analysisType?: string;
    processingTime?: number;
    annotations?: ImageAnnotation[];
    findings?: DiagnosticFinding[];
  };
}

export interface DiagnosticFinding {
  id: string;
  category: string;
  finding: string;
  confidence: number;
  severity: 'normal' | 'abnormal' | 'critical';
  location?: string;
  recommendations?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  patientId?: string;
  studyType?: string;
  status: 'active' | 'archived' | 'completed';
}

export interface AnalysisReport {
  id: string;
  sessionId: string;
  patientId?: string;
  title: string;
  summary: string;
  findings: DiagnosticFinding[];
  recommendations: string[];
  images: MedicalImage[];
  generatedAt: Date;
  reportType: 'xray' | 'ct' | 'mri' | 'comprehensive';
  status: 'draft' | 'final' | 'approved';
  approvedBy?: string;
}

export interface DashboardStats {
  totalAnalyses: number;
  pendingReviews: number;
  criticalFindings: number;
  systemHealth: 'excellent' | 'good' | 'fair' | 'poor';
  recentActivity: ActivityItem[];
  weeklyStats: {
    day: string;
    analyses: number;
    findings: number;
  }[];
}

export interface ActivityItem {
  id: string;
  type: 'analysis' | 'report' | 'finding' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    criticalFindings: boolean;
    reportComplete: boolean;
  };
  analysis: {
    defaultConfidenceThreshold: number;
    autoAnnotations: boolean;
    preferredModels: string[];
  };
  interface: {
    compactMode: boolean;
    showTutorials: boolean;
    defaultReportTemplate: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  timestamp: Date;
}

export interface FileUploadProgress {
  id: string;
  filename: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

// Diagnosis Types
export interface DiagnosisRequest {
  notes?: string;
}

export interface DiagnosisResponse {
  id: number;
  predicted_class: string;
  confidence_score: number;
  diagnosis_type: string;
  image_url: string;
  segmentation_url?: string;
  notes?: string;
  created_at: string;
}

export interface DiagnosisListResponse {
  results: DiagnosisResponse[];
  total: number;
  page: number;
  size: number;
}

export interface DiagnosisUpdate {
  notes?: string;
}

// Breast Cancer Analysis Types
export enum BreastCancerAnalysisType {
  BIRADS = 'birads',
  PATHOLOGICAL = 'pathological', 
  BOTH = 'both'
}

export interface BiRadsResult {
  predicted_class: string;
  confidence_score: number;
  all_probabilities: { [key: string]: number };
}

export interface PathologicalResult {
  predicted_class: string;
  confidence_score: number;
  all_probabilities: { [key: string]: number };
}

export interface BreastCancerDiagnosisRequest {
  analysis_type?: BreastCancerAnalysisType;
  notes?: string;
}

export interface BreastCancerDiagnosisResponse {
  id: number;
  diagnosis_type: string;
  analysis_type: string;
  image_url: string;
  notes?: string;
  created_at: string;
  predicted_class: string;
  confidence_score: number;
  birads_result?: BiRadsResult;
  pathological_result?: PathologicalResult;
}

export interface BreastCancerDiagnosisListResponse {
  results: BreastCancerDiagnosisResponse[];
  total: number;
  page: number;
  size: number;
}

export interface BreastCancerDiagnosisUpdate {
  notes?: string;
}

// Stroke Analysis Types
export interface StrokeDiagnosisRequest {
  notes?: string;
}

export interface StrokeDiagnosisResponse {
  id: number;
  predicted_class: string;
  confidence_score: number;
  all_probabilities: { [key: string]: number };
  diagnosis_type: string;
  image_url: string;
  notes?: string;
  created_at: string;
}

export interface StrokeDiagnosisListResponse {
  results: StrokeDiagnosisResponse[];
  total: number;
  page: number;
  size: number;
}

export interface StrokeDiagnosisUpdate {
  notes?: string;
}

// Analysis Type Union for all medical analyses
export type MedicalAnalysisType = 'brain_tumor' | 'breast_cancer' | 'stroke';

export interface MedicalDiagnosis {
  id: number;
  diagnosis_type: string;
  analysis_type?: string;
  predicted_class: string;
  confidence_score: number;
  image_url: string;
  segmentation_url?: string;
  notes?: string;
  created_at: string;
  birads_result?: BiRadsResult;
  pathological_result?: PathologicalResult;
}