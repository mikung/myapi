/// <reference path="../../typings.d.ts" />

import * as HttpStatus from 'http-status-codes';
import * as moment from 'moment';
import * as multer from 'multer';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as fse from 'fs-extra';

import * as express from 'express';
import { Router, Request, Response } from 'express';

import { RequestModel } from '../models/request';

const requestModel = new RequestModel();
const router: Router = Router();
moment.locale('Thai');

// const uploadDir = './uploads';
// fse.ensureDirSync(uploadDir);
router.get('/getAppoint', async (req: Request, res: Response) => {
  let db = req.db;
  let cid = req.decoded.cid;
  try {
    let rs: any = await requestModel.getAppointment(db, cid);
    res.send({ ok: true, rows: rs })
  } catch (error) {
    res.send({ ok: false, error: error.message })
  }
});





export default router;
