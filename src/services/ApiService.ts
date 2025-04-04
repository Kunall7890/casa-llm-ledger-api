
interface BankStatementResponse {
  name: string;
  email: string;
  openingBalance: string;
  closingBalance: string;
  generatedPassword?: string;
  transactions?: { date: string; description: string; amount: string; type: 'credit' | 'debit' }[];
}

export const ApiService = {
  // This function would typically connect to your Java backend
  // For now, it simulates the API call with a mock response
  async analyzePdf(pdfFile: File, additionalInfo?: { firstName: string, dob: string }): Promise<BankStatementResponse> {
    // In a real implementation, we would use FormData to send the file to the backend
    const formData = new FormData();
    formData.append('file', pdfFile);
    
    if (additionalInfo) {
      formData.append('firstName', additionalInfo.firstName);
      formData.append('dob', additionalInfo.dob);
    }
    
    // For the demo, instead of making an actual API call, we'll simulate processing
    // In a real app, you would use fetch or axios to call your Java backend
    // return fetch('https://your-backend-url.com/api/analyze-statement', {
    //   method: 'POST',
    //   body: formData
    // }).then(res => res.json());
    
    // Simulated API response after a delay to mimic processing
    return new Promise((resolve) => {
      setTimeout(() => {
        let response: BankStatementResponse = {
          name: "John Doe",
          email: "john.doe@example.com",
          openingBalance: "$5,243.21",
          closingBalance: "$5,876.54",
          transactions: [
            { date: '2023-03-01', description: 'Salary Deposit', amount: '+$3,500.00', type: 'credit' },
            { date: '2023-03-05', description: 'Amazon Purchase', amount: '-$129.99', type: 'debit' },
            { date: '2023-03-10', description: 'Grocery Store', amount: '-$85.47', type: 'debit' },
            { date: '2023-03-15', description: 'Interest Credit', amount: '+$12.34', type: 'credit' },
            { date: '2023-03-20', description: 'Utility Bill Payment', amount: '-$142.50', type: 'debit' },
            { date: '2023-03-25', description: 'Restaurant', amount: '-$76.30', type: 'debit' },
            { date: '2023-03-28', description: 'Mobile Phone Bill', amount: '-$65.99', type: 'debit' },
            { date: '2023-03-30', description: 'Online Transfer', amount: '-$500.00', type: 'debit' },
            { date: '2023-03-31', description: 'Dividend Payment', amount: '+$121.24', type: 'credit' },
          ],
        };
        
        // Add generated password if additional info was provided
        if (additionalInfo) {
          response.generatedPassword = ApiService.generateSecurePassword(additionalInfo);
        }
        
        resolve(response);
      }, 2000); // 2 second delay to simulate processing
    });
  },

  // Enhanced password generation function
  generateSecurePassword(info: { firstName: string, dob: string }): string {
    // Extract initials from first name
    const initials = info.firstName.substring(0, 2).toUpperCase();
    
    // Extract year from DOB
    const dobParts = info.dob.split('-');
    const year = dobParts[0];
    const month = dobParts[1];
    
    // Generate a random string with special characters
    const chars = '!@#$%^&*()';
    const randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
    
    // Generate random number between 100-999
    const randomNum = Math.floor(Math.random() * 900 + 100);
    
    // Combine parts to create a secure password
    const passwordParts = [
      initials,
      year.substring(2),
      month,
      randomChar,
      randomNum
    ];
    
    return passwordParts.join('');
  }
};
