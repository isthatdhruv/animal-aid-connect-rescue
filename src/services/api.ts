
// Base API URL - we'll assume backend is running on port 3001
const API_BASE_URL = '/api';

// Helper function for making API requests
async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    // Extract error message from response if available
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.status}`);
    } catch (e) {
      throw new Error(`API error: ${response.status}`);
    }
  }

  // For 204 No Content responses, return null instead of parsing JSON
  if (response.status === 204) {
    return null;
  }

  return await response.json();
}

// Report-related API calls
export const reportApi = {
  // Submit a new animal report
  submitReport: (reportData: FormData) => {
    return fetch(`${API_BASE_URL}/reports`, {
      method: 'POST',
      body: reportData, // FormData for file upload
    }).then(res => res.json());
  },
  
  // Get all active reports
  getActiveReports: () => {
    return fetchApi('/reports/active');
  },
  
  // Update report status (accept/close/flag)
  updateReportStatus: (reportId: string, status: string, ngoId: string) => {
    return fetchApi(`/reports/${reportId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, ngoId })
    });
  }
};

// NGO-related API calls
export const ngoApi = {
  // Register a new NGO
  register: (ngoData: any) => {
    return fetchApi('/ngo/register', {
      method: 'POST',
      body: JSON.stringify(ngoData)
    });
  },
  
  // Login as an NGO
  login: (credentials: { email: string, password: string }) => {
    return fetchApi('/ngo/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },
  
  // Login with Google (receive token from frontend)
  googleLogin: (token: string) => {
    return fetchApi('/ngo/google-login', {
      method: 'POST',
      body: JSON.stringify({ token })
    });
  },
  
  // Complete NGO profile setup
  setupProfile: (ngoId: string, profileData: any) => {
    return fetchApi(`/ngo/${ngoId}/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },
  
  // Get NGO profile details
  getProfile: (ngoId: string) => {
    return fetchApi(`/ngo/${ngoId}`);
  },
  
  // Get reports relevant to this NGO (based on location)
  getNgoReports: (ngoId: string) => {
    return fetchApi(`/ngo/${ngoId}/reports`);
  }
};

// Admin-related API calls
export const adminApi = {
  // Admin login
  login: (credentials: { username: string, password: string }) => {
    return fetchApi('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },
  
  // Get list of NGOs (with optional filters)
  getNgos: (filters: { status?: string } = {}) => {
    const query = new URLSearchParams(filters as Record<string, string>).toString();
    return fetchApi(`/admin/ngos?${query}`);
  },
  
  // Update NGO status (approve/suspend)
  updateNgoStatus: (ngoId: string, status: string) => {
    return fetchApi(`/admin/ngos/${ngoId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },
  
  // Get all reports (with optional filters)
  getReports: (filters: { status?: string } = {}) => {
    const query = new URLSearchParams(filters as Record<string, string>).toString();
    return fetchApi(`/admin/reports?${query}`);
  },
  
  // Get system statistics
  getStats: () => {
    return fetchApi('/admin/stats');
  }
};
