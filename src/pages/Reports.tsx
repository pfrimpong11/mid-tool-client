import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Download,
  Eye,
  Share,
  Calendar,
  Clock,
  User,
  Building
} from 'lucide-react';

interface Report {
  id: string;
  title: string;
  type: string;
  patient: string;
  doctor: string;
  date: string;
  status: 'completed' | 'draft' | 'pending';
  institution: string;
}

export const Reports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const reports: Report[] = [
    {
      id: 'RPT-001',
      title: 'Chest X-Ray Analysis Report',
      type: 'X-Ray',
      patient: 'John Doe',
      doctor: 'Dr. Sarah Johnson',
      date: '2024-01-15',
      status: 'completed',
      institution: 'General Hospital'
    },
    {
      id: 'RPT-002',
      title: 'Brain MRI Comprehensive Report',
      type: 'MRI',
      patient: 'Jane Smith',
      doctor: 'Dr. Michael Chen',
      date: '2024-01-14',
      status: 'draft',
      institution: 'Neurological Institute'
    },
    {
      id: 'RPT-003',
      title: 'Abdominal CT Scan Report',
      type: 'CT',
      patient: 'Robert Wilson',
      doctor: 'Dr. Sarah Johnson',
      date: '2024-01-13',
      status: 'pending',
      institution: 'General Hospital'
    },
    {
      id: 'RPT-004',
      title: 'Cardiac Echo Analysis',
      type: 'Ultrasound',
      patient: 'Maria Garcia',
      doctor: 'Dr. Emily Rodriguez',
      date: '2024-01-12',
      status: 'completed',
      institution: 'Cardiac Center'
    }
  ];

  const reportTemplates = [
    {
      title: 'Chest X-Ray Report',
      description: 'Standard template for chest radiograph analysis',
      type: 'X-Ray'
    },
    {
      title: 'Brain MRI Report',
      description: 'Comprehensive brain MRI analysis template',
      type: 'MRI'
    },
    {
      title: 'CT Scan Report',
      description: 'General CT scan analysis template',
      type: 'CT'
    },
    {
      title: 'Ultrasound Report',
      description: 'Standard ultrasound examination template',
      type: 'Ultrasound'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'status-success';
      case 'draft': return 'bg-[hsl(var(--warning-light))] text-[hsl(var(--warning))]';
      case 'pending': return 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]';
      default: return 'status-error';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && report.status === activeTab;
  });

  return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-[var(--gradient-medical)] flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="medical-heading text-2xl">Medical Reports</h1>
              <p className="clinical-text">Generate and manage medical analysis reports</p>
            </div>
          </div>
          <Button className="clinical-button flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Report
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="medical-card">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="medical-heading text-2xl font-bold text-primary">24</p>
                <p className="clinical-text text-sm">Total Reports</p>
              </div>
            </CardContent>
          </Card>
          <Card className="medical-card">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="medical-heading text-2xl font-bold text-[hsl(var(--success))]">18</p>
                <p className="clinical-text text-sm">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card className="medical-card">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="medical-heading text-2xl font-bold text-[hsl(var(--warning))]">4</p>
                <p className="clinical-text text-sm">Drafts</p>
              </div>
            </CardContent>
          </Card>
          <Card className="medical-card">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="medical-heading text-2xl font-bold text-[hsl(var(--accent))]">2</p>
                <p className="clinical-text text-sm">Pending</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tabs and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Reports</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>

            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  className="medical-input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          {/* Reports Content */}
          <TabsContent value={activeTab} className="space-y-6">
            {/* Reports List */}
            <div className="grid gap-4">
              {filteredReports.map((report) => (
                <Card key={report.id} className="medical-card hover:shadow-[var(--shadow-medical)] transition-[var(--transition-medical)]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-lg bg-[var(--gradient-clinical)] flex items-center justify-center">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="medical-heading font-medium">{report.title}</h3>
                            <Badge className={getStatusColor(report.status)}>
                              {report.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 clinical-text text-sm">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{report.patient}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{report.date}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Building className="h-3 w-3" />
                              <span>{report.institution}</span>
                            </div>
                          </div>
                          <p className="clinical-text text-xs">
                            Report ID: {report.id} • Generated by {report.doctor}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredReports.length === 0 && (
              <Card className="medical-card">
                <CardContent className="text-center p-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="medical-heading text-lg mb-2">No reports found</h3>
                  <p className="clinical-text">
                    {searchTerm ? 'Try adjusting your search criteria' : 'Create your first medical report'}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Report Templates */}
        <Card className="medical-card">
          <CardHeader>
            <CardTitle>Report Templates</CardTitle>
            <CardDescription>
              Quick start templates for common report types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reportTemplates.map((template, index) => (
                <div 
                  key={index}
                  className="p-4 border border-border rounded-lg hover:bg-[hsl(var(--muted))] transition-[var(--transition-medical)] cursor-pointer"
                >
                  <div className="text-center space-y-2">
                    <FileText className="h-8 w-8 text-primary mx-auto" />
                    <div>
                      <h4 className="medical-heading font-medium text-sm">{template.title}</h4>
                      <p className="clinical-text text-xs">{template.description}</p>
                      <Badge variant="outline" className="mt-2">{template.type}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  );
};