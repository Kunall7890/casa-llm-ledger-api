
interface BankStatementResponse {
  name: string;
  email: string;
  openingBalance: string;
  closingBalance: string;
  generatedPassword?: string;
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
        };
        
        // Add generated password if additional info was provided
        if (additionalInfo) {
          // Simple password generation - in reality would be done by the backend
          const passwordParts = [
            additionalInfo.firstName.substring(0, 3),
            additionalInfo.dob.replace(/-/g, '').substring(4, 8),
            Math.random().toString(36).substring(2, 5).toUpperCase()
          ];
          response.generatedPassword = passwordParts.join('-');
        }
        
        resolve(response);
      }, 2000); // 2 second delay to simulate processing
    });
  }
};
