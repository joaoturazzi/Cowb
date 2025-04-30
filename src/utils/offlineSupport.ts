
import { toast } from 'sonner';

// Network status tracking
let isOnline = navigator.onLine;

// Offline data storage
type OfflineData = {
  key: string;
  data: any;
  timestamp: number;
  syncFunction?: () => Promise<void>;
}

// Initialize offline storage
const OFFLINE_STORAGE_KEY = 'mazul_offline_data';

// Save data to offline storage
export const saveOfflineData = (key: string, data: any, syncFunction?: () => Promise<void>): void => {
  try {
    const storedData = localStorage.getItem(OFFLINE_STORAGE_KEY);
    const offlineData: OfflineData[] = storedData ? JSON.parse(storedData) : [];
    
    // Find if an item with the same key exists
    const existingIndex = offlineData.findIndex(item => item.key === key);
    
    const newItem: OfflineData = {
      key,
      data,
      timestamp: Date.now(),
      syncFunction: syncFunction?.toString(), // Store function as string (will need eval when restored)
    };
    
    if (existingIndex >= 0) {
      offlineData[existingIndex] = newItem;
    } else {
      offlineData.push(newItem);
    }
    
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(offlineData));
  } catch (error) {
    console.error('Failed to save offline data:', error);
  }
};

// Get data from offline storage
export const getOfflineData = <T>(key: string): T | null => {
  try {
    const storedData = localStorage.getItem(OFFLINE_STORAGE_KEY);
    if (!storedData) return null;
    
    const offlineData: OfflineData[] = JSON.parse(storedData);
    const item = offlineData.find(item => item.key === key);
    
    return item ? item.data as T : null;
  } catch (error) {
    console.error('Failed to get offline data:', error);
    return null;
  }
};

// Remove data from offline storage
export const removeOfflineData = (key: string): void => {
  try {
    const storedData = localStorage.getItem(OFFLINE_STORAGE_KEY);
    if (!storedData) return;
    
    const offlineData: OfflineData[] = JSON.parse(storedData);
    const updatedData = offlineData.filter(item => item.key !== key);
    
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Failed to remove offline data:', error);
  }
};

// Network status event listeners
export const setupOfflineSupport = () => {
  // Set up network status listeners
  window.addEventListener('online', () => {
    isOnline = true;
    toast.success('Conexão restabelecida! Sincronizando seus dados...');
    synchronizeOfflineData();
  });
  
  window.addEventListener('offline', () => {
    isOnline = false;
    toast.warning('Você está offline. Seus dados serão sincronizados quando a conexão for restabelecida.');
  });
  
  // Initial synchronization check
  if (navigator.onLine) {
    synchronizeOfflineData();
  }
};

// Check if online
export const checkOnlineStatus = (): boolean => {
  return navigator.onLine;
};

// Synchronize offline data once back online
const synchronizeOfflineData = async (): Promise<void> => {
  // This would implement the actual sync logic using the stored syncFunctions
  // For now, we'll just log it as a placeholder
  console.log('Synchronizing offline data...');
};
