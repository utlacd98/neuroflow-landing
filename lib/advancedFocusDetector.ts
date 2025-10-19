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

  // Improved blink detection
  private blinkThreshold = 0.2; // Increased sensitivity
  private eyeClosureFrames = 0; // Track consecutive closed frames
  private minBlinkFrames = 2; // Minimum frames for valid blink
  private maxBlinkFrames = 15; // Maximum frames for valid blink
  private lastBlinkTime = 0;
  private blinkCount = 0;
  private blinkWindowStart = Date.now(); // Track window start time
  private blinkWindow = 60000; // 1 minute
  private blinkCooldown = 200; // ms between blinks
  private eyeOpenHistory: number[] = [];
  private blinkTimestamps: number[] = []; // Track individual blink times
  private lastLoggedBlinkRate = 0; // For debug logging

  // Exponential smoothing
  private smoothedFocusScore = 50;
  private smoothingFactor = 0.15; // 0-1, lower = more smoothing
  private focusScoreHistory: number[] = [];
  private maxHistoryLength = 5; // Reduced for faster response

  // Head position tracking
  private lastHeadX = 0;
  private lastHeadY = 0;
  private headMovementSum = 0;
  private headMovementHistory: number[] = [];
  private maxHeadHistoryLength = 10;

  // Performance optimization
  private frameCount = 0;
  private analysisInterval = 2; // Analyze every 2nd frame (30 FPS → 15 FPS analysis)
  private cachedFaceRegion: { x: number; y: number; width: number; height: number } | null = null;
  private faceRegionUpdateInterval = 10; // Update face region every 10 frames

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

        // Analyze every Nth frame for performance
        if (this.frameCount % this.analysisInterval === 0) {
          // Analyze facial features
          const metrics = this.analyzeFacialFeatures(imageData);

          // Notify listeners
          this.notifyListeners(metrics);
        }

        this.frameCount++;
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

    // Update face region periodically (cache for performance)
    if (this.frameCount % this.faceRegionUpdateInterval === 0) {
      this.cachedFaceRegion = this.detectFaceRegion(data, width, height);
    }

    const faceRegion = this.cachedFaceRegion || this.detectFaceRegion(data, width, height);

    // Detect eyes (dark regions in face)
    const eyeMetrics = this.detectEyeMetrics(data, width, height, faceRegion);

    // Track eye openness for blink detection
    this.eyeOpenHistory.push(eyeMetrics.eyeOpenness);
    if (this.eyeOpenHistory.length > 30) {
      this.eyeOpenHistory.shift();
    }

    // Debug: Log eye openness periodically
    if (this.frameCount % 30 === 0) {
      const avgEyeOpenness = this.eyeOpenHistory.length > 0
        ? (this.eyeOpenHistory.reduce((a, b) => a + b) / this.eyeOpenHistory.length).toFixed(2)
        : '0.00';
      console.log(`👁️ Eye openness: ${eyeMetrics.eyeOpenness.toFixed(2)} (avg: ${avgEyeOpenness}), Threshold: ${this.blinkThreshold}, Closure frames: ${this.eyeClosureFrames}`);
    }

    // Detect blinks
    this.detectBlinks(eyeMetrics.eyeOpenness);

    // Detect head position
    const headPosition = this.detectHeadPosition(faceRegion);

    // Calculate focus score
    const focusScore = this.calculateFocusScore(eyeMetrics, headPosition);

    // Apply exponential smoothing
    const smoothedScore = this.exponentialSmoothing(focusScore);

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
    // Detect dark regions (eyes) in face region - focus on upper half where eyes are
    let darkPixels = 0;
    let totalPixels = 0;
    let darkX = 0;
    let darkY = 0;

    const startX = Math.floor(faceRegion.x);
    const startY = Math.floor(faceRegion.y);
    const endX = Math.floor(faceRegion.x + faceRegion.width);
    // Focus on upper half of face where eyes are
    const endY = Math.floor(faceRegion.y + faceRegion.height * 0.5);

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const idx = (y * width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        const brightness = (r + g + b) / 3;

        // More sensitive threshold for detecting closed eyes
        if (brightness < 120) {
          darkPixels++;
          darkX += x;
          darkY += y;
        }
        totalPixels++;
      }
    }

    // Improved eye openness calculation - more sensitive to changes
    const eyeOpenness = Math.min(1, Math.max(0, (darkPixels / (totalPixels * 0.25)) - 0.2));
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

  /**
   * Exponential smoothing for focus score
   * Eliminates jitter while maintaining responsiveness
   */
  private exponentialSmoothing(rawScore: number): number {
    // Apply exponential smoothing: smoothed = α * raw + (1 - α) * previous
    this.smoothedFocusScore =
      this.smoothingFactor * rawScore + (1 - this.smoothingFactor) * this.smoothedFocusScore;

    return Math.round(this.smoothedFocusScore);
  }

  /**
   * Improved blink detection with temporal tracking
   * Detects eye closure patterns to identify actual blinks
   */
  private detectBlinks(eyeOpenness: number) {
    const now = Date.now();

    // Check if eyes are closed (below threshold)
    if (eyeOpenness < this.blinkThreshold) {
      this.eyeClosureFrames++;
    } else {
      // Eyes opened - check if we had a valid blink
      if (
        this.eyeClosureFrames >= this.minBlinkFrames &&
        this.eyeClosureFrames <= this.maxBlinkFrames &&
        now - this.lastBlinkTime > this.blinkCooldown
      ) {
        this.blinkCount++;
        this.blinkTimestamps.push(now);
        this.lastBlinkTime = now;

        // Debug: Log blink detection
        const blinkRate = this.getBlinkRate();
        if (Math.abs(blinkRate - this.lastLoggedBlinkRate) > 0.5) {
          console.log(`🧠 Blink detected! Frames closed: ${this.eyeClosureFrames}, Blink rate: ${blinkRate.toFixed(1)}/min, Total blinks: ${this.blinkTimestamps.length}`);
          this.lastLoggedBlinkRate = blinkRate;
        }

        // Keep only blinks within the window
        this.blinkTimestamps = this.blinkTimestamps.filter(
          (timestamp) => now - timestamp < this.blinkWindow
        );
      }
      this.eyeClosureFrames = 0;
    }
  }

  private getBlinkRate(): number {
    const now = Date.now();

    // Remove old blinks outside the window
    this.blinkTimestamps = this.blinkTimestamps.filter(
      (timestamp) => now - timestamp < this.blinkWindow
    );

    // Calculate blinks per minute based on actual timestamps
    const blinkCount = this.blinkTimestamps.length;

    // Return blinks per minute (scale from 60-second window)
    return blinkCount;
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

