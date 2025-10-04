import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  Search, 
  Book, 
  Video, 
  MessageCircle, 
  Mail,
  Phone,
  ExternalLink,
  FileText,
  Download
} from 'lucide-react';

export const Help: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const faqItems = [
    {
      question: "How accurate is the AI medical image analysis?",
      answer: "Our AI models achieve 95%+ accuracy on validated datasets. However, all AI analysis should be reviewed by qualified medical professionals and used as a diagnostic aid, not a replacement for clinical judgment."
    },
    {
      question: "What image formats are supported?",
      answer: "We support DICOM, JPEG, PNG, and TIFF formats. For best results, upload high-resolution images in DICOM format when available."
    },
    {
      question: "How long does analysis take?",
      answer: "Most analyses complete within 30-60 seconds. Complex multi-planar reconstructions may take up to 2-3 minutes."
    },
    {
      question: "Is my patient data secure?",
      answer: "Yes, all data is encrypted in transit and at rest. We are HIPAA compliant and follow strict medical data protection protocols."
    },
    {
      question: "Can I export analysis results?",
      answer: "Yes, you can export results as PDF reports, DICOM SR objects, or structured JSON data for integration with other systems."
    },
    {
      question: "How do I integrate with our hospital's PACS system?",
      answer: "Contact our support team for PACS integration. We support standard DICOM protocols and can provide custom integration solutions."
    }
  ];

  const tutorials = [
    {
      title: "Getting Started with Medical AI Analysis",
      description: "Complete guide to uploading and analyzing medical images",
      type: "Video",
      duration: "8 min",
      icon: Video
    },
    {
      title: "Understanding AI Confidence Scores",
      description: "Learn how to interpret AI analysis confidence levels",
      type: "Article",
      duration: "5 min read",
      icon: FileText
    },
    {
      title: "Advanced Image Viewer Features",
      description: "Master the medical image viewer tools and annotations",
      type: "Video",
      duration: "12 min",
      icon: Video
    },
    {
      title: "Generating Medical Reports",
      description: "Create comprehensive medical reports from AI analysis",
      type: "Article",
      duration: "7 min read",
      icon: FileText
    }
  ];

  const filteredFAQ = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-[var(--gradient-medical)] flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="medical-heading text-2xl">Help & Support</h1>
            <p className="clinical-text">Find answers and get assistance with the platform</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search */}
            <Card className="medical-card">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for help topics..."
                    className="medical-input pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="medical-card hover:shadow-[var(--shadow-medical)] transition-[var(--transition-medical)] cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Book className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="medical-heading font-medium mb-2">User Guide</h3>
                  <p className="clinical-text text-sm">Comprehensive documentation</p>
                </CardContent>
              </Card>

              <Card className="medical-card hover:shadow-[var(--shadow-medical)] transition-[var(--transition-medical)] cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Video className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="medical-heading font-medium mb-2">Video Tutorials</h3>
                  <p className="clinical-text text-sm">Step-by-step video guides</p>
                </CardContent>
              </Card>

              <Card className="medical-card hover:shadow-[var(--shadow-medical)] transition-[var(--transition-medical)] cursor-pointer">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="medical-heading font-medium mb-2">Live Chat</h3>
                  <p className="clinical-text text-sm">Chat with support team</p>
                </CardContent>
              </Card>
            </div>

            {/* FAQ */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Common questions and answers about the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQ.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="medical-heading text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="clinical-text">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {filteredFAQ.length === 0 && (
                  <div className="text-center py-8">
                    <p className="clinical-text">No FAQ items match your search.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tutorials */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle>Tutorials & Guides</CardTitle>
                <CardDescription>
                  Learn how to use the platform effectively
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {tutorials.map((tutorial, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-[hsl(var(--muted))] transition-[var(--transition-medical)]">
                    <div className="flex items-center space-x-4">
                      <tutorial.icon className="h-6 w-6 text-primary" />
                      <div>
                        <h4 className="medical-heading font-medium">{tutorial.title}</h4>
                        <p className="clinical-text text-sm">{tutorial.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{tutorial.type}</Badge>
                          <span className="clinical-text text-xs">{tutorial.duration}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Support */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>
                  Need personalized help? Reach out to our team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="medical-heading text-sm">Email</p>
                      <p className="clinical-text text-sm">support@medai.com</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="medical-heading text-sm">Phone</p>
                      <p className="clinical-text text-sm">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="medical-heading text-sm">Live Chat</p>
                      <p className="clinical-text text-sm">Available 24/7</p>
                    </div>
                  </div>
                </div>

                <Button className="clinical-button w-full">
                  Start Live Chat
                </Button>
              </CardContent>
            </Card>

            {/* Submit Ticket */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle>Submit a Ticket</CardTitle>
                <CardDescription>
                  Report an issue or request assistance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="medical-heading text-sm">Subject</label>
                  <Input 
                    placeholder="Brief description of your issue"
                    className="medical-input"
                  />
                </div>

                <div className="space-y-2">
                  <label className="medical-heading text-sm">Description</label>
                  <Textarea 
                    placeholder="Please provide details about your issue..."
                    className="medical-input min-h-[100px]"
                  />
                </div>

                <Button className="clinical-button w-full">
                  Submit Ticket
                </Button>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle>Additional Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download User Manual
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  API Documentation
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Video className="h-4 w-4 mr-2" />
                  Video Library
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
};