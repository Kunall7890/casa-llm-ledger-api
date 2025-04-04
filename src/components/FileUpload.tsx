
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { UploadCloud, AlertCircle, FileIcon } from 'lucide-react';

interface FileUploadProps {
  onFileUploaded: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      toast.error('Please upload a PDF file only');
      return;
    }
    
    setFile(selectedFile);
    onFileUploaded(selectedFile);
    toast.success('File successfully selected: ' + selectedFile.name);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleBrowseClick = () => {
    // Programmatically click the hidden file input
    fileInputRef.current?.click();
  };

  return (
    <Card className="p-6 shadow-lg border-2 border-primary/10 hover:border-primary/30 transition-all duration-300">
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${isDragging ? 'border-primary bg-primary/10 scale-[1.01]' : 'border-gray-300'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <UploadCloud className="h-10 w-10 text-primary" />
          </div>
          
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">Upload CASA Statement PDF</h3>
            <p className="text-sm text-gray-500 mt-2">Drag and drop your file here or click to browse</p>
          </div>
          
          <Input 
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            ref={fileInputRef}
          />
          
          <Button 
            variant="outline" 
            className="bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20 hover:border-primary transition-all duration-300"
            onClick={handleBrowseClick}
          >
            <FileIcon className="mr-2 h-4 w-4" />
            Browse Files
          </Button>
          
          {file && (
            <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20 animate-fade-in">
              <p className="text-sm font-medium flex items-center">
                <FileIcon className="h-4 w-4 mr-2 text-primary" />
                {file.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">{Math.round(file.size / 1024)} KB</p>
            </div>
          )}
          
          <div className="flex items-center mt-4 text-xs text-amber-600 bg-amber-50 p-2 rounded-md">
            <AlertCircle className="h-4 w-4 mr-1" />
            <p>PDF files only, max 10MB</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FileUpload;
