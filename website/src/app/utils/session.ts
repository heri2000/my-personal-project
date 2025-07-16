export function getSessionId(): string | null {
  return localStorage.getItem('sessionId');
}

export function setSessionId(sessionId: string): void {
  localStorage.setItem('sessionId', sessionId);
}

export function removeSessionId(): void {
  localStorage.removeItem("sessionId");
}
