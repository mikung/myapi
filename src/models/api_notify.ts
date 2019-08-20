import * as Knex from 'knex';

export class Api_notify {

    saveCaribou(db:Knex, data: any){
        return db('caribou_data').insert(data);
    }

    getDeviceToken(db:Knex, cid: any){
        return db.select('device_token').from('hygge_citizen').where('cid',cid);
    }

}