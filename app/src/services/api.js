const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = new Error(`API Error: ${response.statusText}`);
    error.status = response.status;
    
    try {
      const errorData = await response.json();
      error.details = errorData;
    } catch {
      // No JSON body, that's okay
    }
    
    throw error;
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  } else {
    return await response.text();
  }
};

export const apiService = {
  
  pingServer: async () => {
    try {
      const response = await fetch(`${API_BASE}/hello?name=SportWales`);
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Ping failed:', error);
      throw error;
    }
  },

  saveAssessment: async (formData) => {
    try {
      const response = await fetch(`${API_BASE}/submitForm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await handleResponse(response);
      console.log('[API] Assessment saved:', result);
      return result;
      
    } catch (error) {
      console.error('[API] Save failed:', error);
      
      if (error.status === 401) {
        throw new Error('You must be logged in to save assessments');
      } else if (error.status === 500) {
        throw new Error('Server error. Please try again.');
      } else {
        throw new Error('Failed to save assessment. Check connection.');
      }
    }
  },

  getAssessment: async (formId) => {
    try {
      const response = await fetch(`${API_BASE}/getForm?id=${formId}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Get assessment failed:', error);
      throw error;
    }
  },

  listAssessments: async () => {
    try {
      const response = await fetch(`${API_BASE}/listForms`);
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] List failed:', error);
      throw error;
    }
  }
};
