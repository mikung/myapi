/// <reference path="../../typings.d.ts" />

import * as moment from 'moment';
import * as express from 'express';
import {Router, Request, Response} from 'express';
import * as HttpStatus from 'http-status-codes';

import {Api_hygge} from '../models/api_hygge';
import * as Knex from "knex";
import {isNull} from "util";

const apiHyggeModel = new Api_hygge();
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


router.post('/gethosname', async (req: Request, res: Response) => {
    let db = req.db2;
    let hospcode = req.body.hospcode;
    try {
        let rows = await apiHyggeModel.gethosname(db, hospcode);
        res.send({ok: true, rows: rows[0][0]['name']});
    } catch (error) {
        res.send({ok: false, error: error.message});
    }
});

router.post('/checkauthen1', async (req: Request, res: Response) => {
    // let db = req.db2;
    let macaddress = req.body.macaddress;
    let computername = req.body.computername;
    let hospcode = req.body.hospcode1;
    let passcode = req.body.passcode;

    try {
        // let rs: any = await apiHyggeModel.getDb2(db);
        // res.send({ok: true, rows: rs[0]})
        if (macaddress && computername && hospcode && passcode) {
            if (hospcode == '10677' && passcode == '99999') {
                res.send({ok: 'Y'});
                // if(computername == 'com1'){
                //     res.send({ok:'Y'});
                // }else{
                //     res.send({ok:'N'});
                // }
            } else if (hospcode == '10678' && passcode == '99999') {
                res.send({ok: 'N'});
            } else if (hospcode == '10679' && passcode == '99999') {
                res.send({ok: 'X'});
            } else {
                res.send({ok: 'errror'});
            }
        } else {
            res.send({ok: 'errror'});
        }
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});

router.post('/checkauthen', async (req: Request, res: Response) => {
    let db = req.db2;
    let macaddress = req.body.macaddress;
    let computername = req.body.computername;
    let hospcode = req.body.hospcode;
    var datenow = moment().format('YYYY-MM-DD');
    var datetimenow = moment().format('YYYY-MM-DD HH:mm:ss');
    // let passcode = req.body.passcode;

    try {
        // let rs: any = await apiHyggeModel.getDb2(db);
        // res.send({ok: true, rows: rs[0]})
        console.log(datenow);
        console.log(macaddress);
        let rs: any = await apiHyggeModel.checkHicsComputer(db, hospcode, macaddress);
        let checkmac = rs[0][0]['cc'];
        if (checkmac > 0) {
            // let getmac: any = await  apiHyggeModel.getMacaddress(db,macaddress,hospcode,moment().format('YYYY-MM-DD'));
            let getmac: any = await apiHyggeModel.getMacaddress(db, macaddress);
            if (getmac[0][0] != null) {
                let checkmac: any = await apiHyggeModel.checkMacaddress(db, macaddress, hospcode, moment().format('YYYY-MM-DD'));
                if (checkmac[0][0] != null) {
                    let updateDate: any = await apiHyggeModel.updateDateHicsComputer(db,macaddress,datetimenow);
                    console.log(updateDate);
                    res.send({'ok': 'Y'});
                } else {
                    res.send({'ok': 'N'});
                }
            } else {
                let checkactive: any = await apiHyggeModel.checkActive(db, hospcode);
                if (checkactive[0][0] != null) {
                    let data: any = {};
                    data.hoscode = hospcode;
                    data.macaddress = macaddress;
                    data.computername = computername;
                    data.hics_active_id = checkactive[0][0]['id'];
                    data.last_active_datetime = datetimenow;
                    let com_id = await apiHyggeModel.saveHicsComputer(req.db2, data);
                    console.log(com_id);

                    res.send({'ok': 'Y'});
                } else {
                    res.send({'ok': 'N'});
                }
                // res.send({'ok': 'N','rows': checkactive[0][0]});
            }
        } else {
            let checkHosStaff: any = await apiHyggeModel.checkHosStaff(req.db2, hospcode);
            if (checkHosStaff[0][0] == null) {
                res.send({'ok': 'N'});
            } else {
                let selectpackage: any = await  apiHyggeModel.selectPackageFree(req.db2);
                // res.send({'ok':selectpackage[0][0]});
                let data_license: any = {};
                data_license.package_id = selectpackage[0][0]['id'];
                data_license.active = 1;
                data_license.hoscode = hospcode;

                let license = await apiHyggeModel.saveHicsLicense(req.db2, data_license);
                console.log(data_license);

                let data_active: any = {};
                data_active.hoscode = hospcode;
                data_active.hics_license = license[0];
                data_active.amount = selectpackage[0][0]['package_amount'];
                data_active.sdate = moment().format('YYYY-MM-DD');
                data_active.edate = moment().day(selectpackage[0][0]['package_day']).format('YYYY-MM-DD');
                console.log(data_active);

                let active = await apiHyggeModel.saveHicsActive(req.db2, data_active);
                let data: any = {};
                data.hoscode = hospcode;
                data.macaddress = macaddress;
                data.computername = computername;
                data.hics_active_id = active[0];
                data.last_active_datetime = datetimenow;
                let com_id = await apiHyggeModel.saveHicsComputer(req.db2, data);
                console.log(com_id);
                res.send({ok: 'Y'});
            }
        }
        /*if(macaddress && computername && hospcode && passcode){
            if(hospcode == '10677' && passcode == '99999'){
                res.send({ok:'Y'});
                // if(computername == 'com1'){
                //     res.send({ok:'Y'});
                // }else{
                //     res.send({ok:'N'});
                // }
            }else if(hospcode == '10678' && passcode == '99999'){
                res.send({ok:'N'});
            }else if(hospcode == '10679' && passcode == '99999'){
                res.send({ok:'X'});
            }
            else {
                res.send({ok:'errror'});
            }
        }else{
            res.send({ok:'errror'});
        }*/
    } catch (error) {
        res.send({ok: 'error'})
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
    data.timestamp = date_appointment + ' 08:30:00';


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