
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { UploadCloud, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUploaded: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  return (
    <Card className="p-6">
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <UploadCloud className="h-12 w-12 text-primary" />
          <div>
            <h3 className="text-lg font-semibold">Upload CASA Statement PDF</h3>
            <p className="text-sm text-gray-500 mt-1">Drag and drop your file here or click to browse</p>
          </div>
          
          <Input 
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button variant="outline" className="cursor-pointer">
              Browse Files
            </Button>
          </label>
          
          {file && (
            <div className="mt-4 text-sm">
              <span className="font-medium">Selected file:</span> {file.name}
            </div>
          )}
          
          <div className="flex items-center mt-4 text-xs text-amber-600">
            <AlertCircle className="h-4 w-4 mr-1" />
            <p>PDF files only, max 10MB</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FileUpload;
