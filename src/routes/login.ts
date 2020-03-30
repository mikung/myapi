/// <reference path="../../typings.d.ts" />

import * as express from 'express';
import { Router, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import * as crypto from 'crypto';

import { Login } from '../models/login';

import { Jwt } from '../models/jwt';

const loginModel = new Login();
const jwt = new Jwt();

const router: Router = Router();


router.post('/', async (req: Request, res: Response) => {
  let username: string = req.body.username;
  let password: string = req.body.password;
  console.log('testdata');
  let db = req.db;
  console.log('test');
  try {
    let encPassword = crypto.createHash('md5').update(password).digest('hex');
    let rs: any = await loginModel.doLogin(db, username, password);

    if (rs.length) {

      let payload = {
        fullname: `${rs[0].pname}${rs[0].fname}  ${rs[0].lname}`,
        cid: rs[0].cid,
        active: rs[0].active,
        gender: rs[0].gender,
        tel: rs[0].telecom
      }

      let token = jwt.sign(payload);
      res.send({ ok: true, token: token, code: HttpStatus.OK });
    } else {
      res.send({ ok: false, error: 'Login failed!', code: HttpStatus.UNAUTHORIZED });
    }
  } catch (error) {
    res.send({ ok: false, error: error.message + 1, code: HttpStatus.INTERNAL_SERVER_ERROR });
  }

});

router.post('/loginhygge', async (req: Request, res: Response) => {
    let username: string = req.body.username;
    let password: string = req.body.password;


    let db = req.db;
    console.log('test');
    try {
        let encPassword = crypto.createHash('md5').update(password).digest('hex');
        let rs: any = await loginModel.doLogin(db, username, password);

        if (rs.length) {

            let payload = {
                fullname: `${rs[0].pname}${rs[0].fname}  ${rs[0].lname}`,
                cid: rs[0].cid,
                active: rs[0].active,
                gender: rs[0].gender,
                favhos1: rs[0].favhos1,
                favhos2: rs[0].favhos2,
                favhos3: rs[0].favhos3,
                tel: rs[0].telecom
            }

            let token = jwt.sign2(payload);
            res.send({ ok: true, token: token, code: HttpStatus.OK });
        } else {
            res.send({ ok: false, error: 'Login failed!', code: HttpStatus.UNAUTHORIZED });
        }
    } catch (error) {
        res.send({ ok: false, error: error.message + 1, code: HttpStatus.INTERNAL_SERVER_ERROR });
    }

});

router.post('/loginstaff', async (req: Request, res: Response) => {
  let username: string = req.body.username;
  let password: string = req.body.password;

  let db = req.db3;
  console.log('test');
  try {
    let encPassword = crypto.createHash('md5').update(password).digest('hex');
    let rs: any = await loginModel.doLoginstaff(db, username, password);

    if (rs.length) {

      let payload = {
        fullname: `${rs[0].pname}${rs[0].fname}  ${rs[0].lname}`,
        cid: rs[0].cid,
        emai: rs[0].email,
        situation: rs[0].situation,
        hospcode: rs[0].hospcode
      }

      let token = jwt.sign(payload);
      res.send({ ok: true, token: token, code: HttpStatus.OK });
    } else {
      res.send({ ok: false, error: 'Login failed!', code: HttpStatus.UNAUTHORIZED });
    }
  } catch (error) {
    res.send({ ok: false, error: error.message + 1, code: HttpStatus.INTERNAL_SERVER_ERROR });
  }

});


export default router;
