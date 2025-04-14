
import { useEffect } from 'react';
import { NotificationService } from '../services/NotificationService';

export function useNotifications() {
  useEffect(() => {
    // Check if this is running in a browser environment
    if (typeof window !== 'undefined') {
      // Initialize NotificationService
      const notificationService = NotificationService.getInstance();
      
      // Just initialize but don't start services by default
      notificationService.initialize().then((granted) => {
        if (granted) {
          console.log('Notification permission granted');
        } else {
          console.log('Notification permission not granted');
        }
      });
    }
  }, []);
}
