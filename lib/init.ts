import { initializeDB } from './db/migrations';
import { useAuthStore } from './stores/authStore';
import { useProductStore } from './stores/productStore';
import { useCustomerStore } from './stores/customerStore';
import { initializeLanguage } from './services/languageService';
import { LockScreenService } from './services/lockScreenService';
import { monitorOnlineStatus } from './utils/offlineDetection';

// Initialize all core systems for the POS Offline app
export const initializeApp = async () => {
 try {
    console.log('Initializing POS Offline System...');
    
    // Initialize database
    await initializeDB();
    console.log('Database initialized');
    
    // Initialize stores with their initial data
    await useProductStore.getState().initializeProducts();
    console.log('Product store initialized');
    
    await useCustomerStore.getState().initializeCustomers();
    console.log('Customer store initialized');
    
    await useAuthStore.getState().initializeAuth();
    console.log('Auth store initialized');
    
    // Initialize language service
    initializeLanguage();
    console.log('Language service initialized');
    
    // Initialize lock screen service
    LockScreenService.initialize();
    console.log('Lock screen service initialized');
    
    // Set up online/offline monitoring
    monitorOnlineStatus();
    console.log('Online/offline monitoring initialized');
    
    console.log('POS Offline System initialized successfully');
  } catch (error) {
    console.error('Failed to initialize POS Offline System:', error);
    throw error;
  }
};