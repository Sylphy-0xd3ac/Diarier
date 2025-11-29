import { Diary, ServiceResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Get token from localStorage
function getToken(): string | null {
  return localStorage.getItem('molo_token');
}

// Save token to localStorage
function saveToken(token: string): void {
  localStorage.setItem('molo_token', token);
}

// Clear token from localStorage
function clearToken(): void {
  localStorage.removeItem('molo_token');
}

class MoloService {
  
  async checkInitStatus(): Promise<ServiceResponse<{ initialized: boolean }>> {
    try {
      const response = await fetch(`${API_URL}/check-init-status`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to check init status:', error);
      return { success: false, error: 'Network error' };
    }
  }

  async initialize(pin: string): Promise<ServiceResponse<null>> {
    try {
      const response = await fetch(`${API_URL}/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to initialize:', error);
      return { success: false, error: 'Network error' };
    }
  }

  async login(pin: string): Promise<ServiceResponse<{ token: string }>> {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin }),
      });
      const data = await response.json();
      if (data.success && data.data?.token) {
        saveToken(data.data.token);
      }
      return data;
    } catch (error) {
      console.error('Failed to login:', error);
      return { success: false, error: 'Network error' };
    }
  }

  async getDiaries(): Promise<ServiceResponse<Diary[]>> {
    try {
      const token = getToken();
      if (!token) {
        return { success: false, error: 'No token available' };
      }

      const response = await fetch(`${API_URL}/diaries`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch diaries:', error);
      return { success: false, error: 'Network error' };
    }
  }

  async saveDiary(diary: Diary): Promise<ServiceResponse<Diary>> {
    try {
      const token = getToken();
      if (!token) {
        return { success: false, error: 'No token available' };
      }

      const response = await fetch(`${API_URL}/diaries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(diary),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to save diary:', error);
      return { success: false, error: 'Network error' };
    }
  }

  async deleteDiary(id: string): Promise<ServiceResponse<null>> {
    console.log(`[MoloService] Processing delete for diary: ${id}`);
    try {
      const token = getToken();
      if (!token) {
        return { success: false, error: 'No token available' };
      }

      const response = await fetch(`${API_URL}/diaries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(`[MoloService] Deleted diary ${id}`);
      return data;
    } catch (error) {
      console.error('Failed to delete diary:', error);
      console.warn(`[MoloService] Diary ${id} not found to delete`);
      return { success: false, error: 'Network error' };
    }
  }
}

export const moloService = new MoloService();
