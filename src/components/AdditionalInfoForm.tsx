
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdditionalInfoProps {
  onInfoSubmit: (info: { firstName: string, dob: string }) => void;
}

const AdditionalInfoForm: React.FC<AdditionalInfoProps> = ({ onInfoSubmit }) => {
  const [firstName, setFirstName] = React.useState('');
  const [dob, setDob] = React.useState('');
  const [isValid, setIsValid] = React.useState(false);

  React.useEffect(() => {
    // Basic validation
    setIsValid(firstName.trim().length > 0 && dob.trim().length === 10);
  }, [firstName, dob]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onInfoSubmit({ firstName, dob });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Additional Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              placeholder="YYYY-MM-DD"
              type="date"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={!isValid}
          >
            Generate Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdditionalInfoForm;
