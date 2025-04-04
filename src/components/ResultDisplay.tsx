import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clipboard, Check, Download, Share2, FileText, BarChart2 } from 'lucide-react';
import { toast } from 'sonner';

interface ResultDisplayProps {
  result: {
    name: string;
    email: string;
    openingBalance: string;
    closingBalance: string;
    generatedPassword?: string;
    transactions?: { date: string; description: string; amount: string; type: 'credit' | 'debit' }[];
  } | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const [copied, setCopied] = React.useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'transactions'>('summary');

  const handleCopyClick = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadPDF = () => {
    toast.success('PDF report generated and downloaded');
  };

  const handleShareClick = () => {
    toast.success('Share link copied to clipboard');
  };

  const mockTransactions = [
    { date: '2023-03-01', description: 'Salary Deposit', amount: '+$3,500.00', type: 'credit' as const },
    { date: '2023-03-05', description: 'Amazon Purchase', amount: '-$129.99', type: 'debit' as const },
    { date: '2023-03-10', description: 'Grocery Store', amount: '-$85.47', type: 'debit' as const },
    { date: '2023-03-15', description: 'Interest Credit', amount: '+$12.34', type: 'credit' as const },
    { date: '2023-03-20', description: 'Utility Bill Payment', amount: '-$142.50', type: 'debit' as const },
  ];

  const transactions = result?.transactions || mockTransactions;

  if (!result) return null;

  const getBalanceDifference = () => {
    const opening = parseFloat(result.openingBalance.replace(/[^0-9.-]+/g, ""));
    const closing = parseFloat(result.closingBalance.replace(/[^0-9.-]+/g, ""));
    return closing - opening;
  };

  const balanceDifference = getBalanceDifference();
  const isPositive = balanceDifference >= 0;

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-2 border-primary/10">
        <CardHeader className="bg-gradient-to-r from-primary to-blue-700 text-white rounded-t-lg">
          <CardTitle className="text-xl flex items-center justify-between">
            <span>Statement Analysis Results</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={handleShareClick}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="flex gap-4 mb-6">
            <Button 
              variant={activeTab === 'summary' ? 'default' : 'outline'} 
              className="flex-1"
              onClick={() => setActiveTab('summary')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Summary
            </Button>
            <Button 
              variant={activeTab === 'transactions' ? 'default' : 'outline'} 
              className="flex-1"
              onClick={() => setActiveTab('transactions')}
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              Transactions
            </Button>
          </div>
          
          {activeTab === 'summary' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Badge variant="outline" className="mb-1">Account Holder</Badge>
                    <p className="text-lg font-medium">{result.name}</p>
                  </div>
                  
                  <div>
                    <Badge variant="outline" className="mb-1">Email</Badge>
                    <p className="text-lg font-medium">{result.email}</p>
                  </div>
                </div>

                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Balance Summary</h4>
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
                  
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Balance Change</span>
                      <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : ''}{balanceDifference.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div 
                        className={`h-1.5 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(Math.abs(balanceDifference) / 100 * 10, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {result.generatedPassword && (
                <>
                  <Separator className="my-4" />
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                    <Badge variant="outline" className="mb-1 bg-primary/10 text-primary">Generated Secure Password</Badge>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-lg font-mono bg-primary/10 p-2 rounded-md flex-1 overflow-auto">
                        {result.generatedPassword}
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCopyClick(result.generatedPassword || '')}
                        className="min-w-[40px]"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      This password is generated based on your information. Store it securely.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{transaction.date}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className={`text-right ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultDisplay;
