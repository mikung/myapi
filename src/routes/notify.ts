/// <reference path="../../typings.d.ts" />

import * as moment from 'moment';
import * as express from 'express';
import {Router, Request, Response} from 'express';
import * as HttpStatus from 'http-status-codes';

import * as Knex from "knex";
import {isNull} from "util";

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
            data: { message: 'msg1',messageTitle: title, messageBody: body },
            notification: {
                sound: 'default',
                title: title,
                badge : '100000',
                body: body
            }
        });
         
        // Specify which registration IDs to deliver the message to
        var regTokens = ['cj_fCSvscvc:APA91bEq6uTpWUql50Um7Y1VpZc6fq1xXjfdt0d70ziTQLbAU4Xb6VHIyyj4ddsfuDNSsYqVN_qN5rg0QrAvcjZq0MKcyhKhh4_RLmNFT1k4LCiNTj2Zxhk0O9XOXBAVbYvwq2ZAzyxL'];
         
        sender.send(message, { registrationTokens: regTokens }, function (err, response) {
            if (err) console.error(err);
            else console.log(response);
        });
        res.send({ok: true});
    } catch (error) {
        res.send({ok: false, error: error.message});
    }
});






// save new request
// router.post('/caribou_data', async (req: Request, res: Response) => {
//     let hospcode = req.body.hospcode;
//     let temperature = req.body.temperature;
//     let moisture = req.body.moisture;
//     let update_timestamp = moment().format('YYYY-MM-DD hh:mm:ss');


//     let data: any = {};
//     data.hospcode = hospcode;
//     data.temperature = temperature;
//     data.moisture = moisture;
//     data.update_timestamp = update_timestamp;
//     try {
//         let rs: any = await apiCaribouModel.saveCaribou(req.db2, data);
//         res.send({ok: true, rows: rs, code: HttpStatus.OK});
//     } catch (error) {
//         res.send({ok: false, error: error.message, code: HttpStatus.OK});
//     }

// });
// router.get('/caribou_data', async (req: Request, res: Response) => {
//     let hospcode = req.query.hospcode;
//     let temperature = req.query.temperature;
//     let moisture = req.query.moisture;
//     let update_timestamp = moment().format('YYYY-MM-DD hh:mm:ss');


//     let data: any = {};
//     data.hospcode = hospcode;
//     data.temperature = temperature;
//     data.moisture = moisture;
//     data.update_timestamp = update_timestamp;
//     try {
//         let rs: any = await apiCaribouModel.saveCaribou(req.db2, data);
//         res.send({ok: true, rows: rs, code: HttpStatus.OK});
//     } catch (error) {
//         res.send({ok: false, error: error.message, code: HttpStatus.OK});
//     }

// });
export default router;