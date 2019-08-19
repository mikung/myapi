import * as Knex from 'knex';

export class RequestModel {

    // saveRequest(db: Knex, data: any) {
    //   return db('requests')
    //     .insert(data);
    // }

    getAppointment(db: Knex, cid: any) {
        return db('hygge_appointment')
            .leftJoin('hygge_hospcode', 'hygge_appointment.app_hospcode', 'hygge_hospcode.hospcode')
            .where('cid', cid)
            .andWhere('app_date', '<', 'Date.now()')
            .orderBy('app_date', 'desc')
    }

    getAllergy(db: Knex, cid: any) {
        return db('hygge_allergy')
            .select(['id','cid','name','report_date','allergy_item','allergy_symtom'])
            .leftJoin('hygge_hospcode', 'hygge_allergy.report_hospcode', 'hygge_hospcode.hospcode')
            .where('cid', cid)
            .orderBy('report_date', 'desc')
    }

    getVisit(db: Knex, cid: any) {
        return db('hygge_visit').select('hygge_visit.visit_id','hygge_visit.cid','hygge_visit.vn','hygge_visit.curdep_name','hygge_visit.vsttime'
        ,'hygge_visit.vstdate','hygge_visit.maindep','hygge_visit.maindep_name','hygge_visit.hospcode','hygge_hospcode.name','hygge_hospcode.hosptype','hygge_hospcode.hos_detail')
            .leftJoin('hygge_hospcode', 'hygge_visit.hospcode', 'hygge_hospcode.hospcode')
            .where('cid', cid)
            .orderBy('vstdate', 'desc')
    }

    getProfile(db: Knex, cid: any) {
        return db.raw(`SELECT hygge_citizen.cid                                                          as cid,
                              concat(hygge_citizen.pname, hygge_citizen.fname, ' ', hygge_citizen.lname) as ptname,
                              hygge_citizen.birthday                                                    as birthday,
                              (year (CURDATE())- year (hygge_citizen.birthday))                         as age,
                              hygge_citizen.emergency_name                                               as emername,
                              hygge_citizen.emergency_telephone                                          as emercontact,
                              hygge_citizen.bloodgroup                                                   as bloodgroup,
                              hygge_pttype.name                                                          as pttypename,
                              hygge_citizen.address_name                                                 as AddressDetail1,
                              hygge_thaiaddress.full_name                                                as AddressDetail2,
                              hygge_citizen.address_postal                                               as AddressPostal
                       FROM hygge_citizen
                              LEFT OUTER JOIN hygge_pttype
                                              ON hygge_citizen.pttype = hygge_pttype.pttype
                              LEFT OUTER JOIN hygge_thaiaddress
                                              ON hygge_citizen.address_id = hygge_thaiaddress.addressid
                       WHERE hygge_citizen.cid = ? `, cid)
    }

    getAppointmentOlder(db: Knex, cid: any) {
        return db.raw(`
          SELECT
            a.*,
            b.name
          FROM
            hygge_appointment a
              LEFT JOIN hygge_hospcode b ON a.app_hospcode = b.hospcode
          WHERE
            a.cid = ?
            AND a.app_date < DATE ( now( ) )
          ORDER BY
            app_date DESC
        `, cid)
    }

    getAppointmentNew(db: Knex, cid: any) {
        return db.raw(`
          SELECT
            a.*,
            b.name
          FROM
            hygge_appointment a
              LEFT JOIN hygge_hospcode b ON a.app_hospcode = b.hospcode
          WHERE
            a.cid = ?
            AND a.app_date >= DATE ( now( ) )
          ORDER BY
            app_date ASC
        `, cid)
    }
    getAppointmentNew1(db: Knex, cid: any) {
        return db.raw(`
          SELECT
            a.*,
            b.name
          FROM
            hygge_appointment a
              LEFT JOIN hygge_hospcode b ON a.app_hospcode = b.hospcode
          WHERE
            a.cid = ?
            AND a.app_date > DATE ( now( ) )
          ORDER BY
            app_date ASC
          limit 1
        `, cid)
    }

    getAppointmentHospcode(db: Knex, cid: any) {
        return db.raw(`
          SELECT
            a.app_hospcode,
            b.name
          FROM
            hygge_appointment a
              LEFT JOIN hygge_hospcode b ON a.app_hospcode = b.hospcode
          WHERE
            a.cid = ?
            AND a.app_date >= DATE ( now( ) )
          GROUP BY
            a.app_hospcode,
            b.name
        `, cid)
    }

    getHospcode(db: Knex) {
        return db.raw(`
          SELECT hospcode,name
          FROM hygge_hospcode
          WHERE hospital_type_id NOT IN ('1', '2', 'NULL')
    
        `,)
    }

    getDepartments(db: Knex, hospcode: any) {
        return db.raw(`
          SELECT hospcodde,department_name,department_id
          FROM hygge_que_department
          WHERE hospcodde = ?
        `, hospcode)
    }
    getHospcodeName(db: Knex,hosname: any) {
        return db.raw(`
          SELECT hospcode,name
          FROM hygge_hospcode
          WHERE hospital_type_id NOT IN ('1', '2', 'NULL') and name like ?
          LIMIT 15
        `,'%'+hosname+'%')
    }
    getAd(db: Knex) {
        return db.raw(`
          SELECT
            ad_id,
                 path,
                 content
          FROM
            hygge_ad
          WHERE
            program = 'hms'
          ORDER BY
            ad_id DESC
        `);
    }

    getOldpassword(db: Knex,cid: any,oldpassword: any){
        return db.raw(`
            SELECT count(*) as 'c' 
            FROM hygge_citizen
            WHERE cid = ? and passcode = ?
        `,[cid,oldpassword]);
    }

    updatePassword(db: Knex, cid: any, newpassword: any){
        return db('hygge_citizen').where('cid' ,'=',cid).update({passcode: newpassword});
    }




}