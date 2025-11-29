export interface Diary {
  id: string;
  title: string;
  content: string;
  date: string; // ISO string
  createdAt: number;
  updatedAt: number;
}

export interface UserState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  token: string | null;
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export enum AppStatus {
  LOADING = 'LOADING',
  UNINIT_INTRO = 'UNINIT_INTRO', // "Looks like you haven't initialized..."
  UNINIT_PIN = 'UNINIT_PIN',     // "Please initialize your access PIN"
  INIT_SUCCESS = 'INIT_SUCCESS', // "Init complete"
  LOGIN = 'LOGIN',               // "Please enter your access PIN"
  DASHBOARD = 'DASHBOARD'        // Main App
}