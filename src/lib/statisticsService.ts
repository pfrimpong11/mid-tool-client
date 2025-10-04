import { APIClient } from './apiClient';

// Statistics Types
export interface DashboardStats {
  total_diagnoses: number;
  brain_tumor_diagnoses: number;
  breast_cancer_diagnoses: number;
  stroke_diagnoses: number;
  critical_findings: number;
  normal_findings: number;
  warning_findings: number;
  accuracy_rate: number;
}

export interface TumorTypeDistribution {
  name: string;
  count: number;
  percentage: number;
}

export interface WeeklyAnalytics {
  day: string;
  date: string;
  total_analyses: number;
  average_confidence: number;
}

export interface MonthlyTrends {
  month: string;
  year: number;
  total_diagnoses: number;
  critical_findings: number;
  normal_findings: number;
  average_confidence: number;
}

export interface RecentActivity {
  id: number;
  diagnosis_type: string;
  predicted_class: string;
  confidence_score: number;
  image_url?: string;
  segmentation_url?: string;
  notes?: string;
  created_at: string;
  severity: string;
}

export interface StatisticsResponse {
  dashboard_stats: DashboardStats;
  tumor_distribution: TumorTypeDistribution[];
  weekly_analytics: WeeklyAnalytics[];
  monthly_trends: MonthlyTrends[];
  recent_activity: RecentActivity[];
}

export interface UserStatsSummary {
  user_id: number;
  total_uploads: number;
  first_diagnosis_date: string | null;
  last_diagnosis_date: string | null;
  most_common_diagnosis: string | null;
  average_confidence: number;
  total_brain_tumor_scans: number;
  total_breast_cancer_scans: number;
}

class StatisticsService extends APIClient {
  private static instance: StatisticsService;

  public static getInstance(): StatisticsService {
    if (!StatisticsService.instance) {
      StatisticsService.instance = new StatisticsService();
    }
    return StatisticsService.instance;
  }

  /**
   * Get main dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    return this.get<DashboardStats>('/statistics/dashboard');
  }

  /**
   * Get tumor type distribution
   */
  async getTumorDistribution(): Promise<TumorTypeDistribution[]> {
    return this.get<TumorTypeDistribution[]>('/statistics/tumor-distribution');
  }

  /**
   * Get weekly analytics
   */
  async getWeeklyAnalytics(): Promise<WeeklyAnalytics[]> {
    return this.get<WeeklyAnalytics[]>('/statistics/weekly-analytics');
  }

  /**
   * Get monthly trends
   */
  async getMonthlyTrends(months: number = 6): Promise<MonthlyTrends[]> {
    const params = new URLSearchParams({
      months: months.toString(),
    });
    return this.get<MonthlyTrends[]>(`/statistics/monthly-trends?${params}`);
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(limit: number = 10): Promise<RecentActivity[]> {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });
    return this.get<RecentActivity[]>(`/statistics/recent-activity?${params}`);
  }

  /**
   * Get complete statistics (all data in one call)
   */
  async getCompleteStatistics(): Promise<StatisticsResponse> {
    return this.get<StatisticsResponse>('/statistics/complete');
  }

  /**
   * Get user statistics summary
   */
  async getUserSummary(): Promise<UserStatsSummary> {
    return this.get<UserStatsSummary>('/statistics/user-summary');
  }

  /**
   * Format tumor distribution data for charts
   */
  formatTumorDistributionForChart(distribution: TumorTypeDistribution[]): Array<{
    name: string;
    value: number;
    color: string;
  }> {
    const colorMap: Record<string, string> = {
      'No Tumor': '#10b981',
      'Glioma': '#ef4444',
      'Meningioma': '#f59e0b',
      'Pituitary Tumor': '#8b5cf6'
    };

    return distribution.map(item => ({
      name: item.name,
      value: item.count,
      color: colorMap[item.name] || '#6b7280'
    }));
  }

  /**
   * Format weekly analytics for charts
   */
  formatWeeklyAnalyticsForChart(analytics: WeeklyAnalytics[]): Array<{
    day: string;
    analyses: number;
    accuracy: number;
  }> {
    return analytics.map(item => ({
      day: item.day,
      analyses: item.total_analyses,
      accuracy: Math.round(item.average_confidence * 100) // Convert to percentage
    }));
  }

  /**
   * Format monthly trends for charts
   */
  formatMonthlyTrendsForChart(trends: MonthlyTrends[]): Array<{
    month: string;
    total: number;
    critical: number;
    normal: number;
    confidence: number;
  }> {
    return trends.map(item => ({
      month: `${item.month.substring(0, 3)} ${item.year}`,
      total: item.total_diagnoses,
      critical: item.critical_findings,
      normal: item.normal_findings,
      confidence: Math.round(item.average_confidence * 100)
    }));
  }

  /**
   * Get severity icon name based on severity level
   */
  getSeverityIcon(severity: string): string {
    switch (severity) {
      case 'normal':
        return 'CheckCircle2';
      case 'warning':
        return 'AlertTriangle';
      case 'critical':
        return 'AlertTriangle';
      default:
        return 'Brain';
    }
  }

  /**
   * Get severity color based on severity level
   */
  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'normal':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'critical':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  }

  /**
   * Calculate percentage change between two values
   */
  calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  /**
   * Format confidence score as percentage
   */
  formatConfidenceAsPercentage(confidence: number): string {
    return `${Math.round(confidence * 100)}%`;
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
   * Format diagnosis type for display
   */
  formatDiagnosisType(diagnosisType: string): string {
    switch (diagnosisType) {
      case 'brain_tumor':
        return 'Brain Tumor';
      case 'breast_cancer_birads':
        return 'Breast Cancer (BI-RADS)';
      case 'breast_cancer_pathological':
        return 'Breast Cancer (Pathological)';
      case 'breast_cancer_both':
        return 'Breast Cancer (Combined)';
      default:
        return diagnosisType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  }
}

// Export singleton instance
export const statisticsService = StatisticsService.getInstance();
export default statisticsService;