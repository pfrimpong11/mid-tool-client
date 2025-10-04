import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Brain, 
  Shield, 
  Zap, 
  Eye, 
  BarChart3, 
  Users, 
  CheckCircle, 
  Star,
  ArrowRight,
  Play,
  Stethoscope,
  Target,
  Award,
  Heart,
  Clock,
  Globe,
  Microscope,
  FileText,
  TrendingUp,
  Lock,
  Award as AwardIcon,
  ChevronRight,
  Sparkles,
  Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: Microscope,
    title: 'Stroke Analysis',
    description: 'AI-driven detection and classification of stroke types from brain MRI scans with high accuracy.',
    gradient: 'from-pink-500 to-rose-600',  
    highlight: 'Advanced Imaging'
  },
  {
    icon: Brain,
    title: 'AI-Powered Brain Tumor Detection',
    description: 'Advanced neural networks analyze MRI scans to detect and classify brain tumors with over 97% accuracy.',
    gradient: 'from-blue-500 to-blue-700',
    highlight: 'Brain Tumor Analysis'
  },
  {
    icon: Heart,
    title: 'Breast Cancer Screening',
    description: 'Comprehensive BI-RADS classification and pathological analysis for early breast cancer detection.',
    gradient: 'from-pink-500 to-rose-600',
    highlight: 'Breast Cancer Detection'
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Get detailed diagnostic reports in under 30 seconds with confidence scores and recommendations.',
    gradient: 'from-yellow-500 to-orange-600',
    highlight: '<30s Processing'
  },
  {
    icon: Eye,
    title: 'Advanced Visualization',
    description: 'Interactive medical image viewer with tumor segmentation and detailed anatomical annotations.',
    gradient: 'from-purple-500 to-violet-600',
    highlight: 'Tumor Segmentation'
  },
  {
    icon: BarChart3,
    title: 'Comprehensive Analytics',
    description: 'Track diagnostic trends, accuracy metrics, and patient outcomes with detailed reporting.',
    gradient: 'from-indigo-500 to-blue-600',
    highlight: 'Analytics Dashboard'
  }
];

const benefits = [
  {
    icon: Clock,
    title: 'Save Time',
    description: 'Reduce diagnostic time from hours to seconds',
    stat: '95% faster'
  },
  {
    icon: Target,
    title: 'Improve Accuracy',
    description: 'AI-assisted diagnosis reduces human error',
    stat: '97.2% accuracy'
  },
  {
    icon: Users,
    title: 'Scale Operations',
    description: 'Handle more patients with same resources',
    stat: '300% capacity'
  },
  {
    icon: TrendingUp,
    title: 'Better Outcomes',
    description: 'Early detection improves patient outcomes',
    stat: '40% improvement'
  }
];

const howItWorks = [
  {
    step: '01',
    title: 'Upload Medical Images',
    description: 'Securely upload MRI brain scans or breast imaging studies through our HIPAA-compliant platform.',
    icon: FileText,
    color: 'bg-blue-500'
  },
  {
    step: '02',
    title: 'AI Analysis',
    description: 'Our advanced neural networks analyze the images, detecting anomalies and classifying findings.',
    icon: Microscope,
    color: 'bg-purple-500'
  },
  {
    step: '03',
    title: 'Instant Results',
    description: 'Receive comprehensive diagnostic reports with confidence scores and clinical recommendations.',
    icon: FileText,
    color: 'bg-green-500'
  }
];

const trustedBy = [
  { name: 'Mayo Clinic', type: 'Healthcare System' },
  { name: 'Johns Hopkins', type: 'Medical Center' },
  { name: 'Cleveland Clinic', type: 'Healthcare Provider' },
  { name: 'Massachusetts General', type: 'Hospital Network' },
  { name: 'Stanford Medicine', type: 'Academic Medical Center' },
  { name: 'Kaiser Permanente', type: 'Health Plan' }
];

