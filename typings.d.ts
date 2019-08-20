import * as Knex from 'knex';

declare module 'express' {
    interface Request {
        db: any // Actually should be something like `multer.Body`
        knex: Knex,
        decoded: any, // Actually should be something like `multer.Files`
        db2: any,
        db3: any,
        mqttClient: any,
    }
}