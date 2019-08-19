import * as Knex from 'knex';

export class Api_caribou {

    saveCaribou(db:Knex, data: any){
        return db('caribou_data').insert(data);
    }

}