/// <reference path="../../typings.d.ts" />

import * as express from 'express';
import { Router, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';

import { DepartmentModel } from '../models/department';
import * as Knex from "knex";

const departmentModel = new DepartmentModel();
const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
    let db = req.db;
    try {
        //example query Model
        let rows = await departmentModel.getList(db);

        // example query raw
        // let sql = 'select * from hygge_citizen order by cid desc';
        // let rows = await db.raw(sql);  // use call return rows[0]  ******



        // example querybuilder
        // let rows = await db('hygge_citizen').orderBy('cid');
        res.send({ ok: true, rows: rows });
    } catch (error) {
        res.send({ ok: false, error: error.message });
    }


    // example 01 not use
    //  db('hygge_citizen')
    //     .then(results => {
    //         res.send({ ok: true, rows: results });
    //     })
    //     .catch(error => {
    //         console.log(error);
    //         res.send({ ok: false, error: error.message });
    //     });
    // res.send({ ok: true, message: 'Welcome to RESTful api department server!', code: HttpStatus.OK });
});

router.post('/', async (req: Request, res: Response) => {
    let db = req.db;
    let departmentName = req.body.departmentName;

    try {
        let data = {
            department_name: departmentName
        };
        await departmentModel.save(db, data);
        res.send({ ok: true });
    } catch (error) {
        res.send({ ok: false, error: error.message });
    }
});
router.put('/:departmentId', async (req: Request, res: Response) => {
    let db = req.db;
    let departmentId = req.params.departmentId;
    let departmentName = req.body.departmentName;

    try {
        let data = {
            department_name: departmentName
        };
        await departmentModel.update(db, departmentId, data);
        res.send({ ok: true });
    } catch (error) {
        res.send({ ok: false, error: error.message });
    }
});
router.delete('/:departmentId', async (req: Request, res: Response) => {
    let db = req.db;
    let departmentId = req.params.departmentId;
    try {
        await departmentModel.delete(db, departmentId);
        res.send({ok:true});
    } catch (error) {
        res.send({ ok: false, error: error.message });
    }
});

router.get('/getHospcodeName', async (req: Request, res: Response) => {
    let db = req.db;
    let hosname = req.query.hosname;
    try {
        let rs: any = await departmentModel.getHospcodeName(db,hosname);
        res.send({ ok: true, rows: rs[0] })
    } catch (error) {
        res.send({ ok: false, error: error.message })
    }
});
router.get('/getDb2', async (req: Request, res: Response) => {
    let db = req.db3;
    // let hosname = req.query.hosname;
    try {
        let rs: any = await departmentModel.getDb2(db);
        res.send({ ok: true, rows: rs[0] })
    } catch (error) {
        res.send({ ok: false, error: error.message })
    }
});

export default router;