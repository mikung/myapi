/// <reference path="../typings.d.ts" />

require('dotenv').config();
var mqtt = require('mqtt');

import * as path from 'path';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as ejs from 'ejs';
import * as HttpStatus from 'http-status-codes';
import * as express from 'express';
import * as cors from 'cors';

import Knex = require('knex');
import {MySqlConnectionConfig} from 'knex';
import {Router, Request, Response, NextFunction} from 'express';
import {Jwt} from './models/jwt';

import indexRoute from './routes/index';
import loginRoute from './routes/login';
import requestRoute from './routes/request';
import departmentRoute from './routes/departments';
import apihyggeRoute from './routes/apihygge';
import apihyggereplicaRoute from './routes/apihyggereplica';
import kioskRoute from './routes/kiosk';
import caribouRoute from './routes/caribou';
import notifyRoute from './routes/notify';
// Assign router to the express.Router() instance
const app: express.Application = express();

const jwt = new Jwt();

//view engine setup
app.set('views', path.join(__dirname, '../views'));
app.engine('.ejs', ejs.renderFile);
app.set('view engine', 'ejs');

//uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname,'../public','favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: false,limit: '50mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use(cors());


let connection: MySqlConnectionConfig = {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
    debug: true
}

let connection_hygge: MySqlConnectionConfig = {
    host: process.env.DB_HOST_HYGGE,
    port: +process.env.DB_PORT_HYGGE,
    database: process.env.DB_NAME_HYGGE,
    user: process.env.DB_USER_HYGGE,
    password: process.env.DB_PASSWORD_HYGGE,
    multipleStatements: true,
    debug: true
}

let connection_hygge_replica: MySqlConnectionConfig = {
    host: process.env.DB_HOST_HYGGE_REPLICA,
    port: +process.env.DB_PORT_HYGGE_REPLICA,
    database: process.env.DB_NAME_HYGGE_REPLICA,
    user: process.env.DB_USER_HYGGE_REPLICA,
    password: process.env.DB_PASSWORD_HYGGE_REPLICA,
    multipleStatements: true,
    debug: true
}

let db = Knex({
    client: 'mysql',
    connection: connection,
    pool: {
        min: 0,
        max: 100,
        afterCreate: (conn, done) => {
            conn.query('SET NAMES utf8', (err) => {
                done(err, conn);
            });
            // conn.query('SET time_zone = Asia/Bangkok', (err) => {
            //     done(err,conn);
            // });
        }
    },
});

let db_hygge = Knex({
    client: 'mysql',
    connection: connection_hygge,
    pool: {
        min: 0,
        max: 100,
        afterCreate: (conn, done) => {
            conn.query('SET NAMES utf8', (err) => {
                done(err, conn);
            });
            conn.query('SET time_zone = Asia/Bangkok', (err) => {
                done(err,conn);
            });
        }
    },
});

let db_hygge_replica = Knex({
    client: 'mysql',
    connection: connection_hygge_replica,
    pool: {
        min: 0,
        max: 100,
        afterCreate: (conn, done) => {
            conn.query('SET NAMES utf8', (err) => {
                done(err, conn);
            });
            conn.query('SET time_zone = Asia/Bangkok', (err) => {
                done(err,conn);
            });
        }
    },
});


app.use((req: Request, res: Response, next: NextFunction) => {
    req.db = db;
    req.db2 = db_hygge;
    req.db3 = db_hygge_replica;
    next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
    const client = mqtt.connect(`mqtt://${process.env.MQTT_HOST}`,{
        // clientId: 'hygge_api_client-' + Math.floor(Math.random() * 1000000),
        clientId: 'hygge_api_client-hygge',
        username: process.env.MQTT_USER,
        password: process.env.MQTT_PASSWORD
    });
    req.mqttClient = client;
    next();
});

let checkAuth = (req: Request, res: Response, next: NextFunction) => {
    let token: string = null;

    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        token = req.query.token;
    } else {
        token = req.body.token;
    }

    jwt.verify(token)
        .then((decoded: any) => {
            req.decoded = decoded;
            next();
        }, err => {
            return res.send({
                ok: false,
                error: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED),
                code: HttpStatus.UNAUTHORIZED
            });
        });
}

app.use('/login', loginRoute);
app.use('/api', checkAuth, requestRoute);
app.use('/', indexRoute);
app.use('/department', departmentRoute);
app.use('/apihygge', apihyggeRoute);
app.use('/request', checkAuth, requestRoute);
app.use('/apihyggereplica', apihyggereplicaRoute);
app.use('/kiosk',kioskRoute);
app.use('/caribou',caribouRoute);
app.use('/notify',notifyRoute);

//error handlers

if (process.env.NODE_ENV === 'development') {
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        console.log(err.stack);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: {
                ok: false,
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
            }
        });
    });
}

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(HttpStatus.NOT_FOUND).json({
        error: {
            ok: false,
            code: HttpStatus.NOT_FOUND,
            error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
        }
    });
});

export default app;
