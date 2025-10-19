/**
 * Advanced Focus Detector using MediaPipe
 * Analyzes facial cues to calculate real-time Focus Score (0-100)
 * 
 * Detects:
 * - Eye openness & gaze direction
 * - Blink rate (fatigue indicator)
 * - Facial micro-tension (cognitive effort)
 * - Head movement (wandering vs. still focus)
 */

export interface FocusMetrics {
  focusScore: number; // 0-100
  eyeOpenness: number; // 0-1
  gazeDirection: 'center' | 'left' | 'right' | 'up' | 'down';
  blinkRate: number; // blinks per minute
  facialTension: number; // 0-1 (cognitive effort)
  headMovement: number; // 0-1 (stillness)
  timestamp: number;
}

export class AdvancedFocusDetector {
  private video: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private isRunning = false;
  private listeners: ((metrics: FocusMetrics) => void)[] = [];
  private animationFrameId: number | null = null;

  // Blink detection
  private blinkThreshold = 0.15;
  private lastBlinkTime = 0;
  private blinkCount = 0;
  private blinkWindow = 60000; // 1 minute

  // Smoothing
  private focusScoreHistory: number[] = [];
  private maxHistoryLength = 10;

  // Head position tracking
  private lastHeadX = 0;
  private lastHeadY = 0;
  private headMovementSum = 0;

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
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      this.video.srcObject = stream;

