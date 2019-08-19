import * as Knex from 'knex';

export class DepartmentModel {

    getList(db: Knex) {
        return db('hygge_citizen').orderBy('cid', 'desc');
    }

    save(db: Knex, data: any) {
        return db('departments').insert(data);
    }

    update(db: Knex, departmentId: any, departmentName: any) {
        return db('departments')
            .where('department_id', departmentId)
            .update({ department_name: departmentName });
    }

    delete(db: Knex, departmentId: any) {
        return db('departments')
        .where('department_id',departmentId)
        .del();
    }
    getHospcodeName(db: Knex,hosname: any) {
        return db.raw(`
          SELECT hospcode,name
          FROM hygge_hospcode
          WHERE hospital_type_id NOT IN ('1', '2', 'NULL') and name like ?
          LIMIT 15
        `,'%'+hosname+'%')
    }
    getDb2(db: Knex) {
        return db.raw(`
         select * from quetoday limit 10
        `,)
    }
}