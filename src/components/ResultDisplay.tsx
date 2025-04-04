
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Clipboard, Check } from 'lucide-react';

interface ResultDisplayProps {
  result: {
    name: string;
    email: string;
    openingBalance: string;
    closingBalance: string;
    generatedPassword?: string;
  } | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyClick = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!result) return null;

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-primary text-white rounded-t-lg">
        <CardTitle className="text-xl">Statement Analysis Results</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Badge variant="outline" className="mb-1">Account Holder</Badge>
            <p className="text-lg font-medium">{result.name}</p>
          </div>
          
          <div>
            <Badge variant="outline" className="mb-1">Email</Badge>
            <p className="text-lg font-medium">{result.email}</p>
          </div>

          <Separator className="my-4" />
          
          <div className="flex justify-between items-center">
            <div>
              <Badge variant="outline" className="mb-1">Opening Balance</Badge>
              <p className="text-lg font-medium text-blue-600">{result.openingBalance}</p>
            </div>
            
            <div className="text-right">
              <Badge variant="outline" className="mb-1">Closing Balance</Badge>
              <p className="text-lg font-medium text-blue-600">{result.closingBalance}</p>
            </div>
          </div>
          
          {result.generatedPassword && (
            <>
              <Separator className="my-4" />
              <div>
                <Badge variant="outline" className="mb-1">Generated Password</Badge>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-lg font-medium font-mono bg-muted p-2 rounded-md flex-1 overflow-auto">
                    {result.generatedPassword}
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCopyClick(result.generatedPassword || '')}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultDisplay;
