
// Utility for online/offline support with improved service worker management

// Check current online status
export const checkOnlineStatus = (): boolean => {
  return typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
    ? navigator.onLine
    : true;
};

// Setup handlers for online/offline events and service worker
export const setupOfflineSupport = () => {
  if (typeof window === 'undefined') return;
  
  // Listen for online status changes
  window.addEventListener('online', handleOnlineStatus);
  window.addEventListener('offline', handleOnlineStatus);
  
  // Setup offline queueing
  setupOfflineQueue();
  
  // Register service worker if supported
  registerServiceWorker();
  
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

// Register service worker for offline support
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('ServiceWorker registration successful with scope:', registration.scope);
      
      // Listen for controller changes (new service worker took over)
      navigator.serviceWorker.oncontrollerchange = () => {
        console.log('New service worker controller');
      };
      
      // Handle service worker messages
      navigator.serviceWorker.onmessage = (event) => {
        console.log('Received message from service worker:', event.data);
      };
      
    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
    }
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
    
    // Notify service worker about new offline operation
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'OFFLINE_OPERATION',
        payload: operation
      });
    }
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
    
    // Iterate through queue and process each operation
    // In a real implementation, you would call specific API endpoints for each operation type
    const processPromises = queue.map(async (operation: any) => {
      try {
        // Process based on operation type
        switch(operation.type) {
          case 'CREATE':
          case 'UPDATE':
          case 'DELETE':
            // Here you would call the appropriate API endpoints
            console.log(`Processing ${operation.type} operation for ${operation.entity}`);
            return { success: true, operation };
          default:
            console.warn(`Unknown operation type: ${operation.type}`);
            return { success: false, operation, error: 'Unknown operation type' };
        }
      } catch (error) {
        console.error(`Error processing operation:`, operation, error);
        return { success: false, operation, error };
      }
    });
    
    // Wait for all operations to be processed
    const results = await Promise.allSettled(processPromises);
    
    // Filter out successful operations
    const failedOperations = results
      .filter((result): result is PromiseFulfilledResult<{ success: boolean, operation: any, error?: any }> => 
        result.status === 'fulfilled' && !result.value.success
      )
      .map(result => result.value.operation);
    
    // Update queue with only failed operations
    localStorage.setItem('offlineQueue', JSON.stringify(failedOperations));
    
    console.log('Offline changes synced. Failed operations:', failedOperations.length);
    
    // Notify UI of sync completion if needed
    if (failedOperations.length === 0) {
      console.log('All offline operations processed successfully');
    } else {
      console.warn(`${failedOperations.length} operations failed to sync`);
    }
  } catch (error) {
    console.error('Error syncing offline changes:', error);
    throw error;
  }
};

// Check if app has pending offline operations
export const hasPendingOfflineOperations = (): boolean => {
  try {
    const queue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
    return queue.length > 0;
  } catch {
    return false;
  }
};
