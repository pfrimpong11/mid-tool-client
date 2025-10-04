import React, { useEffect, useState } from 'react';
import { 
  Activity, 
  Brain, 
  Eye, 
  Zap, 
  TrendingUp, 
  Clock, 
  Users, 
  FileImage,
  Plus,
  BarChart3,
  Upload,
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Calendar,
  History,
  Loader2,
  Heart,
  Droplet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { MedicalDiagnosis } from '@/types';
import { medicalService } from '@/lib/medicalService';
import { statisticsService } from '@/lib/statisticsService';
import type { TumorTypeDistribution, WeeklyAnalytics } from '@/lib/statisticsService';
import { EnhancedImageUpload } from '@/components/medical/EnhancedImageUpload';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export const Dashboard: React.FC = () => {
  const [recentDiagnoses, setRecentDiagnoses] = useState<MedicalDiagnosis[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalDiagnoses: 0,
    brainTumorDiagnoses: 0,
    breastCancerDiagnoses: 0,
    strokeDiagnoses: 0,
    criticalFindings: 0,
    normalFindings: 0
  });
  const [tumorTypeDistribution, setTumorTypeDistribution] = useState<Array<{
    name: string;
    value: number;
    color: string;
  }>>([]);
  const [weeklyAnalyses, setWeeklyAnalyses] = useState<WeeklyAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load dashboard stats using the unified medical service (now uses statistics endpoints)
      const stats = await medicalService.getDashboardStats();
      setRecentDiagnoses(stats.recentActivity);
      
      setDashboardStats({
        totalDiagnoses: stats.totalDiagnoses,
        brainTumorDiagnoses: stats.brainTumorDiagnoses,
        breastCancerDiagnoses: stats.breastCancerDiagnoses,
        strokeDiagnoses: stats.strokeDiagnoses || 0,
        criticalFindings: stats.criticalFindings,
        normalFindings: stats.normalFindings
      });

      // Load tumor type distribution from statistics service
      const tumorDistribution = await statisticsService.getTumorDistribution();
      const formattedTumorDistribution = statisticsService.formatTumorDistributionForChart(tumorDistribution);
      setTumorTypeDistribution(formattedTumorDistribution);

      // Load weekly analytics from statistics service
      const weeklyData = await statisticsService.getWeeklyAnalytics();
      setWeeklyAnalyses(weeklyData);
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiagnosisComplete = (diagnosis: MedicalDiagnosis) => {
    // Refresh dashboard data
    loadDashboardData();
  };



  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, HH:mm');
    } catch {
      return dateString;
    }
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

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Medical Image Diagnostics Center
              </h1>
              <p className="text-muted-foreground">AI-powered analysis of medical images for stroke, brain tumor, and breast cancer detection</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
            onClick={() => setShowUpload(!showUpload)}
          >
            <Upload className="mr-2 h-5 w-5" />
            New Analysis
          </Button>
          <Link to="/history">
            <Button variant="outline" size="lg">
              <History className="mr-2 h-5 w-5" />
              View History
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Upload Section */}
      {showUpload && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Upload Medical Image
            </CardTitle>
            <CardDescription>
              Upload medical images for AI-powered analysis. Supported: MRI brain scans, CT scans, and mammography images.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EnhancedImageUpload onDiagnosisComplete={handleDiagnosisComplete} />
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Diagnoses</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : dashboardStats.totalDiagnoses.toLocaleString()}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Brain ({dashboardStats.brainTumorDiagnoses}), Breast ({dashboardStats.breastCancerDiagnoses}), Stroke ({dashboardStats.strokeDiagnoses})
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-500 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Normal Scans</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : dashboardStats.normalFindings}
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  No tumor detected
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-green-500 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/50 dark:to-pink-900/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-600 dark:text-pink-400">Breast Cancer</p>
                <p className="text-3xl font-bold text-pink-900 dark:text-pink-100">
                  {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : dashboardStats.breastCancerDiagnoses}
                </p>
                <p className="text-xs text-pink-700 dark:text-pink-300 mt-1">
                  Mammography analyses
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-pink-500 flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Stroke Analysis</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                  {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : dashboardStats.strokeDiagnoses}
                </p>
                <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                  MRI stroke detection
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-purple-500 flex items-center justify-center">
                <Droplet className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Critical Findings</p>
                <p className="text-3xl font-bold text-red-900 dark:text-red-100">
                  {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : dashboardStats.criticalFindings}
                </p>
                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                  Require immediate attention
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-red-500 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Analysis Trends */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Weekly Analysis Trends
            </CardTitle>
            <CardDescription>
              Weekly brain scan analysis volume and accuracy metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading || weeklyAnalyses.length === 0 ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyAnalyses}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: 'none', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                  <Bar dataKey="total_analyses" fill="#3b82f6" name="Analyses" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="average_confidence" fill="#10b981" name="Avg Confidence %" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Tumor Type Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <FileImage className="h-5 w-5 text-purple-600" />
              Tumor Classification
            </CardTitle>
            <CardDescription>
              Distribution of detected tumor types
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && tumorTypeDistribution.length === 0 ? (
              <div className="flex items-center justify-center h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={tumorTypeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {tumorTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="space-y-2 mt-4">
              {tumorTypeDistribution.map((type, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: type.color }}
                    />
                    <span className="text-muted-foreground">{type.name}</span>
                  </div>
                  <span className="font-medium">{type.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Diagnoses */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Recent Diagnoses
              </CardTitle>
              <CardDescription>
                Latest brain tumor analysis results
              </CardDescription>
            </div>
            <Link to="/history">
              <Button variant="outline" size="sm">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span className="text-muted-foreground">Loading recent diagnoses...</span>
            </div>
          ) : recentDiagnoses.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Diagnoses Yet</h3>
              <p className="text-muted-foreground mb-4">
                Upload your first MRI brain scan to get started with AI-powered tumor detection.
              </p>
              <Button 
                variant="outline"
                onClick={() => setShowUpload(true)}
              >
                Upload MRI Scan
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentDiagnoses.map((diagnosis) => (
                <div key={diagnosis.id} className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
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
                    <div className="flex items-center gap-3">
                      {getSeverityIcon(diagnosis)}
                      <h4 className="font-semibold">
                        {medicalService.formatPredictionClass(diagnosis)}
                      </h4>
                      <Badge 
                        variant={medicalService.getSeverityLevel(diagnosis) === 'normal' ? 'outline' : 'destructive'}
                        className={medicalService.getSeverityLevel(diagnosis) === 'normal' ? 'border-green-500 text-green-600' : ''}
                      >
                        {medicalService.getSeverityLevel(diagnosis)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span>
                        Confidence: <span className={cn("font-medium", getConfidenceColor(diagnosis.confidence_score))}>
                          {(diagnosis.confidence_score * 100).toFixed(1)}%
                        </span>
                      </span>
                      <span>
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {formatDate(diagnosis.created_at)}
                      </span>
                      <span>ID: #{diagnosis.id}</span>
                    </div>

                    {diagnosis.notes && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {diagnosis.notes}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link to={`/history`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

