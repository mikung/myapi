/// <reference path="../../typings.d.ts" />

import * as moment from 'moment';
import * as express from 'express';
import { Router, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';

import { Api_notify } from '../models/api_notify';

import * as Knex from "knex";
import { isNull } from "util";

const apiNotifyModel = new Api_notify();
const router: Router = Router();
var gcm = require('node-gcm');
moment.locale('Thai');
router.get('/', async (req: Request, res: Response) => {
    let hospcode = req.query.hospcode;
    let title = req.query.title;
    let body = req.query.body;
    try {
        var sender = new gcm.Sender(process.env.FMC_KEY);
        var message = new gcm.Message({
            contentAvailable: true,
            data: { message: 'msg1', messageTitle: title, messageBody: body },
            notification: {
                sound: 'default',
                title: title,
                badge: '1',
                body: body
            }
        });
        console.log(title);

        // Specify which registration IDs to deliver the message to
        var regTokens = ['cj_fCSvscvc:APA91bEq6uTpWUql50Um7Y1VpZc6fq1xXjfdt0d70ziTQLbAU4Xb6VHIyyj4ddsfuDNSsYqVN_qN5rg0QrAvcjZq0MKcyhKhh4_RLmNFT1k4LCiNTj2Zxhk0O9XOXBAVbYvwq2ZAzyxL'];

        sender.send(message, { registrationTokens: regTokens }, function (err, response) {
            if (err) console.error('errr' + err);
            else console.log('response : ' + response);
        });
        res.send({ ok: true });
    } catch (error) {
        res.send({ ok: false, error: error.message });
    }
});

router.post('/mobile_que', async (req: Request, res: Response) => {
    let hospcode = req.body.hospcode;
    let title = req.body.title;
    let body = req.body.body;
    let cid = req.body.cid;
    try {

        let rs: any = await apiNotifyModel.getDeviceToken(req.db, cid);
        console.log(rs);
        // Specify which registration IDs to deliver the message to
        if (rs[0]['device_token'] != null) {
            var sender = new gcm.Sender(process.env.FMC_KEY);

            var message = new gcm.Message({
                contentAvailable: true,
                data: { message: 'msg1', messageTitle: title, messageBody: body },
                notification: {
                    sound: 'default',
                    title: title,
                    badge: '1',
                    body: body
                }
            });
            console.log(title);
            var regTokens = [rs[0]['device_token']];
            console.log(regTokens);
            sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                if (err) console.error('errr' + err);
                else console.log('response : ' + response);
            });
            res.send({ ok: true });
        } else {
            console.log('no device token');
            res.send({ ok: true, rows: 'no device token' });
        }

    } catch (error) {
        res.send({ ok: false, error: error.message });
    }
});

router.post('/mqtt', async (req: Request, res: Response) => {
    var department = req.body.department;

    try {
        var topic = `hygge/department/${department}`;
        req.mqttClient.publish(topic, '&STATUS=Complete', { qos: 0, retain: false });
        res.send({ ok: true });
    } catch (error) {
        console.log(error);
        res.send({ ok: false, message: error.message })
    }
});




export default router;