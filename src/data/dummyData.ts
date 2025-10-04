import { 
  User, 
  ChatSession, 
  ChatMessage, 
  MedicalImage, 
  DashboardStats,
  DiagnosticFinding,
  ImageAnnotation,
  ActivityItem 
} from '../types';

// Dummy Users
export const dummyUsers: User[] = [
  {
    id: '1',
    email: 'dr.smith@hospital.com',
    name: 'Dr. Sarah Smith',
    role: 'radiologist',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date(),
  },
  {
    id: '2',
    email: 'dr.johnson@clinic.com',
    name: 'Dr. Michael Johnson',
    role: 'doctor',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date(Date.now() - 3600000),
  }
];

// Generate medical image placeholders
export const generateMedicalImage = (type: 'xray' | 'ct' | 'mri' | 'ultrasound', bodyPart: string): MedicalImage => ({
  id: Math.random().toString(36).substr(2, 9),
  filename: `${type}_${bodyPart}_${Date.now()}.jpg`,
  url: `https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop`, // Medical imaging placeholder
  type,
  uploadedAt: new Date(),
  metadata: {
    width: 512,
    height: 512,
    size: 1024000,
    modality: type.toUpperCase(),
    bodyPart,
    studyDate: new Date().toISOString().split('T')[0],
    patientId: `P${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
  },
  annotations: []
});

// Dummy Medical Images
export const dummyMedicalImages: MedicalImage[] = [
  generateMedicalImage('xray', 'chest'),
  generateMedicalImage('xray', 'knee'),
  generateMedicalImage('ct', 'brain'),
  generateMedicalImage('mri', 'spine'),
  generateMedicalImage('ultrasound', 'abdomen'),
];

// Dummy Annotations
export const dummyAnnotations: ImageAnnotation[] = [
  {
    id: '1',
    type: 'rectangle',
    coordinates: { x: 150, y: 200, width: 80, height: 60 },
    label: 'Possible pneumonia',
    confidence: 0.87,
    severity: 'medium'
  },
  {
    id: '2',
    type: 'circle',
    coordinates: { x: 300, y: 180, radius: 25 },
    label: 'Suspicious nodule',
    confidence: 0.92,
    severity: 'high'
  }
];

export const analysisHistory = [
  {
    id: 'ANA-001',
    patientName: 'John Doe',
    diagnosis: 'Normal chest X-ray',
    imageType: 'Chest X-Ray',
    date: '2024-01-15',
    status: 'completed',
    confidence: 94
  },
  {
    id: 'ANA-002',
    patientName: 'Jane Smith',
    diagnosis: 'Pneumonia detected',
    imageType: 'Chest X-Ray',
    date: '2024-01-14',
    status: 'reviewing',
    confidence: 87
  }
];

// Dummy Diagnostic Findings
export const dummyFindings: DiagnosticFinding[] = [
  {
    id: '1',
    category: 'Pulmonary',
    finding: 'Bilateral lower lobe opacities consistent with pneumonia',
    confidence: 0.89,
    severity: 'abnormal',
    location: 'Lower lobes bilaterally',
    recommendations: [
      'Follow-up chest X-ray in 48-72 hours',
      'Consider antibiotic therapy',
      'Monitor oxygen saturation'
    ]
  },
  {
    id: '2',
    category: 'Cardiac',
    finding: 'Normal cardiac silhouette and mediastinal contours',
    confidence: 0.95,
    severity: 'normal',
    location: 'Mediastinum',
    recommendations: ['No immediate cardiac concerns']
  },
  {
    id: '3',
    category: 'Skeletal',
    finding: 'No acute osseous abnormalities detected',
    confidence: 0.93,
    severity: 'normal',
    location: 'Visible skeletal structures',
    recommendations: ['Continue routine monitoring']
  }
];

// Dummy Chat Messages
export const dummyChatMessages: ChatMessage[] = [
  {
    id: '1',
    type: 'user',
    content: 'Please analyze this chest X-ray for any signs of pneumonia or other abnormalities.',
    images: [dummyMedicalImages[0]],
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    status: 'completed'
  },
  {
    id: '2',
    type: 'ai',
    content: `Based on my analysis of the chest X-ray, I've identified several key findings:

## Primary Findings
- **Bilateral lower lobe opacities** consistent with pneumonia (confidence: 89%)
- **Normal cardiac silhouette** and mediastinal contours (confidence: 95%)
- **No acute osseous abnormalities** detected (confidence: 93%)

## Recommendations
1. Follow-up chest X-ray in 48-72 hours
2. Consider antibiotic therapy based on clinical presentation
3. Monitor oxygen saturation closely

The bilateral lower lobe opacities are the most significant finding and warrant immediate clinical attention.`,
    timestamp: new Date(Date.now() - 1740000), // 29 minutes ago
    status: 'completed',
    metadata: {
      confidence: 0.89,
      analysisType: 'chest_xray_analysis',
      processingTime: 2.3,
      annotations: dummyAnnotations,
      findings: dummyFindings
    }
  },
  {
    id: '3',
    type: 'user',
    content: 'Can you provide more details about the bilateral opacities? What specific patterns are you seeing?',
    timestamp: new Date(Date.now() - 900000), // 15 minutes ago
    status: 'completed'
  },
  {
    id: '4',
    type: 'ai',
    content: `Looking more closely at the bilateral lower lobe opacities:

## Pattern Analysis
- **Distribution**: Predominantly basal and peripheral
- **Density**: Ground-glass appearance with some consolidation
- **Symmetry**: Bilateral but slightly more prominent on the right
- **Associated findings**: No pleural effusion visible

## Differential Considerations
1. **Bacterial pneumonia** (most likely given pattern)
2. **Atypical pneumonia** (viral or mycoplasma)
3. **Pulmonary edema** (less likely given distribution)

The peripheral distribution and ground-glass opacity pattern strongly suggest an infectious etiology rather than cardiac or other causes.`,
    timestamp: new Date(Date.now() - 840000), // 14 minutes ago
    status: 'completed',
    metadata: {
      confidence: 0.91,
      analysisType: 'detailed_pattern_analysis',
      processingTime: 1.8
    }
  }
];

// Dummy Chat Sessions
export const dummyChatSessions: ChatSession[] = [
  {
    id: '1',
    title: 'Chest X-ray Analysis - Pneumonia Case',
    messages: dummyChatMessages,
    createdAt: new Date(Date.now() - 1800000),
    updatedAt: new Date(Date.now() - 840000),
    patientId: 'P123456',
    studyType: 'chest_xray',
    status: 'active'
  },
  {
    id: '2',
    title: 'Brain CT - Trauma Assessment',
    messages: [],
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000),
    patientId: 'P789012',
    studyType: 'brain_ct',
    status: 'completed'
  },
  {
    id: '3',
    title: 'Knee X-ray - Sports Injury',
    messages: [],
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    updatedAt: new Date(Date.now() - 172800000),
    patientId: 'P345678',
    studyType: 'knee_xray',
    status: 'archived'
  }
];

// Dummy Activity Items
export const dummyActivityItems: ActivityItem[] = [
  {
    id: '1',
    type: 'analysis',
    title: 'Chest X-ray Analysis Completed',
    description: 'AI detected bilateral pneumonia with high confidence',
    timestamp: new Date(Date.now() - 900000),
    severity: 'high'
  },
  {
    id: '2',
    type: 'finding',
    title: 'Critical Finding Detected',
    description: 'Possible pulmonary embolism in CT scan requires immediate attention',
    timestamp: new Date(Date.now() - 3600000),
    severity: 'critical'
  },
  {
    id: '3',
    type: 'report',
    title: 'Radiology Report Generated',
    description: 'Comprehensive report for brain MRI study',
    timestamp: new Date(Date.now() - 7200000),
    severity: 'medium'
  },
  {
    id: '4',
    type: 'system',
    title: 'System Update',
    description: 'AI model updated to version 2.1.3',
    timestamp: new Date(Date.now() - 10800000),
    severity: 'low'
  }
];

// Dummy Dashboard Stats
export const dummyDashboardStats: DashboardStats = {
  totalAnalyses: 1247,
  pendingReviews: 23,
  criticalFindings: 5,
  systemHealth: 'excellent',
  recentActivity: dummyActivityItems,
  weeklyStats: [
    { day: 'Monday', analyses: 45, findings: 12 },
    { day: 'Tuesday', analyses: 52, findings: 15 },
    { day: 'Wednesday', analyses: 38, findings: 8 },
    { day: 'Thursday', analyses: 61, findings: 18 },
    { day: 'Friday', analyses: 47, findings: 11 },
    { day: 'Saturday', analyses: 23, findings: 6 },
    { day: 'Sunday', analyses: 19, findings: 4 }
  ]
};