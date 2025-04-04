
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
import { FileText, Key, FileSearch } from 'lucide-react';

interface AnalysisResult {
  name: string;
  email: string;
  openingBalance: string;
  closingBalance: string;
  generatedPassword?: string;
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
    <div className="min-h-screen flex flex-col items-center py-8 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-primary">CASA Statement Analyzer</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload your bank statement PDF and extract key information using LLM technology.
          </p>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="upload" disabled={isProcessing}>
                  <FileText className="mr-2 h-4 w-4" />
                  Upload PDF
                </TabsTrigger>
                <TabsTrigger value="info" disabled={!selectedFile || isProcessing}>
                  <Key className="mr-2 h-4 w-4" />
                  Additional Info
                </TabsTrigger>
                <TabsTrigger value="result" disabled={!result}>
                  <FileSearch className="mr-2 h-4 w-4" />
                  Results
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="mt-0">
                <FileUpload onFileUploaded={handleFileUploaded} />
                {selectedFile && (
                  <div className="mt-4 flex justify-end">
                    <Button onClick={() => setActiveTab('info')}>Continue</Button>
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
                    <Button onClick={handleReset}>Process Another Statement</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            The Java backend would typically handle the PDF parsing with LLM integration.
            <br />
            This frontend demo simulates the API response for demonstration purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
