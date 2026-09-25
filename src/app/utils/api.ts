import { projectId, publicAnonKey } from './supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-7bac5156`;

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

/**
 * Helper function to call the NutriApp API
 */
async function apiCall(endpoint: string, options: ApiOptions = {}) {
  const { method = 'GET', body, headers = {} } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
      ...headers,
    },
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `API error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

// ===== NUTRITIONIST API =====

export const nutritionistApi = {
  /**
   * Get nutritionist info including branding settings
   */
  get: async (nutritionistId: string) => {
    return apiCall(`/nutritionist/${nutritionistId}`);
  },

  /**
   * Update nutritionist info (profile and/or branding)
   */
  update: async (nutritionistId: string, data: any) => {
    return apiCall(`/nutritionist/${nutritionistId}`, {
      method: 'PUT',
      body: data,
    });
  },

  /**
   * Get all patients for a nutritionist
   */
  getPatients: async (nutritionistId: string) => {
    return apiCall(`/nutritionist/${nutritionistId}/patients`);
  },
};

// ===== PATIENT API =====

export const patientApi = {
  /**
   * Create a new patient
   */
  create: async (patientData: any) => {
    return apiCall('/patients', {
      method: 'POST',
      body: patientData,
    });
  },

  /**
   * Get patient info
   */
  get: async (patientId: string) => {
    return apiCall(`/patients/${patientId}`);
  },

  /**
   * Update patient info
   */
  update: async (patientId: string, data: any) => {
    return apiCall(`/patients/${patientId}`, {
      method: 'PUT',
      body: data,
    });
  },

  /**
   * Delete a patient
   */
  delete: async (patientId: string) => {
    return apiCall(`/patients/${patientId}`, {
      method: 'DELETE',
    });
  },
};

// ===== HEALTH CHECK =====

export const healthCheck = async () => {
  return apiCall('/health');
};
