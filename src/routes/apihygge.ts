/// <reference path="../../typings.d.ts" />

import * as moment from 'moment';
import * as express from 'express';
import {Router, Request, Response} from 'express';
import * as HttpStatus from 'http-status-codes';
import * as multer from 'multer';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import * as path from 'path';
import * as sharp from 'sharp';

import {Api_hygge} from '../models/api_hygge';
import {RequestModel} from '../models/request';
import * as Knex from "knex";

const apiHyggeModel = new Api_hygge();
const requestModel = new RequestModel();
const router: Router = Router();
moment.locale('Thai');
// const uploadDir = './uploads/profiles'
// fse.ensureDirSync(uploadDir);
//
// var storage = multer.diskStorage({
//     distination: function (req: any, file: any, cb: any) {
//         cb(null, uploadDir)
//     },
//     filename: function (req, file, cb) {
//         let _ext = path.extname(file.originalname);
//         cb(null, Date.now() + _ext);
//     }
// })
//
// let upload = multer({storage: storage});

router.get('/', async (req: Request, res: Response) => {
    let db = req.db2;
    try {
        let rows = await apiHyggeModel.getDb2(db);
        res.send({ok: true, rows: rows});
    } catch (error) {
        res.send({ok: false, error: error.message});
    }
});

router.post('/uploadImageProfile', async (req: Request, res: Response) => {
    let db = req.db;
    let name = req.body.name;
    let img = req.body.image;
    console.log(name);
    console.log('mi');
    // let buf = await sharp(Buffer.from(img, 'base64')).rotate().resize({height: 400}).png({quality: 100}).toBuffer();
    // console.log(name);
    // fs.writeFile(`uploads/profiles/${name}.png`, buf, function (err) {
    //     console.log(err);
    // });
    // try {
    //     let rows = await apiHyggeModel.updateImageProfile(db, name);
    //     res.send({ok: true, rows: 'upload'});
    // } catch (error) {
    //     res.send({ok: false, error: error.message});
    // }
});

router.get('/getImageProfile/:id', async (req: Request, res: Response) => {
    let id: any = req.params.id;
    fs.readFile(`./uploads/profiles/${id}.png`, function (error, content) {
        if (error) {
            res.writeHead(500);
            res.end();
        } else {
            res.writeHead(200, {'Content-Type': 'image/png'})
            res.end(content, 'utf-8');
        }

    })
});


router.get('/getDb2', async (req: Request, res: Response) => {
    let db = req.db3;
    // let hosname = req.query.hosname;
    try {
        let rs: any = await apiHyggeModel.getDb2(db);
        res.send({ok: true, rows: rs[0]})
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});

router.get('/getHyggeHosQue', async (req: Request, res: Response) => {
    let db = req.db3;
    // let hosname = req.query.hosname;
    try {
        let rs: any = await apiHyggeModel.getHyggeHosQue(db);
        res.send({ok: true, rows: rs[0]})
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});

router.get('/getHyggeDepartmentQue', async (req: Request, res: Response) => {
    let db = req.db3;
    let hospcode = req.query.hospcode;
    try {
        let rs: any = await apiHyggeModel.getHyggeDepartmentQue(db, hospcode);
        res.send({ok: true, rows: rs[0]})
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});

router.get('/getHyggeQueDepartment', async (req: Request, res: Response) => {
    let db = req.db3;
    let hospcode = req.query.hospcode;
    try {
        let rs: any = await apiHyggeModel.getHyggeQueDepartment(db, hospcode);
        res.send({ok: true, rows: rs[0]})
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});

router.get('/getHyggeQueDepartmentId', async (req: Request, res: Response) => {
    let db = req.db3;
    let department = req.query.department;
    try {
        let rs: any = await apiHyggeModel.getHyggeQueDepartmentId(db, department);
        res.send({ok: true, rows: rs[0]})
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});

router.get('/getHyggeQueDepartmentQue', async (req: Request, res: Response) => {
    let db = req.db3;
    let hospcode = req.query.hospcode;
    try {
        let rs: any = await apiHyggeModel.getHyggeQueDepartmentQue(db, hospcode);
        res.send({ok: true, rows: rs[0]})
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});


router.get('/getHyggeHospName', async (req: Request, res: Response) => {
    let db = req.db3;
    let hosname = req.query.hosname;
    try {
        let rs: any = await apiHyggeModel.getHyggeHospName(db, hosname);
        res.send({ok: true, rows: rs[0]})
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});

router.get('/getCountRegisterOnline', async (req: Request, res: Response) => {
    let db = req.db3;
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
    let db = req.db3;
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
    let db = req.db3;
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
    let db = req.db3;
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
    let db = req.db3;
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
    let db = req.db3;
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
    let db = req.db3;
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
    let db = req.db3;
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
    let db = req.db3;
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
    let db = req.db3;
    try {
        let rs: any = await requestModel.getAd(db);
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
        let rs: any = await apiHyggeModel.chkQue(req.db3, department, date_appointment);
        data.qid = rs[0][0]['qid'] + 1;
        await apiHyggeModel.saveInsQue(req.db2, data);
        res.send({ok: true, rows: data, code: HttpStatus.OK});
    } catch (error) {
        res.send({ok: false, error: error.message, code: HttpStatus.OK});
    }

});

router.get('/getProvince', async (req: Request, res: Response) => {
    let db = req.db3;
    try {
        let rs: any = await requestModel.getProvince(db);
        res.send({ok: true, rows: rs[0]})
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});

router.get('/getProvinceHospital', async (req: Request, res: Response) => {
    let db = req.db3;
    let province = req.query.province;
    try {
        let rs: any = await requestModel.getProvinceHospital(db, province);
        res.send({ok: true, rows: rs[0]})
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});

router.post('/updateDeviceToken', async (req: Request, res: Response) => {
    let db = req.db;
    let cid = req.body.cid;
    let token = req.body.token;
    try {
        let rs: any = await apiHyggeModel.updateDeviceToken(db, cid, token);
        res.send({ok: true, rows: rs});
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});

router.post('/updateDeviceTokenToNull', async (req: Request, res: Response) => {
    let db = req.db;
    let cid = req.body.cid;
    try {
        let rs: any = await apiHyggeModel.updateDeviceTokenToNull(db, cid);
        res.send({ok: true, rows: rs});
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});

router.get('/getDeviceToken', async (req: Request, res: Response) => {
    let db = req.db;
    let cid = req.query.cid;
    try {
        let rs: any = await apiHyggeModel.getDeviceToken(db, cid);
        res.send({ok: true, rows: rs});
    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});

router.get('/getLiveque', async (req: Request, res: Response) => {
    let db = req.db3;
    let department = req.query.department;
    let status = req.query.status;
    try {
        if (status == 'DST') {
            let rs: any = await apiHyggeModel.getDST(db, department);
            res.send({ok: true, rows: rs});
        } else if (status == 'VST') {
            let rs: any = await apiHyggeModel.getVST(db, department);
            res.send({ok: true, rows: rs});
        } else if (status == 'SST') {
            let rs: any = await apiHyggeModel.getSST(db, department);
            res.send({ok: true, rows: rs});
        } else if (status == 'RST') {
            let rs: any = await apiHyggeModel.getRST(db, department);
            res.send({ok: true, rows: rs});
        } else {
            res.send({ok: false, error: 'Status fail'});
        }

    } catch (error) {
        res.send({ok: false, error: error.message})
    }
});
export default router;
