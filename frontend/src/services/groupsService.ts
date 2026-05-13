import { apiClient } from './apiClient';

export interface CreateGroupPayload {
  name: string;
  contribution_amount: number;
  frequency: 'weekly' | 'monthly';
  max_members: number;
  min_ajo_score: number;
  rotation_type: 'random' | 'manual';
  grace_period_hours: 24 | 48;
  description?: string;
}

export interface BrowseGroupsParams {
  frequency?: string;
  min_amount?: number;
  max_amount?: number;
  page?: number;
  limit?: number;
}

export interface JoinGroupPayload {
  invite_code: string;
}

export interface AutoMatchPayload {
  contribution_amount: number;
  frequency: 'weekly' | 'monthly';
}

export interface MandatePayload {
  bank_account_number: string;
  bank_code: string;
}

export const groupsService = {
  createGroup: async (payload: CreateGroupPayload) => {
    const response = await apiClient.post('/api/groups', payload);
    return response.data;
  },

  browseGroups: async (params?: BrowseGroupsParams) => {
    const response = await apiClient.get('/api/groups', { params });
    return response.data;
  },

  getMyGroups: async () => {
    const response = await apiClient.get('/api/groups/my');
    return response.data;
  },

  getGroupDetail: async (groupId: string) => {
    const response = await apiClient.get(`/api/groups/${groupId}`);
    return response.data;
  },

  joinGroup: async (groupId: string, payload: JoinGroupPayload) => {
    const response = await apiClient.post(`/api/groups/${groupId}/join`, payload);
    return response.data;
  },

  autoMatchGroup: async (payload: AutoMatchPayload) => {
    const response = await apiClient.post('/api/groups/match', payload);
    return response.data;
  },

  setupDirectDebitMandate: async (groupId: string, payload: MandatePayload) => {
    const response = await apiClient.post(`/api/groups/${groupId}/mandate`, payload);
    return response.data;
  },

  getGroupContributionHistory: async (groupId: string, cycle: string = 'all') => {
    const response = await apiClient.get(`/api/groups/${groupId}/contributions`, {
      params: { cycle }
    });
    return response.data;
  }
};
