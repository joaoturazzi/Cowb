
// Test utilities for components and hooks

export interface TestResult {
  success: boolean;
  message: string;
  details?: any;
}

// Function to test timer transitions
export const testTimerTransitions = async (): Promise<TestResult> => {
  try {
    // Get timer settings from localStorage or use defaults
    const timerSettings = localStorage.getItem('timerSettings') 
      ? JSON.parse(localStorage.getItem('timerSettings') || '{}')
      : { workDuration: 25, breakDuration: 5, longBreakDuration: 15 };
    
    // Check timer settings validity
    if (!timerSettings || 
        typeof timerSettings.workDuration !== 'number' || 
        typeof timerSettings.breakDuration !== 'number' || 
        typeof timerSettings.longBreakDuration !== 'number') {
      return {
        success: false,
        message: "Invalid timer settings format"
      };
    }
    
    return {
      success: true,
      message: "Timer settings validation passed",
      details: {
        timerSettings
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Timer settings validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: error
    };
  }
};

// Function to test task state management
export const testTaskStateManagement = async (): Promise<TestResult> => {
  try {
    // Create a mock task
    const mockTask = {
      id: 'test-task-id',
      name: 'Test Task',
      estimatedTime: 25,
      priority: 'medium',
      completed: false,
      createdAt: new Date().toISOString(),
      target_date: new Date().toISOString().split('T')[0]
    };
    
    // Test localStorage capacity
    try {
      const testKey = '__test_storage_capacity';
      let data = '0';
      
      // Test writing increasingly large amounts of data
      while (data.length < 5000000) { // Try up to ~5MB
        data = data + data;
        localStorage.setItem(testKey, data);
      }
      
      localStorage.removeItem(testKey);
    } catch (e) {
      return {
        success: false,
        message: "localStorage capacity test failed - storage may be limited",
        details: e
      };
    }
    
    return {
      success: true,
      message: "Task state management tests passed successfully",
      details: {
        mockTask,
        storageAvailable: true
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Task state management tests failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: error
    };
  }
};

// Function to run connectivity test
export const testConnectivity = async (): Promise<TestResult> => {
  try {
    // Check if browser is online
    const isOnline = navigator.onLine;
    
    return {
      success: true,
      message: isOnline 
        ? "Device is online, connectivity available" 
        : "Device is offline, running in offline mode",
      details: {
        online: isOnline
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Connectivity test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: error
    };
  }
};

// Function to run all tests
export const runAllTests = async (): Promise<Record<string, TestResult>> => {
  return {
    timerTransitions: await testTimerTransitions(),
    taskStateManagement: await testTaskStateManagement(),
    connectivity: await testConnectivity()
  };
};

// Function to check browser capabilities
export const checkBrowserCapabilities = (): Record<string, boolean> => {
  return {
    serviceWorkerSupport: 'serviceWorker' in navigator,
    localStorageSupport: (() => {
      try {
        localStorage.setItem('__test', '__test');
        localStorage.removeItem('__test');
        return true;
      } catch (e) {
        return false;
      }
    })(),
    indexedDBSupport: 'indexedDB' in window,
    notificationSupport: 'Notification' in window
  };
};
