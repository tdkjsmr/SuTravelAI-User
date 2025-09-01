// types/recorder.d.ts
type AudioErrorCallback = (error: { errCode: number; errMsg: string }) => void;
type FrameRecordedCallback = (payload: { frameBuffer: ArrayBuffer; isLastFrame: boolean }) => void;

interface RecorderManager {
  onError(callback: AudioErrorCallback): void;
  onFrameRecorded(callback: FrameRecordedCallback): void;
  start(config: {
    sampleRate?: number;
    numberOfChannels?: number;
    format?: string;
    frameSize?: number;
  }): Promise<void>;
  stop(): void;
}

interface StartConfig {
  sampleRate?: number;
  numberOfChannels?: number;
  format?: string;
  frameSize?: number;
}