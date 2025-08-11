export class WorkflowOrchestrator {
  private isRunning = false;
  private startTime?: Date;

  async start(): Promise<void> {
    if (this.isRunning) {return;}
    
    this.startTime = new Date();
    this.isRunning = true;
    console.log("워크플로우 시작");
  }

  getSystemStatus() {
    return {
      orchestrator: {
        isRunning: this.isRunning,
        uptime: this.getUptime(),
        startTime: this.startTime
      }
    };
  }

  private getUptime(): number {
    if (!this.startTime) {return 0;}
    return Math.floor((Date.now() - this.startTime.getTime()) / 1000);
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    this.startTime = undefined;
  }
}

export const workflowOrchestrator = new WorkflowOrchestrator();
