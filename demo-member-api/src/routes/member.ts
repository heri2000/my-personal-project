import express, { Request, Response } from 'express';
export const memberRoute = express.Router();
import {
  template,
  upload,
  prepareSampleData,
  importProgress,
  exportMember,
  exportProgress,
  downloadExportedFile,
  memberList,
  memberCount,
  addNewMember,
  updateMember,
  deleteMember,
} from "../handlers/member";

memberRoute.get('/template', (req: Request, res: Response) => {
  template(req, res);
});

memberRoute.post('/upload', (req: Request, res: Response) => {
  upload(req, res);
});

memberRoute.get('/prepare-sample', (req: Request, res: Response) => {
  prepareSampleData(req, res);
});

memberRoute.get('/import-progress-percent/:uploadId', (req: Request, res: Response) => {
  importProgress(req, res);
});

memberRoute.get('/export', (req: Request, res: Response) => {
  exportMember(req, res);
});

memberRoute.get('/export-progress-percent/:exportId', (req: Request, res: Response) => {
  exportProgress(req, res);
});

memberRoute.get('/download-exported-file/:exportId', (req: Request, res: Response) => {
  downloadExportedFile(req, res);
});

memberRoute.get('/list', (req: Request, res: Response) => {
  memberList(req, res);
});

memberRoute.get('/count', (req: Request, res: Response) => {
  memberCount(req, res);
});

memberRoute.post('/', (req: Request, res: Response) => {
  addNewMember(req, res);
});

memberRoute.put('/', (req: Request, res: Response) => {
  updateMember(req, res);
});

memberRoute.delete('/:id', (req: Request, res: Response) => {
  deleteMember(req, res);
});

memberRoute.get('/count', (req: Request, res: Response) => {
  memberCount(req, res);
});
