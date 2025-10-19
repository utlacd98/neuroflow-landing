/**
 * Camera Motion Detector
 * Uses device camera to detect motion and movement for real-time focus tracking
 */

export interface MotionData {
  motionLevel: number; // 0-1 (1 = high motion)
  movementIntensity: number; // 0-100
  isMoving: boolean;
  timestamp: number;
}

export class CameraMotionDetector {
  private video: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private previousFrame: ImageData | null = null;
  private isRunning = false;
  private motionThreshold = 30; // Pixel difference threshold
  private listeners: ((data: MotionData) => void)[] = [];
  private animationFrameId: number | null = null;

  async initialize(): Promise<boolean> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log('Camera API not available');
        return false;
      }

      // Create video element
      this.video = document.createElement('video');
      this.video.setAttribute('playsinline', 'true');
      this.video.setAttribute('autoplay', 'true');
      this.video.setAttribute('muted', 'true');

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 320 },
          height: { ideal: 240 },
        },
        audio: false,
      });

      this.video.srcObject = stream;

      // Create canvas for motion detection
      this.canvas = document.createElement('canvas');
      this.canvas.width = 320;
      this.canvas.height = 240;
      this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

      if (!this.ctx) {
        throw new Error('Could not get canvas context');
      }

      // Wait for video to load
      await new Promise((resolve) => {
        this.video!.onloadedmetadata = () => {
          this.video!.play();
          resolve(true);
        };
      });

      this.isRunning = true;
      this.startMotionDetection();
      return true;
    } catch (error) {
      console.error('Camera initialization failed:', error);
      return false;
    }
  }

  private startMotionDetection() {
    const detectMotion = () => {
      if (!this.isRunning || !this.video || !this.ctx || !this.canvas) return;

      try {
        // Draw current frame
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        const currentFrame = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        let motionPixels = 0;

        if (this.previousFrame) {
          const currentData = currentFrame.data;
          const previousData = this.previousFrame.data;

          // Compare frames pixel by pixel
          for (let i = 0; i < currentData.length; i += 4) {
            const rDiff = Math.abs(currentData[i] - previousData[i]);
            const gDiff = Math.abs(currentData[i + 1] - previousData[i + 1]);
            const bDiff = Math.abs(currentData[i + 2] - previousData[i + 2]);

            const avgDiff = (rDiff + gDiff + bDiff) / 3;

            if (avgDiff > this.motionThreshold) {
              motionPixels++;
            }
          }
        }

        // Calculate motion level (0-1)
        const totalPixels = this.canvas.width * this.canvas.height;
        const motionLevel = Math.min(1, motionPixels / (totalPixels * 0.1)); // Normalize
        const movementIntensity = Math.round(motionLevel * 100);

        // Notify listeners
        this.notifyListeners({
          motionLevel,
          movementIntensity,
          isMoving: motionLevel > 0.1,
          timestamp: Date.now(),
        });

        this.previousFrame = currentFrame;
      } catch (error) {
        console.error('Motion detection error:', error);
      }

      this.animationFrameId = requestAnimationFrame(detectMotion);
    };

    detectMotion();
  }

  private notifyListeners(data: MotionData) {
    this.listeners.forEach((listener) => listener(data));
  }

  onMotionDetected(callback: (data: MotionData) => void) {
    this.listeners.push(callback);
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.video && this.video.srcObject) {
      const tracks = (this.video.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
  }

  isActive(): boolean {
    return this.isRunning;
  }
}

export const cameraMotionDetector = new CameraMotionDetector();

