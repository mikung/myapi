/// <reference path="../../typings.d.ts" />

import * as moment from 'moment';
import * as express from 'express';
import {Router, Request, Response} from 'express';
import * as HttpStatus from 'http-status-codes';

import {Api_hygge} from '../models/api_hygge';
import { RequestModel } from '../models/request';
import * as Knex from "knex";

const apiHyggeModel = new Api_hygge();
const requestModel = new RequestModel();
const router: Router = Router();
moment.locale('Thai');

router.get('/', async (req: Request, res: Response) => {
    let db = req.db2;
    try {
        let rows = await apiHyggeModel.getDb2(db);
        res.send({ok: true, rows: rows});
    } catch (error) {
        res.send({ok: false, error: error.message});
    }
});

router.get('/getDb2', async (req: Request, res: Response) => {
    let db = req.db2;
    // let hosname = req.query.hosname;
    try {
        let rs: any = await apiHyggeModel.getDb2(db);
        res.send({ok: true, rows: rs[0]})
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});

router.get('/getHyggeHosQue', async (req: Request, res: Response) => {
    let db = req.db2;
    // let hosname = req.query.hosname;
    try {
        let rs: any = await apiHyggeModel.getHyggeHosQue(db);
        res.send({ok: true, rows: rs[0]})
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});

router.get('/getHyggeDepartmentQue', async (req: Request, res: Response) => {
    let db = req.db2;
    let hospcode = req.query.hospcode;
    try {
        let rs: any = await apiHyggeModel.getHyggeDepartmentQue(db, hospcode);
        res.send({ok: true, rows: rs[0]})
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});

router.get('/getHyggeQueDepartment', async (req: Request, res: Response) => {
    let db = req.db2;
    let hospcode = req.query.hospcode;
    try {
        let rs: any = await apiHyggeModel.getHyggeQueDepartment(db, hospcode);
        res.send({ok: true, rows: rs[0]})
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});

router.get('/getHyggeQueDepartmentId', async (req: Request, res: Response) => {
    let db = req.db2;
    let department = req.query.department;
    try {
        let rs: any = await apiHyggeModel.getHyggeQueDepartmentId(db, department);
        res.send({ok: true, rows: rs[0]})
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});

router.get('/getHyggeQueDepartmentQue', async (req: Request, res: Response) => {
    let db = req.db2;
    let hospcode = req.query.hospcode;
    try {
        let rs: any = await apiHyggeModel.getHyggeQueDepartmentQue(db, hospcode);
        res.send({ok: true, rows: rs[0]})
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});


router.get('/getHyggeHospName', async (req: Request, res: Response) => {
    let db = req.db2;
    let hosname = req.query.hosname;
    try {
        let rs: any = await apiHyggeModel.getHyggeHospName(db, hosname);
        res.send({ok: true, rows: rs[0]})
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});

router.get('/getCountRegisterOnline', async (req: Request, res: Response) => {
    let db = req.db2;
    let department = req.query.department;
    let date = req.query.date;
    try {
        let rs: any = await apiHyggeModel.getCountRegisterOnline(db, department, date);
        res.send({ok: true, rows: rs[0]})
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});

router.get('/getDSTCF', async (req: Request, res: Response) => {
    let db = req.db2;
    let department = req.query.department;
    let date = req.query.date;
    try {
        let rs: any = await apiHyggeModel.getDSTCF(db, department);
        res.send({ok: true, rows: rs[0]})
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});

router.get('/getVSTCF', async (req: Request, res: Response) => {
    let db = req.db2;
    let department = req.query.department;
    let date = req.query.date;
    try {
        let rs: any = await apiHyggeModel.getVSTCF(db, department);
        res.send({ok: true, rows: rs[0]})
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});
router.get('/getSSTCF', async (req: Request, res: Response) => {
    let db = req.db2;
    let department = req.query.department;
    let date = req.query.date;
    try {
        let rs: any = await apiHyggeModel.getSSTCF(db, department);
        res.send({ok: true, rows: rs[0]})
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});
router.get('/getRSTCF', async (req: Request, res: Response) => {
    let db = req.db2;
    let department = req.query.department;
    let date = req.query.date;
    try {
        let rs: any = await apiHyggeModel.getRSTCF(db, department);
        res.send({ok: true, rows: rs[0]})
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});
router.get('/getDSTRQ', async (req: Request, res: Response) => {
    let db = req.db2;
    let department = req.query.department;
    let date = req.query.date;
    try {
        let rs: any = await apiHyggeModel.getDSTRQ(db, department);
        res.send({ok: true, rows: rs[0]})
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});
router.get('/getVSTRQ', async (req: Request, res: Response) => {
    let db = req.db2;
    let department = req.query.department;
    let date = req.query.date;
    try {
        let rs: any = await apiHyggeModel.getVSTRQ(db, department);
        res.send({ok: true, rows: rs[0]})
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});
router.get('/getSSTRQ', async (req: Request, res: Response) => {
    let db = req.db2;
    let department = req.query.department;

    let date = req.query.date;
    try {
        let rs: any = await apiHyggeModel.getSSTRQ(db, department);
        res.send({ok: true, rows: rs[0]})
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});
router.get('/getRSTRQ', async (req: Request, res: Response) => {
    let db = req.db2;
    let department = req.query.department;

    let date = req.query.date;
    try {
        let rs: any = await apiHyggeModel.getRSTRQ(db, department);
        res.send({ok: true, rows: rs[0]})
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});

router.get('/getAd', async (req: Request, res: Response) => {
    let db = req.db2;
    try {
        let rs: any = await requestModel.getAd(db);
        res.send({ ok: true, rows: rs[0] })
    } catch (error) {
        res.send({ ok: false, error: error.message })
    }
});

// save new request
router.post('/insque', async (req: Request, res: Response) => {
    let prefix = req.body.prefix;
    let hospcode = req.body.hospcode;
    let department = req.body.department;
    // let cid = req.decoded.cid;
    let cid = req.body.cid;
    let date_appointment = req.body.date_appointment;
    // let requestDate = moment().format('YYYY-MM-DD');
    // let requestTime = moment().format('HH:mm:ss');

    let data: any = {};
    data.prefix = prefix;
    data.qid = 0;
    data.register_point = 'appointment_online';
    data.hospcode = hospcode;
    data.status = 'RQ';
    data.department = department;
    data.cid = cid;
    data.online_register = 'Y';
    data.timestamp = date_appointment+' 08:30:00';


    try {
        // await apiHyggeModel.saveInsQue(req.db, data);
        let rs: any = await apiHyggeModel.chkQue(req.db2, department, date_appointment);
        data.qid = rs[0][0]['qid'] + 1;
        await apiHyggeModel.saveInsQue(req.db2, data);
        res.send({ok: true, rows: data, code: HttpStatus.OK});
    } catch (error) {
        res.send({ok: false, error: error.message, code: HttpStatus.OK});
    }

});
export default router;