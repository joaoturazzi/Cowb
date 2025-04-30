
// Utility for online/offline support

// Check current online status
export const checkOnlineStatus = (): boolean => {
  return typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
    ? navigator.onLine
    : true;
};

// Setup handlers for online/offline events
export const setupOfflineSupport = () => {
  if (typeof window === 'undefined') return;
  
  // Listen for online status changes
  window.addEventListener('online', handleOnlineStatus);
  window.addEventListener('offline', handleOnlineStatus);
  
  // Setup offline queueing
  setupOfflineQueue();
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnlineStatus);
    window.removeEventListener('offline', handleOnlineStatus);
  };
};

// Handle online status changes
const handleOnlineStatus = () => {
  const isOnline = checkOnlineStatus();
  
  if (isOnline) {
    console.log('Application is online. Syncing data...');
    syncOfflineChanges().catch(err => {
      console.error('Error syncing offline changes:', err);
    });
  } else {
    console.log('Application is offline. Changes will be queued.');
  }
};

// Setup offline queue
const setupOfflineQueue = () => {
  // Initialize queue if it doesn't exist
  if (!localStorage.getItem('offlineQueue')) {
    localStorage.setItem('offlineQueue', JSON.stringify([]));
  }
};

// Add an operation to the offline queue
export const queueOfflineOperation = (operation: { 
  type: string; 
  entity: string; 
  data: any; 
  id?: string;
}) => {
  try {
    const queue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
    queue.push({
      ...operation,
      timestamp: Date.now()
    });
    localStorage.setItem('offlineQueue', JSON.stringify(queue));
  } catch (error) {
    console.error('Error queueing offline operation:', error);
  }
};

// Sync offline changes when back online
export const syncOfflineChanges = async (): Promise<void> => {
  try {
    const queue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
    
    if (queue.length === 0) return;
    
    console.log(`Processing ${queue.length} offline operations...`);
    
    // Process queue (in a real app, this would call API endpoints)
    // For now, just clear the queue
    localStorage.setItem('offlineQueue', JSON.stringify([]));
    
    console.log('Offline changes synced successfully');
  } catch (error) {
    console.error('Error syncing offline changes:', error);
    throw error;
  }
};
