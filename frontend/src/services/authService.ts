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
  login: async (credentials: LoginFormValues): Promise<AuthResponse> => {
    const csrfResponse = await getCsrfCookie();
    const headers = getXsrfHeader(csrfResponse);

    const response = await apiClient.post<AuthResponse>('/api/login', {
      email: credentials.identifier, 
      password: credentials.password
    }, { headers });

    return response.data;
  },

  /**
   * Registers a new user account using Laravel Sanctum.
   */
  register: async (data: RegistrationFormValues): Promise<AuthResponse> => {
    const csrfResponse = await getCsrfCookie();
    const headers = getXsrfHeader(csrfResponse);

    const response = await apiClient.post<AuthResponse>('/api/register', {
      name: data.fullName,
      phone: data.phoneNumber,
      email: data.email,
      password: data.password,
      password_confirmation: data.confirmPassword
    }, { headers });

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
