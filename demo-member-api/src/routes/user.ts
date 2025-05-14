import express, { Request, Response } from 'express';
export const userRoute = express.Router();
import { login, logout, getSessionData, getChallenge } from '../handlers/user';

userRoute.post('/login', (req: Request, res: Response) => {
  login(req, res);
});

userRoute.get('/logout/:sessionId', (req: Request, res: Response) => {
  logout(req, res);
});

userRoute.get('/session-data/:sessionId', (req: Request, res: Response) => {
  getSessionData(req, res);
});

userRoute.get('/challenge', (req: Request, res: Response) => {
  getChallenge(req, res);
});
