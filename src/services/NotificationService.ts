
export class NotificationService {
  private static instance: NotificationService;
  private permissionGranted = false;
  private notificationInterval: number | null = null;
  private motionTimeout: number | null = null;
  private lastMovementTimestamp = Date.now();
  private accelerometerWatchId: number | null = null;

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public async initialize(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      this.permissionGranted = true;
      return true;
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      this.permissionGranted = permission === "granted";
      return this.permissionGranted;
    }

    return false;
  }

  public startWorkoutReminders(): void {
    if (!this.permissionGranted) return;
    
    // Clear any existing interval
    if (this.notificationInterval) {
      clearInterval(this.notificationInterval);
    }
    
    // Set up hourly workout reminders
    this.notificationInterval = window.setInterval(() => {
      this.sendNotification(
        "Workout Reminder", 
        "Take a few minutes to stretch or do a quick workout!"
      );
    }, 60 * 60 * 1000); // Every hour
  }

  public stopWorkoutReminders(): void {
    if (this.notificationInterval) {
      clearInterval(this.notificationInterval);
      this.notificationInterval = null;
    }
  }

  public startMovementDetection(): void {
    if (!this.permissionGranted) return;
    
    // Check if DeviceMotionEvent is available
    if (typeof DeviceMotionEvent !== 'undefined' && 
        typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      
      (DeviceMotionEvent as any).requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            this.setupAccelerometer();
          }
        })
        .catch(console.error);
    } else if (typeof DeviceMotionEvent !== 'undefined') {
      // For browsers that don't require permission
      this.setupAccelerometer();
    } else {
      console.log("Device motion not supported");
    }
    
    // Set up inactivity check
    this.checkInactivity();
  }

  public stopMovementDetection(): void {
    if (this.motionTimeout) {
      clearTimeout(this.motionTimeout);
      this.motionTimeout = null;
    }
    
    if (this.accelerometerWatchId !== null && window.removeEventListener) {
      window.removeEventListener('devicemotion', this.handleMotion);
    }
  }

  private setupAccelerometer(): void {
    this.lastMovementTimestamp = Date.now();
    
    // Add event listener for device motion
    window.addEventListener('devicemotion', this.handleMotion);
  }

  private handleMotion = (event: DeviceMotionEvent): void => {
    const acceleration = event.acceleration;
    
    if (!acceleration) return;
    
    // Check if there's significant movement
    const movementThreshold = 1.0; // m/s²
    const totalAcceleration = Math.sqrt(
      (acceleration.x || 0) ** 2 + 
      (acceleration.y || 0) ** 2 + 
      (acceleration.z || 0) ** 2
    );
    
    if (totalAcceleration > movementThreshold) {
      this.lastMovementTimestamp = Date.now();
    }
  };

  private checkInactivity(): void {
    const inactivityThreshold = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
    
    this.motionTimeout = window.setTimeout(() => {
      const currentTime = Date.now();
      const timeSinceLastMovement = currentTime - this.lastMovementTimestamp;
      
      if (timeSinceLastMovement > inactivityThreshold) {
        this.sendNotification(
          "Movement Reminder", 
          "You've been inactive for a while. Time to stretch and move around!"
        );
        this.lastMovementTimestamp = currentTime; // Reset the timer
      }
      
      // Continue checking
      this.checkInactivity();
    }, 10 * 60 * 1000); // Check every 10 minutes
  }

  private sendNotification(title: string, body: string): void {
    if (!this.permissionGranted) return;
    
    const options = {
      body,
      icon: '/favicon.ico',
      vibrate: [100, 50, 100]
    };
    
    new Notification(title, options);
  }
}
