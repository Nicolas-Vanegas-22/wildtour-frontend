import { v4 as uuidv4 } from 'uuid';

class SessionManager {
  private sessionId: string | null = null;
  private sessionStartTime: number | null = null;

  constructor() {
    this.initializeSession();
  }

  private initializeSession() {
    // Verificar si ya existe una sesión activa
    const existingSessionId = sessionStorage.getItem('session-id');
    const existingStartTime = sessionStorage.getItem('session-start-time');

    if (existingSessionId && existingStartTime) {
      this.sessionId = existingSessionId;
      this.sessionStartTime = parseInt(existingStartTime, 10);
    } else {
      this.createNewSession();
    }
  }

  private createNewSession() {
    this.sessionId = uuidv4();
    this.sessionStartTime = Date.now();

    sessionStorage.setItem('session-id', this.sessionId);
    sessionStorage.setItem('session-start-time', this.sessionStartTime.toString());
  }

  public getSessionId(): string {
    if (!this.sessionId) {
      this.createNewSession();
    }
    return this.sessionId!;
  }

  public getSessionDuration(): number {
    if (!this.sessionStartTime) {
      return 0;
    }
    return Date.now() - this.sessionStartTime;
  }

  public renewSession() {
    this.createNewSession();
  }

  public endSession() {
    this.sessionId = null;
    this.sessionStartTime = null;
    sessionStorage.removeItem('session-id');
    sessionStorage.removeItem('session-start-time');
  }

  public getSessionInfo() {
    return {
      sessionId: this.sessionId,
      startTime: this.sessionStartTime,
      duration: this.getSessionDuration(),
    };
  }
}

export const sessionManager = new SessionManager();