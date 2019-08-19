/// <reference path="../../typings.d.ts" />

import * as moment from 'moment';
import * as express from 'express';
import {Router, Request, Response} from 'express';
import * as HttpStatus from 'http-status-codes';

import {Api_caribou} from '../models/api_caribou';
import * as Knex from "knex";
import {isNull} from "util";

const apiCaribouModel = new Api_caribou();
const router: Router = Router();
moment.locale('Thai');

router.get('/', async (req: Request, res: Response) => {

    console.log("data 222");

    try {

        console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
        res.send({ok: true, rows: 'Hello Caribou'});
    } catch (error) {
        res.send({ok: false, error: error.message});
    }
});






// save new request
router.post('/caribou_data', async (req: Request, res: Response) => {
    let hospcode = req.body.hospcode;
    let temperature = req.body.temperature;
    let moisture = req.body.moisture;
    let station = req.body.station;
    let update_timestamp = moment().format('YYYY-MM-DD HH:mm:ss');


    let data: any = {};
    data.hospcode = hospcode;
    data.temperature = temperature;
    data.moisture = moisture;
    data.station = station;
    data.update_timestamp = update_timestamp;
    try {
        let rs: any = await apiCaribouModel.saveCaribou(req.db2, data);
        res.send({ok: true, rows: rs, code: HttpStatus.OK});
    } catch (error) {
        res.send({ok: false, error: error.message, code: HttpStatus.OK});
    }

});
router.get('/caribou_data', async (req: Request, res: Response) => {
    let hospcode = req.query.hospcode;
    let temperature = req.query.temperature;
    let moisture = req.query.moisture;
    let station = req.query.station;
    let update_timestamp = moment().format('YYYY-MM-DD HH:mm:ss');


    console.log('time');
    let data: any = {};
    data.hospcode = hospcode;
    data.temperature = temperature;
    data.moisture = moisture;
    data.station = station;
    data.update_timestamp = update_timestamp;
    try {
        let rs: any = await apiCaribouModel.saveCaribou(req.db2, data);
        res.send({ok: true, rows: rs, code: HttpStatus.OK});
    } catch (error) {
        res.send({ok: false, error: error.message, code: HttpStatus.OK});
    }

});
export default router;