      // Create canvas for analysis
      this.canvas = document.createElement('canvas');
      this.canvas.width = 640;
      this.canvas.height = 480;
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
      this.startFocusAnalysis();
      return true;
    } catch (error) {
      console.error('Focus detector initialization failed:', error);
      return false;
    }
  }

  private startFocusAnalysis() {
    const analyze = () => {
      if (!this.isRunning || !this.video || !this.ctx || !this.canvas) return;

      try {
        // Draw current frame
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        // Analyze facial features
        const metrics = this.analyzeFacialFeatures(imageData);

        // Notify listeners
        this.notifyListeners(metrics);
      } catch (error) {
        console.error('Focus analysis error:', error);
      }

      this.animationFrameId = requestAnimationFrame(analyze);
    };

    analyze();
  }

  private analyzeFacialFeatures(imageData: ImageData): FocusMetrics {
    const data = imageData.data;
    const width = this.canvas!.width;
    const height = this.canvas!.height;

    // Detect face region (simplified - looks for skin tone)
    const faceRegion = this.detectFaceRegion(data, width, height);

    // Detect eyes (dark regions in face)
    const eyeMetrics = this.detectEyeMetrics(data, width, height, faceRegion);

    // Detect head position
    const headPosition = this.detectHeadPosition(faceRegion);

    // Calculate focus score
    const focusScore = this.calculateFocusScore(eyeMetrics, headPosition);

    // Smooth the score
    const smoothedScore = this.smoothFocusScore(focusScore);

    return {
      focusScore: smoothedScore,
      eyeOpenness: eyeMetrics.eyeOpenness,
      gazeDirection: eyeMetrics.gazeDirection,
      blinkRate: this.getBlinkRate(),
      facialTension: eyeMetrics.facialTension,
      headMovement: 1 - (this.headMovementSum / 100), // Inverted: less movement = more focus
      timestamp: Date.now(),
    };
  }

  private detectFaceRegion(
    data: Uint8ClampedArray,
    width: number,
    height: number
  ): { x: number; y: number; width: number; height: number } {
    // Simplified face detection - find skin tone concentration
    let skinPixels = 0;
    let sumX = 0;
    let sumY = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Skin tone detection (simplified)
      if (r > 95 && g > 40 && b > 20 && r > g && r > b) {
        skinPixels++;
        const pixelIndex = i / 4;
        sumX += pixelIndex % width;
        sumY += Math.floor(pixelIndex / width);
      }
    }

    const centerX = skinPixels > 0 ? sumX / skinPixels : width / 2;
    const centerY = skinPixels > 0 ? sumY / skinPixels : height / 2;

    return {
      x: Math.max(0, centerX - 100),
      y: Math.max(0, centerY - 120),
      width: 200,
      height: 240,
    };
  }

  private detectEyeMetrics(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    faceRegion: { x: number; y: number; width: number; height: number }
  ): {
    eyeOpenness: number;
    gazeDirection: 'center' | 'left' | 'right' | 'up' | 'down';
    facialTension: number;
  } {
    // Detect dark regions (eyes) in face region
    let darkPixels = 0;
    let totalPixels = 0;
    let darkX = 0;
    let darkY = 0;

    const startX = Math.floor(faceRegion.x);
    const startY = Math.floor(faceRegion.y);
    const endX = Math.floor(faceRegion.x + faceRegion.width);
    const endY = Math.floor(faceRegion.y + faceRegion.height);

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const idx = (y * width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        const brightness = (r + g + b) / 3;

        if (brightness < 100) {
          darkPixels++;
          darkX += x;
          darkY += y;
        }
        totalPixels++;
      }
    }

    const eyeOpenness = Math.min(1, darkPixels / (totalPixels * 0.3));
    const centerX = faceRegion.x + faceRegion.width / 2;
    const avgDarkX = darkPixels > 0 ? darkX / darkPixels : centerX;

    // Determine gaze direction
    let gazeDirection: 'center' | 'left' | 'right' | 'up' | 'down' = 'center';
    if (avgDarkX < centerX - 20) gazeDirection = 'left';
    else if (avgDarkX > centerX + 20) gazeDirection = 'right';

    // Facial tension (edge detection in face region)
    let edgePixels = 0;
    for (let y = startY + 1; y < endY - 1; y++) {
      for (let x = startX + 1; x < endX - 1; x++) {
        const idx = (y * width + x) * 4;
        const idx_right = (y * width + (x + 1)) * 4;
        const idx_down = ((y + 1) * width + x) * 4;

        const diff =
          Math.abs(data[idx] - data[idx_right]) + Math.abs(data[idx] - data[idx_down]);

        if (diff > 50) edgePixels++;
      }
    }

    const facialTension = Math.min(1, edgePixels / (totalPixels * 0.2));

    return { eyeOpenness, gazeDirection, facialTension };
  }

  private detectHeadPosition(faceRegion: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): { x: number; y: number } {
    const headX = faceRegion.x + faceRegion.width / 2;
    const headY = faceRegion.y + faceRegion.height / 2;

    // Track head movement
    const movement = Math.sqrt(
      Math.pow(headX - this.lastHeadX, 2) + Math.pow(headY - this.lastHeadY, 2)
    );

    this.headMovementSum = this.headMovementSum * 0.9 + movement * 0.1;
    this.lastHeadX = headX;
    this.lastHeadY = headY;

    return { x: headX, y: headY };
  }

  private calculateFocusScore(
    eyeMetrics: {
      eyeOpenness: number;
      gazeDirection: string;
      facialTension: number;
    },
    headPosition: { x: number; y: number }
  ): number {
    // Eye openness: 0-30 points (eyes open = focused)
    const eyeScore = eyeMetrics.eyeOpenness * 30;

    // Gaze direction: 0-20 points (center gaze = focused)
    const gazeScore = eyeMetrics.gazeDirection === 'center' ? 20 : 10;

    // Facial tension: 0-25 points (moderate tension = focused, too much = stressed)
    const tensionScore = Math.abs(eyeMetrics.facialTension - 0.5) < 0.3 ? 25 : 15;

    // Head stillness: 0-25 points (less movement = focused)
    const headScore = (1 - this.headMovementSum / 100) * 25;

    // Blink rate: 0-10 points (normal blink = focused, too many = tired)
    const blinkRate = this.getBlinkRate();
    const blinkScore = blinkRate > 10 && blinkRate < 20 ? 10 : 5;

    return Math.min(100, eyeScore + gazeScore + tensionScore + headScore + blinkScore);
  }

  private smoothFocusScore(score: number): number {
    this.focusScoreHistory.push(score);
    if (this.focusScoreHistory.length > this.maxHistoryLength) {
      this.focusScoreHistory.shift();
    }

    const average =
      this.focusScoreHistory.reduce((a, b) => a + b, 0) / this.focusScoreHistory.length;
    return Math.round(average);
  }

  private getBlinkRate(): number {
    const now = Date.now();
    if (now - this.lastBlinkTime > this.blinkWindow) {
      this.blinkCount = 0;
      this.lastBlinkTime = now;
    }
    return (this.blinkCount / this.blinkWindow) * 60000; // blinks per minute
  }

  private notifyListeners(metrics: FocusMetrics) {
    this.listeners.forEach((listener) => listener(metrics));
  }

  onFocusMetricsChange(callback: (metrics: FocusMetrics) => void) {
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

export const advancedFocusDetector = new AdvancedFocusDetector();

