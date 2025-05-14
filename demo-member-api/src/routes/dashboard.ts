import express, { Request, Response } from 'express';
import { getDashboardStatistics, getUpcomingBirthdays } from '../handlers/dashboard';
export const dashboardRoute = express.Router();

dashboardRoute.get('/statistics', (req: Request, res: Response) => {
  getDashboardStatistics(req, res);
});

dashboardRoute.get('/upcoming-birthdays/:days', (req: Request, res: Response) => {
  getUpcomingBirthdays(req, res);
})
