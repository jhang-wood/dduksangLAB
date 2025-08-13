export class ContentWorker {
  private _worker?: any; // 언더스코어 추가로 미사용 변수 표시
  private cache = new Map();
  private isRunning = false;

  constructor() {
    // Suppress unused variable warning
    void this._worker;
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
  }

  async requestContentGeneration(count: number = 3): Promise<string | null> {
    return `job-id-${Date.now()}`;
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      cacheSize: this.cache.size,
    };
  }

  async stop(): Promise<void> {
    this.isRunning = false;
  }
}

export const contentWorker = new ContentWorker();
