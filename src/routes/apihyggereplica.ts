/// <reference path="../../typings.d.ts" />

import * as moment from 'moment';
import * as express from 'express';
import {Router, Request, Response} from 'express';
import * as HttpStatus from 'http-status-codes';

import {Api_hygge_replica} from '../models/api_hygge_replica';
import * as Knex from "knex";

const apiHyggeReplicaModel = new Api_hygge_replica();
const router: Router = Router();
moment.locale('Thai');
router.get('/', async (req: Request, res: Response) => {
    let db = req.db3;
    try {
        let rows = await apiHyggeReplicaModel.getDb2(db);
        res.send({ok: true, rows: rows});
    } catch (error) {
        res.send({ok: false, error: error.message});
    }
});

router.get('/getEst', async (req: Request, res: Response) => {
    let db = req.db3;
    let department = req.query.department;
    try {
        let rs: any = await apiHyggeReplicaModel.getEst(db, department);
        res.send({ok: true, rows: rs[0]})
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});

router.get('/getRqandcf', async (req: Request, res: Response) => {
    let db = req.db3;
    let department = req.query.department;
    try {
        let rs: any = await apiHyggeReplicaModel.getRqandcf(db, department);
        res.send({ok: true, rows: rs[0]})
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});

router.post('/loginstaff', async (req: Request, res: Response) => {
    let db = req.db3;
    let username: string = req.body.username;
    let password: string = req.body.password;
    try {
        let rs: any = await apiHyggeReplicaModel.doLoginstaff(db, username, password);
        res.send({ok: true, rows: rs})
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});

router.get('/chkQueueHygge', async (req: Request, res: Response) => {
    let db = req.db3;
    let cid = req.query.cid;
    try {
        let rs: any = await apiHyggeReplicaModel.chkQueueHygge(db, cid);
        res.send({ok: true, rows: rs[0]})
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});


export default router;