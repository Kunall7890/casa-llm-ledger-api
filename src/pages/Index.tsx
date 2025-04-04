
import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import AdditionalInfoForm from '@/components/AdditionalInfoForm';
import ResultDisplay from '@/components/ResultDisplay';
import { ApiService } from '@/services/ApiService';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FileText, Key, FileSearch, ChevronRight, Github, Twitter, Linkedin, Mail } from 'lucide-react';

interface AnalysisResult {
  name: string;
  email: string;
  openingBalance: string;
  closingBalance: string;
  generatedPassword?: string;
  transactions?: { date: string; description: string; amount: string; type: 'credit' | 'debit' }[];
}

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<{ firstName: string, dob: string } | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');

  const handleFileUploaded = (file: File) => {
    setSelectedFile(file);
    if (activeTab === 'upload') {
      setActiveTab('info');
    }
  };

  const handleInfoSubmit = (info: { firstName: string, dob: string }) => {
    setAdditionalInfo(info);
  };

  const handleAnalyzeClick = async () => {
    if (!selectedFile) {
      toast.error('Please upload a PDF file first');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await ApiService.analyzePdf(selectedFile, additionalInfo || undefined);
      setResult(response);
      setActiveTab('result');
      toast.success('Statement successfully analyzed');
    } catch (error) {
      toast.error('Error analyzing statement. Please try again.');
      console.error('Analysis error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setAdditionalInfo(null);
    setResult(null);
    setActiveTab('upload');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 p-2 bg-primary/10 rounded-full">
            <FileSearch className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">
            CASA Statement Analyzer
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Upload your bank statement PDF and extract key information using advanced LLM technology.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="inline-flex h-6 items-center rounded-full bg-primary/10 px-2 text-xs font-medium text-primary">
              Fast Processing
            </span>
            <span className="inline-flex h-6 items-center rounded-full bg-primary/10 px-2 text-xs font-medium text-primary">
              Secure
            </span>
            <span className="inline-flex h-6 items-center rounded-full bg-primary/10 px-2 text-xs font-medium text-primary">
              AI-Powered
            </span>
          </div>
        </div>
        
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger 
                  value="upload" 
                  disabled={isProcessing} 
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Upload PDF
                </TabsTrigger>
                <TabsTrigger 
                  value="info" 
                  disabled={!selectedFile || isProcessing}
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <Key className="mr-2 h-4 w-4" />
                  Additional Info
                </TabsTrigger>
                <TabsTrigger 
                  value="result" 
                  disabled={!result}
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <FileSearch className="mr-2 h-4 w-4" />
                  Results
                </TabsTrigger>
              </TabsList>
              
              <div className="p-6">
                <TabsContent value="upload" className="mt-0">
                  <FileUpload onFileUploaded={handleFileUploaded} />
                  {selectedFile && (
                    <div className="mt-6 flex justify-end">
                      <Button 
                        onClick={() => setActiveTab('info')} 
                        className="group"
                      >
                        Continue
                        <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="info" className="mt-0">
                  <AdditionalInfoForm onInfoSubmit={handleInfoSubmit} />
                  <div className="mt-6">
                    <Separator className="mb-6" />
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setActiveTab('upload')}>Back</Button>
                      <Button 
                        onClick={handleAnalyzeClick} 
                        disabled={isProcessing}
                        className={`${isProcessing ? 'animate-pulse' : ''}`}
                      >
                        {isProcessing ? 'Analyzing...' : 'Analyze Statement'}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="result" className="mt-0">
                  <ResultDisplay result={result} />
                  <div className="mt-6">
                    <Separator className="mb-6" />
                    <div className="flex justify-center">
                      <Button onClick={handleReset} className="px-8">Process Another Statement</Button>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-16">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="font-bold text-primary">1</span>
                </div>
                <h3 className="font-medium mb-2">Upload Your Statement</h3>
                <p className="text-sm text-gray-600">Upload your bank statement PDF file securely.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="font-bold text-primary">2</span>
                </div>
                <h3 className="font-medium mb-2">Add Information</h3>
                <p className="text-sm text-gray-600">Provide additional details to generate a secure password.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="font-bold text-primary">3</span>
                </div>
                <h3 className="font-medium mb-2">Get Results</h3>
                <p className="text-sm text-gray-600">View extracted information and your secure password.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full bg-gradient-to-r from-primary/5 to-blue-500/5 py-8 mt-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">CASA Statement Analyzer</h3>
              <p className="text-sm text-gray-600 mb-4">
                Advanced statement analysis tool powered by LLM technology, making banking data easier to understand.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <Github size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">How it works</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Contact Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Newsletter</h3>
              <p className="text-sm text-gray-600 mb-3">
                Subscribe to our newsletter for updates.
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="text-sm flex-grow rounded-l-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button className="rounded-l-none">
                  <Mail size={16} />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} CASA Statement Analyzer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
