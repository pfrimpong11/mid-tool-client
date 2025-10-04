import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  FileImage, 
  ZoomIn, 
  ZoomOut,
  RotateCw,
  Maximize,
  Minimize,
  Sun,
  Contrast,
  Ruler,
  MousePointer,
  Square,
  Circle,
  Type,
  Download,
  Share,
  Settings,
  Grid3X3,
  SplitSquareHorizontal
} from 'lucide-react';

export const Viewer: React.FC = () => {
  const [brightness, setBrightness] = useState([50]);
  const [contrast, setContrast] = useState([50]);
  const [zoom, setZoom] = useState(100);
  const [activeTool, setActiveTool] = useState('pointer');
  const [viewMode, setViewMode] = useState('single');

  const tools = [
    { id: 'pointer', icon: MousePointer, label: 'Pointer' },
    { id: 'ruler', icon: Ruler, label: 'Measure' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'text', icon: Type, label: 'Text' }
  ];

  const viewModes = [
    { id: 'single', icon: Maximize, label: 'Single View' },
    { id: 'grid', icon: Grid3X3, label: 'Grid View' },
    { id: 'compare', icon: SplitSquareHorizontal, label: 'Compare' }
  ];

  return (
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Sidebar */}
        <div className="w-80 border-r border-border bg-card flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-[var(--gradient-medical)] flex items-center justify-center">
                <FileImage className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="medical-heading text-lg">Medical Viewer</h1>
                <p className="clinical-text text-sm">Advanced image analysis tools</p>
              </div>
            </div>
          </div>

          {/* Patient Info */}
          <div className="p-4 border-b border-border">
            <Card className="medical-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="medical-heading">Name:</span>
                  <span className="clinical-text ml-2">John Doe</span>
                </div>
                <div className="text-sm">
                  <span className="medical-heading">Study Date:</span>
                  <span className="clinical-text ml-2">2024-01-15</span>
                </div>
                <div className="text-sm">
                  <span className="medical-heading">Modality:</span>
                  <span className="clinical-text ml-2">Chest X-Ray</span>
                </div>
                <div className="text-sm">
                  <span className="medical-heading">Series:</span>
                  <span className="clinical-text ml-2">1 of 3</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tools */}
          <div className="p-4 border-b border-border">
            <h3 className="medical-heading text-sm mb-3">Tools</h3>
            <div className="grid grid-cols-3 gap-2">
              {tools.map((tool) => (
                <Button
                  key={tool.id}
                  variant={activeTool === tool.id ? "default" : "outline"}
                  size="sm"
                  className="flex flex-col items-center gap-1 h-auto py-2"
                  onClick={() => setActiveTool(tool.id)}
                >
                  <tool.icon className="h-4 w-4" />
                  <span className="text-xs">{tool.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* View Controls */}
          <div className="p-4 border-b border-border">
            <h3 className="medical-heading text-sm mb-3">View</h3>
            <div className="space-y-3">
              {/* View Mode */}
              <div className="flex gap-1">
                {viewModes.map((mode) => (
                  <Button
                    key={mode.id}
                    variant={viewMode === mode.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode(mode.id)}
                  >
                    <mode.icon className="h-3 w-3" />
                  </Button>
                ))}
              </div>

              {/* Zoom */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="medical-heading text-xs">Zoom</span>
                  <span className="clinical-text text-xs">{zoom}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setZoom(Math.max(25, zoom - 25))}
                  >
                    <ZoomOut className="h-3 w-3" />
                  </Button>
                  <Slider
                    value={[zoom]}
                    onValueChange={([value]) => setZoom(value)}
                    min={25}
                    max={400}
                    step={25}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setZoom(Math.min(400, zoom + 25))}
                  >
                    <ZoomIn className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Rotation */}
              <div className="flex items-center gap-2">
                <span className="medical-heading text-xs">Rotate</span>
                <Button variant="outline" size="sm">
                  <RotateCw className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Image Adjustments */}
          <div className="p-4 border-b border-border">
            <h3 className="medical-heading text-sm mb-3">Image Adjustments</h3>
            <div className="space-y-4">
              {/* Brightness */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sun className="h-3 w-3" />
                  <span className="medical-heading text-xs">Brightness</span>
                </div>
                <Slider
                  value={brightness}
                  onValueChange={setBrightness}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>

              {/* Contrast */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Contrast className="h-3 w-3" />
                  <span className="medical-heading text-xs">Contrast</span>
                </div>
                <Slider
                  value={contrast}
                  onValueChange={setContrast}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>

              <Button variant="outline" size="sm" className="w-full">
                Reset Adjustments
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 mt-auto">
            <div className="space-y-2">
              <Button className="clinical-button w-full flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Image
              </Button>
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Share className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Main Viewer */}
        <div className="flex-1 flex flex-col">
          {/* Viewer Header */}
          <div className="h-12 border-b border-border bg-card flex items-center justify-between px-4">
            <div className="flex items-center space-x-4">
              <Badge variant="outline">Series 1/3</Badge>
              <span className="clinical-text text-sm">Chest PA View</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Viewer Area */}
          <div className="flex-1 bg-[hsl(var(--muted))] relative overflow-hidden">
            {viewMode === 'single' && (
              <div className="absolute inset-4 bg-black rounded-lg flex items-center justify-center">
                <div className="w-full h-full max-w-2xl max-h-2xl bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center relative">
                  {/* Simulated Medical Image */}
                  <div className="absolute inset-0 opacity-20">
                    <svg viewBox="0 0 400 400" className="w-full h-full">
                      {/* Rib cage outline */}
                      <ellipse cx="200" cy="180" rx="150" ry="120" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />
                      <ellipse cx="200" cy="200" rx="130" ry="100" fill="none" stroke="white" strokeWidth="1" opacity="0.4" />
                      
                      {/* Spine */}
                      <line x1="200" y1="80" x2="200" y2="320" stroke="white" strokeWidth="3" opacity="0.7" />
                      
                      {/* Heart outline */}
                      <path d="M 160 160 Q 160 140, 180 140 Q 200 140, 200 160 Q 200 140, 220 140 Q 240 160, 240 160 Q 240 180, 220 200 L 200 220 L 180 200 Q 160 180, 160 160" 
                            fill="none" stroke="white" strokeWidth="2" opacity="0.5" />
                      
                      {/* Lungs */}
                      <ellipse cx="140" cy="180" rx="60" ry="80" fill="none" stroke="white" strokeWidth="1" opacity="0.3" />
                      <ellipse cx="260" cy="180" rx="60" ry="80" fill="none" stroke="white" strokeWidth="1" opacity="0.3" />
                    </svg>
                  </div>
                  
                  <div className="text-white/50 text-center">
                    <FileImage className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg font-medium">Chest X-Ray Image</p>
                    <p className="text-sm">Interactive medical image viewer</p>
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'grid' && (
              <div className="absolute inset-4 grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="bg-black rounded-lg flex items-center justify-center">
                    <div className="text-white/50 text-center">
                      <FileImage className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Image {item}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {viewMode === 'compare' && (
              <div className="absolute inset-4 grid grid-cols-2 gap-4">
                <div className="bg-black rounded-lg flex items-center justify-center">
                  <div className="text-white/50 text-center">
                    <FileImage className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">Before</p>
                  </div>
                </div>
                <div className="bg-black rounded-lg flex items-center justify-center">
                  <div className="text-white/50 text-center">
                    <FileImage className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">After</p>
                  </div>
                </div>
              </div>
            )}

            {/* Viewer Info Overlay */}
            <div className="absolute top-4 left-4 bg-black/70 text-white p-2 rounded text-xs">
              <div>Zoom: {zoom}%</div>
              <div>Tool: {tools.find(t => t.id === activeTool)?.label}</div>
            </div>

            {/* Viewer Controls Overlay */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button variant="secondary" size="icon">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="icon">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="icon">
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
  );
};