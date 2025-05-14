// import { client } from '@/app/api/client';
// import { config } from "./config";

export function getSessionId(): string | null {
  return localStorage.getItem('sessionId');
}

export function setSessionId(sessionId: string): void {
  localStorage.setItem('sessionId', sessionId);
}

export function removeSessionId(): void {
  localStorage.removeItem("sessionId");
}

// export async function getSessionData(sessionId: string): Promise<SessionData | null> {
//   try {
//     const response = await client.get(
//       `${config.api.user}/session-data?sessionId=${sessionId}`
//     );
//     return {
//       userId: response.data.data.user_id,
//       email: response.data.data.email,
//       displayName: response.data.data.display_name,
//       role: response.data.data.role,
//       shouldChangePwd: response.data.data.should_change_pwd === 1,
//       validUntil: new Date(response.data.data.valid_until),
//     };
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// }

// export interface SessionData {
//   userId: string;
//   email: string;
//   displayName: string;
//   role: string;
//   shouldChangePwd: boolean;
//   validUntil: Date;
// }
