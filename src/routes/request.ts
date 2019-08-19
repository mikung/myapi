/// <reference path="../../typings.d.ts" />

import * as HttpStatus from 'http-status-codes';
import * as moment from 'moment';

import * as express from 'express';
import { Router, Request, Response } from 'express';

import { RequestModel } from '../models/request';

const requestModel = new RequestModel();
const router: Router = Router();
moment.locale('Thai');
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



router.get('/getDrugallergy', async (req: Request, res: Response) => {
  let db = req.db;
  let cid = req.decoded.cid;
  try {
    let rs: any = await requestModel.getAllergy(db, cid);
    res.send({ ok: true, rows: rs })
  } catch (error) {
    res.send({ ok: false, error: error.message })
  }
});

router.get('/getVisit', async (req: Request, res: Response) => {
  let db = req.db;
  let cid = req.decoded.cid;
  try {
    let rs: any = await requestModel.getVisit(db, cid);
    res.send({ ok: true, rows: rs })
  } catch (error) {
    res.send({ ok: false, error: error.message })
  }
});

router.get('/getProfile', async (req: Request, res: Response) => {
  let db = req.db;
  let cid = req.decoded.cid;
  try {
    let rs: any = await requestModel.getProfile(db, cid);
    res.send({ ok: true, rows: rs[0] })
  } catch (error) {
    res.send({ ok: false, error: error.message })
  }
});
router.get('/getAppointmentOlder', async (req: Request, res: Response) => {
  let db = req.db;
  let cid = req.decoded.cid;
  try {
    let rs: any = await requestModel.getAppointmentOlder(db, cid);
    res.send({ ok: true, rows: rs[0] })
  } catch (error) {
    res.send({ ok: false, error: error.message })
  }
});
router.get('/getAppointmentNew', async (req: Request, res: Response) => {
  let db = req.db;
  let cid = req.decoded.cid;
  try {
    let rs: any = await requestModel.getAppointmentNew(db, cid);
    res.send({ ok: true, rows: rs[0] })
  } catch (error) {
    res.send({ ok: false, error: error.message })
  }
});
router.get('/getAppointmentNew1', async (req: Request, res: Response) => {
    let db = req.db;
    let cid = req.decoded.cid;
    try {
        let rs: any = await requestModel.getAppointmentNew1(db, cid);
        res.send({ ok: true, rows: rs[0] })
    } catch (error) {
        res.send({ ok: false, error: error.message })
    }
});

router.get('/getAppointmentHospcode', async (req: Request, res: Response) => {
  let db = req.db;
  let cid = req.decoded.cid;
  try {
    let rs: any = await requestModel.getAppointmentHospcode(db, cid);
    res.send({ ok: true, rows: rs[0] })
  } catch (error) {
    res.send({ ok: false, error: error.message })
  }
});

router.get('/getHospcode', async (req: Request, res: Response) => {
    let db = req.db;
    // let cid = req.decoded.cid;
    try {
        let rs: any = await requestModel.getHospcode(db);
        res.send({ ok: true, rows: rs[0] })
    } catch (error) {
        res.send({ ok: false, error: error.message })
    }
});

router.get('/getDepartments', async (req: Request, res: Response) => {
    let db = req.db;
    let hospcode = req.query.hospcode;
    try {
        let rs: any = await requestModel.getDepartments(db,hospcode);
        res.send({ ok: true, rows: rs[0] })
    } catch (error) {
        res.send({ ok: false, error: error.message })
    }
});

router.get('/getHospcodeName', async (req: Request, res: Response) => {
    let db = req.db;
    let hosname = req.query.hosname;
    try {
        let rs: any = await requestModel.getHospcodeName(db,hosname);
        res.send({ ok: true, rows: rs[0] })
    } catch (error) {
        res.send({ ok: false, error: error.message })
    }
});

router.get('/getAd', async (req: Request, res: Response) => {
    let db = req.db2;
    let cid = req.decoded.cid;
    console.log(cid);
    try {
        let rs: any = await requestModel.getAd(db);
        res.send({ ok: true, rows: rs[0] })
    } catch (error) {
        res.send({ ok: false, error: error.message })
    }
});

router.post('/editpassword', async (req: Request, res: Response) => {
   let db = req.db;
   let cid = req.decoded.cid;
    let username: string = req.body.username;
    let oldpassword: string = req.body.oldpassword;
    let newpassword: string = req.body.newpassword;

    try{
        let rs: any = await requestModel.getOldpassword(db,cid,oldpassword);
        if(rs[0][0]['c'] > 0){
            let update:any = await requestModel.updatePassword(db,cid,newpassword);
            res.send({ok: true,rows: update});
        }else {
            res.send({ok: true,rows: 0});
        }
        // res.send({ok: true,rows: rs[0][0]['c']});
    } catch (e) {
        res.send({ok: false, error: e.message})
    }
});

// save new request
// router.post('/request', async (req: Request, res: Response) => {
//   let code = moment().format('x');
//   let cause = req.body.cause;
//   let customerId = req.decoded.id;
//   let requestDate = moment().format('YYYY-MM-DD');
//   let requestTime = moment().format('HH:mm:ss');

//   let data: any = {};
//   data.request_code = code;
//   data.request_cause = cause;
//   data.customer_id = customerId;
//   data.request_date = requestDate;
//   data.request_time = requestTime;

//   try {
//     await requestModel.saveRequest(req.db, data);
//     res.send({ ok: true, code: HttpStatus.OK });
//   } catch (error) {
//     res.send({ ok: false, error: error.message, code: HttpStatus.OK });
//   }

// });

export default router;