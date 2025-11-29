import { Diary, ServiceResponse } from '../types';

const DELAY_MS = 300;
const STORAGE_KEY_PIN = 'molo_pin';
const STORAGE_KEY_DIARIES = 'molo_diaries';
const STORAGE_KEY_INIT = 'molo_initialized';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MoloService {
  
  async checkInitStatus(): Promise<ServiceResponse<{ initialized: boolean }>> {
    await wait(DELAY_MS);
    const isInit = localStorage.getItem(STORAGE_KEY_INIT) === 'true';
    return { success: true, data: { initialized: isInit } };
  }

  async initialize(pin: string): Promise<ServiceResponse<null>> {
    await wait(DELAY_MS);
    localStorage.setItem(STORAGE_KEY_PIN, pin);
    localStorage.setItem(STORAGE_KEY_INIT, 'true');
    localStorage.setItem(STORAGE_KEY_DIARIES, JSON.stringify([]));
    return { success: true };
  }

  async login(pin: string): Promise<ServiceResponse<{ token: string }>> {
    await wait(DELAY_MS);
    const storedPin = localStorage.getItem(STORAGE_KEY_PIN);
    if (storedPin === pin) {
      // Mock JWT
      const token = `jwt_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      return { success: true, data: { token } };
    }
    return { success: false, error: 'Invalid PIN' };
  }

  async getDiaries(): Promise<ServiceResponse<Diary[]>> {
    await wait(DELAY_MS);
    const data = localStorage.getItem(STORAGE_KEY_DIARIES);
    const diaries: Diary[] = data ? JSON.parse(data) : [];
    // Sort by date desc
    diaries.sort((a, b) => b.updatedAt - a.updatedAt);
    return { success: true, data: diaries };
  }

  async saveDiary(diary: Diary): Promise<ServiceResponse<Diary>> {
    await wait(DELAY_MS);
    const data = localStorage.getItem(STORAGE_KEY_DIARIES);
    let diaries: Diary[] = data ? JSON.parse(data) : [];
    
    const existingIndex = diaries.findIndex(d => d.id === diary.id);
    if (existingIndex >= 0) {
      diaries[existingIndex] = { ...diary, updatedAt: Date.now() };
    } else {
      diaries.push({ ...diary, createdAt: Date.now(), updatedAt: Date.now() });
    }
    
    localStorage.setItem(STORAGE_KEY_DIARIES, JSON.stringify(diaries));
    return { success: true, data: diary };
  }

  async deleteDiary(id: string): Promise<ServiceResponse<null>> {
    console.log(`[MoloService] Processing delete for diary: ${id}`);
    await wait(DELAY_MS);
    const data = localStorage.getItem(STORAGE_KEY_DIARIES);
    let diaries: Diary[] = data ? JSON.parse(data) : [];
    
    const initialLength = diaries.length;
    diaries = diaries.filter(d => d.id !== id);
    
    if (diaries.length !== initialLength) {
        console.log(`[MoloService] Deleted diary ${id}, new count: ${diaries.length}`);
    } else {
        console.warn(`[MoloService] Diary ${id} not found to delete`);
    }

    localStorage.setItem(STORAGE_KEY_DIARIES, JSON.stringify(diaries));
    return { success: true };
  }
}

export const moloService = new MoloService();