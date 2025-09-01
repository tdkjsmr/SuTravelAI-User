// utils/recorder.ts
class WebRecorderManager implements RecorderManager {
  private mediaRecorder: MediaRecorder | null = null;
  private errorCallbacks: AudioErrorCallback[] = [];
  private frameCallbacks: FrameRecordedCallback[] = [];
  private stream: MediaStream | null = null;
  private frameSize: number = 0;
  private chunks: Blob[] = [];

  async start(config: StartConfig = {}): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options: MediaRecorderOptions = {
        audioBitsPerSecond: config.sampleRate ? config.sampleRate * 1000 : 64000,
      };

      if (config.frameSize) {
        this.frameSize = config.frameSize;
      }

      this.mediaRecorder = new MediaRecorder(this.stream, options);

      this.mediaRecorder.ondataavailable = (event) => {
        this.handleDataAvailable(event.data);
      };

      this.mediaRecorder.start(config.frameSize ? config.frameSize : 1000);
    } catch (error) {
      this.handleError(1001, "录音权限获取失败");
    }
  }

  stop(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.mediaRecorder = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  onError(callback: AudioErrorCallback): void {
    this.errorCallbacks.push(callback);
  }

  onFrameRecorded(callback: FrameRecordedCallback): void {
    this.frameCallbacks.push(callback);
  }

  private async handleDataAvailable(data: Blob): Promise<void> {
    this.chunks.push(data);
    
    if (this.frameSize > 0) {
      const arrayBuffer = await data.arrayBuffer();
      this.frameCallbacks.forEach(cb => cb({
        frameBuffer: arrayBuffer,
        isLastFrame: false
      }));
    }
  }

  private handleError(code: number, msg: string): void {
    this.errorCallbacks.forEach(cb => cb({ errCode: code, errMsg: msg }));
  }
}

let recorderInstance: RecorderManager | null = null;

export const getRecorderManager = (): RecorderManager => {
  if (!recorderInstance) {
    recorderInstance = new WebRecorderManager();
  }
  return recorderInstance;
};