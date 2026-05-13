import { apiClient } from './apiClient';
import { LoginFormValues } from '@/models/auth/useLoginForm';
import { RegistrationFormValues } from '@/models/auth/useRegistrationForm';

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email?: string | null;
    phone?: string;
  };
  token?: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user_id: string;
    full_name: string;
    token: string;
    ajo_score: number;
    score_tier: string;
    onboarding_complete: "true" | "false";
  };
}

export interface RegisterResponse {
  success: boolean;
  data: {
    user_id: string;
    full_name: string;
    phone: string;
    token: string;
    onboarding_complete: boolean;
  };
}

/**
 * Ensures a CSRF cookie is requested from Laravel Sanctum.
 */
export const getCsrfCookie = async () => {
  return await apiClient.get('/sanctum/csrf-cookie');
};

/**
 * Helper to safely extract the XSRF token header.
 */
const getXsrfHeader = (csrfResponse: any) => {
  const token = csrfResponse.headers["x-xsrf-token"] || 
               (typeof document !== 'undefined' && document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1]);
  return token ? { "X-XSRF-TOKEN": decodeURIComponent(token) } : {};
};

export const authService = {
  /**
   * Submits user credentials to authenticate using Laravel Sanctum.
   */
  login: async (credentials: LoginFormValues): Promise<LoginResponse> => {
    const csrfResponse = await getCsrfCookie();
    const headers = getXsrfHeader(csrfResponse);

    const response = await apiClient.post<LoginResponse>('/api/auth/login', {
      email: credentials.email, 
      password: credentials.password
    }, { headers });

    return response.data;
  },

  /**
   * Registers a new user account using Laravel Sanctum.
   */
  register: async (data: RegistrationFormValues): Promise<RegisterResponse> => {
    const csrfResponse = await getCsrfCookie();
    const headers = getXsrfHeader(csrfResponse);

    const payload: any = {
      full_name: data.fullName,
      phone: data.phoneNumber,
      password: data.password
    };
    
    if (data.email) {
      payload.email = data.email;
    }

    const response = await apiClient.post<RegisterResponse>('/api/auth/register', payload, { headers });

    return response.data;
  },
  
  /**
   * Cleans up local session data and terminates the backend session.
   */
  logout: async () => {
    if (typeof window !== 'undefined') {
      try {
        await apiClient.post('/api/logout');
      } catch (e) {
        console.error("Logout failed on server", e);
      }
      localStorage.removeItem('token');
      // Additional cleanup logic...
    }
  }
};