const testimonials = [
  {
    name: 'Dr. Sarah Chen',
    role: 'Chief Radiologist',
    hospital: 'Mayo Clinic',
    content: 'MID Tool has revolutionized our diagnostic workflow. The AI accuracy is remarkable, and it\'s become an indispensable part of our daily practice.',
    rating: 5,
    avatar: 'SC'
  },
  {
    name: 'Dr. Michael Rodriguez',
    role: 'Emergency Medicine',
    hospital: 'Johns Hopkins',
    content: 'The speed and accuracy of MID Tool\'s analysis has dramatically improved our emergency department\'s efficiency. Critical findings are flagged instantly.',
    rating: 5,
    avatar: 'MR'
  },
  {
    name: 'Dr. Emily Johnson',
    role: 'Diagnostic Imaging',
    hospital: 'Cleveland Clinic',
    content: 'Integration with our PACS system was seamless. The collaborative features have enhanced our team\'s communication and diagnostic confidence.',
    rating: 5,
    avatar: 'EJ'
  }
];

const stats = [
  { number: '2.5M+', label: 'Images Analyzed', icon: Eye, description: 'Medical scans processed' },
  { number: '97.2%', label: 'AI Accuracy', icon: Target, description: 'Diagnostic precision' },
  { number: '800+', label: 'Healthcare Facilities', icon: Users, description: 'Institutions worldwide' },
  { number: '<30s', label: 'Average Processing', icon: Clock, description: 'Time to diagnosis' }
];

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MID Tool
              </span>
              <span className="text-xs text-gray-500 -mt-1">Medical Image Diagnostics</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">How It Works</a>
            <a href="#testimonials" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Testimonials</a>
            <a href="#contact" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Contact</a>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" className="font-medium">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg font-medium">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Trust Badge */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-6 py-3 shadow-lg">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">Trusted by 800+ Healthcare Facilities</span>
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white"></div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
                <span className="block">Transform Medical</span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Diagnostics with AI
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Advanced AI-powered analysis for brain tumor and breast cancer detection. 
                <span className="block mt-2 font-semibold text-blue-600">Get accurate results in under 30 seconds with 97.2% precision.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 shadow-xl transform hover:scale-105 transition-all duration-200">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Start Free Analysis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 bg-white/80 backdrop-blur-sm">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              {/* Key Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
                {benefits.map((benefit, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200">
                    <div className="flex justify-center mb-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <benefit.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mb-2">{benefit.stat}</div>
                    <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-3">
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold mb-2 text-gray-900">{stat.number}</div>
                    <div className="font-semibold text-gray-700 mb-1">{stat.label}</div>
                    <div className="text-sm text-gray-500">{stat.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">Trusted by Leading Healthcare Institutions</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {trustedBy.map((institution, index) => (
                <div key={index} className="text-center">
                  <div className="h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                    <span className="font-bold text-gray-600 text-sm">{institution.name}</span>
                  </div>
                  <p className="text-xs text-gray-500">{institution.type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="flex justify-center mb-4">
              <Badge variant="outline" className="px-4 py-2 bg-blue-50 text-blue-600 border-blue-200">
                <Sparkles className="h-4 w-4 mr-2" />
                Advanced AI Technology
              </Badge>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
              Everything you need for 
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                precision diagnostics
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive AI platform combines cutting-edge machine learning with medical expertise 
              to deliver accurate, fast, and reliable diagnostic insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-indigo-50 overflow-hidden">
                <CardContent className="p-8 relative">
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-600 border-blue-200">
                      {feature.highlight}
                    </Badge>
                  </div>
                  <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-blue-700 transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  <div className="mt-4">
                    <ChevronRight className="h-5 w-5 text-blue-500 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="flex justify-center mb-4">
              <Badge variant="outline" className="px-4 py-2 bg-white text-gray-600 border-gray-200">
                <Globe className="h-4 w-4 mr-2" />
                Simple 3-Step Process
              </Badge>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
              How it works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started with AI-powered medical diagnostics in minutes. Our streamlined workflow 
              makes advanced technology accessible to healthcare professionals.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {howItWorks.map((step, index) => (
                <div key={index} className="relative">
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-12 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-300 to-purple-300"></div>
                  )}
                  <Card className="border-0 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    <CardContent className="p-8 text-center">
                      <div className="relative mb-6">
                        <div className="absolute -top-4 -left-4 text-6xl font-bold text-gray-100">
                          {step.step}
                        </div>
                        <div className={`relative h-16 w-16 rounded-2xl ${step.color} flex items-center justify-center mx-auto shadow-lg`}>
                          <step.icon className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-gray-900">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="flex justify-center mb-4">
              <Badge variant="outline" className="px-4 py-2 bg-green-50 text-green-600 border-green-200">
                <AwardIcon className="h-4 w-4 mr-2" />
                Customer Success
              </Badge>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
              Trusted by medical 
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                professionals worldwide
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of healthcare professionals who trust MID Tool to enhance their diagnostic capabilities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-8 relative">
                  <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity">
                    <Quote className="h-12 w-12 text-blue-500" />
                  </div>
                  <div className="flex mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-8 leading-relaxed text-lg font-medium">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold mr-4 shadow-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                      <div className="text-gray-600">{testimonial.role}</div>
                      <div className="text-blue-600 font-semibold">{testimonial.hospital}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Trust Indicators */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900">HIPAA Compliant</h4>
              <p className="text-gray-600 text-sm">Enterprise security standards</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900">FDA Cleared</h4>
              <p className="text-gray-600 text-sm">Medical device regulations</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900">Global Reach</h4>
              <p className="text-gray-600 text-sm">Available worldwide</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 w-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900">24/7 Support</h4>
              <p className="text-gray-600 text-sm">Always here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-48 translate-y-48"></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <Badge variant="secondary" className="px-4 py-2 bg-white/20 text-white border-white/30">
                <Sparkles className="h-4 w-4 mr-2" />
                Get Started Today
              </Badge>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              Ready to Transform 
              <span className="block">Your Medical Practice?</span>
            </h2>
            
            <p className="text-xl lg:text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
              Join 800+ healthcare facilities already using MID Tool to enhance patient care, 
              improve diagnostic accuracy, and streamline medical workflows.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link to="/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-10 py-4 shadow-2xl font-semibold transform hover:scale-105 transition-all duration-200">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Free Analysis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-10 py-4 border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold transition-all duration-200">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Final Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">97.2%</div>
                <div className="text-white/80">Diagnostic Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">&lt;30s</div>
                <div className="text-white/80">Analysis Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">2.5M+</div>
                <div className="text-white/80">Images Processed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-gray-300 py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Stethoscope className="h-7 w-7 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-white">MID Tool</span>
                  <p className="text-sm text-gray-400 -mt-1">Medical Image Diagnostics</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-8 max-w-md">
                Advanced AI-powered medical image diagnostics platform trusted by healthcare 
                professionals worldwide. Enhance your diagnostic capabilities with cutting-edge technology.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-300">Available worldwide</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-300">24/7 support available</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-300">HIPAA compliant & secure</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-white mb-6">Product</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="hover:text-white transition-colors hover:underline">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors hover:underline">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:underline">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:underline">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:underline">API Access</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-white mb-6">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition-colors hover:underline">About Us</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors hover:underline">Testimonials</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:underline">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:underline">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:underline">Contact Support</a></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-center md:text-left">
                &copy; 2025 MID Tool. All rights reserved. Advancing healthcare through artificial intelligence.
              </p>
              <div className="flex space-x-6">
                <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-700">
                  <Shield className="h-3 w-3 mr-1" />
                  HIPAA Compliant
                </Badge>
                <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-700">
                  <Award className="h-3 w-3 mr-1" />
                  FDA Cleared
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};