import * as Knex from 'knex';

export class Api_hygge {


    getDb2(db: Knex) {
        return db.raw(`
          select *
          from quetoday limit
               10
        `,)
    }

    getHyggeHosQue(db: Knex) {
        return db.raw(`
          SELECT h.hospcode, h.name, h.hos_detail FROM hygge_hospcode h
                                                         RIGHT OUTER JOIN quetoday q ON q.hospcode = h.hospcode
          WHERE  (q.status = 'CF' OR q.vr_status = 'CF' OR q.sc_status = 'CF' OR q.rx_status = 'CF')
          GROUP BY h.hospcode
        `,)
    }

    getHyggeDepartmentQue(db: Knex,hospcode: any) {
        return db.raw(`
          SELECT
            d.department_name,
            d.department_id,
            ( CASE WHEN d.liveque_type IS NULL THEN 0 ELSE d.liveque_type END ) AS liveque_type,
            d.GROUP,
            d.status
          FROM
            hygge_que_department AS d
              INNER JOIN hygge_que AS q ON d.department_id = q.department
          WHERE
            d.hospcodde = ?
            AND (
            IF
              (
                d.liveque_type = 3,
                q.STATUS = 'CF',
                ( q.STATUS = 'CF' OR q.vr_status = 'CF' OR sc_status = 'CF' OR rx_status = 'CF' )
              )
            )
            AND d.showonapp = 'Y'
            AND date( q.TIMESTAMP ) = CURDATE( )
          GROUP BY
            d.department_id
          ORDER BY
            d.department_name ASC
        `,hospcode)
    }


    gethosname(db: Knex,hospcode: any) {
        return db.raw(`
          select hospcode,name
          from hygge_hospcode
          where hospcode = ?
        `,hospcode)
    }

    getHyggeQueDepartment(db: Knex, hosp: any) {
        return db.raw(`
          select *
          from hygge_que_department
          where hospcodde = ?
            and register_online = 'Y'
        `, hosp);
    }

    getHyggeQueDepartmentId(db: Knex, department: any) {
        return db.raw(`
          select d.*,h.name
          from hygge_que_department d
                 left join hygge_hospcode h on h.hospcode = d.hospcodde
          where d.department_id = ?
        `, department);
    }

    getHyggeQueDepartmentQue(db: Knex, hosp: any) {
        return db.raw(`
          SELECT hygge_que_department.department_id, hygge_que_department.department_name,hygge_que_department.status
          FROM quetoday
                 LEFT JOIN hygge_que_department on quetoday.department = hygge_que_department.department_id
          WHERE quetoday.hospcode = ?
          GROUP BY hygge_que_department.department_id
        `, hosp);
    }

    getHyggeHospName(db: Knex, hosname: any) {
        return db.raw(`
          select hospcode,name
          from hygge_hospcode
          where hos_detail != '' and hospcode != '' and name like ? limit 15
        `, '%' + hosname + '%');
    }

    getCountRegisterOnline(db: Knex, department: any, date: any) {
        return db.raw(`
          select count(*) as 'count'
          from hygge_que
          where online_register = 'Y'
            and department = ?
            and timestamp BETWEEN ?
            and ?
        `, [department, date + ' 00:00:00  ', date + ' 23:59:59']);
    }

    getDSTCF(db: Knex, department: any) {
        return db.raw(`
          SELECT
            quetoday.id                                            AS ID,
            Concat(quetoday.prefix, '-', LPAD(quetoday.qid, 3, 0)) AS QID,
            quetoday.time_confirm
            AS
            Time,
            quetoday
            .
            room AS
            Room
          FROM
            quetoday
          WHERE
            STATUS = 'CF'
            AND department = ?
          ORDER BY
            time_confirm DESC
            LIMIT 5
          ;
        `, department);
    }

    getVSTCF(db: Knex, department: any) {
        return db.raw(`
          SELECT
            quetoday.id                                            AS ID,
            Concat(quetoday.prefix, '-', LPAD(quetoday.qid, 3, 0)) AS QID,
            quetoday.time_update1
            AS
            Time,
            quetoday
            .
            vr_room AS
            Room
          FROM
            quetoday
          WHERE
            vr_status = 'CF'
            AND department = ?
          ORDER BY time_update1 DESC
                   LIMIT 5
          ;
        `, department);
    }

    getSSTCF(db: Knex, department: any) {
        return db.raw(`
          SELECT
            quetoday.id                                            AS ID,
            Concat(quetoday.prefix, '-', LPAD(quetoday.qid, 3, 0)) AS QID,
            quetoday.time_update2
            AS
            Time,
            quetoday
            .
            sc_room AS
            Room
          FROM
            quetoday
          WHERE
            sc_status = 'CF'
            AND department = ?
          ORDER BY time_update2 DESC
                   LIMIT 5
          ;
        `, department);
    }

    getRSTCF(db: Knex, department: any) {
        return db.raw(`
          SELECT
            quetoday.id                                            AS ID,
            Concat(quetoday.prefix, '-', LPAD(quetoday.qid, 3, 0)) AS QID,
            quetoday.time_update2
            AS
            Time,
            quetoday
            .
            sc_room AS
            Room
          FROM
            quetoday
          WHERE
            rx_status = 'CF'
            AND department = ?
          ORDER BY time_update4 DESC
                   LIMIT 5
          ;
        `, department);
    }

    getDSTRQ(db: Knex, department: any) {
        return db.raw(`
          SELECT
            quetoday.id                                            AS ID,
            Concat(quetoday.prefix, '-', LPAD(quetoday.qid, 3, 0)) AS QID,
            quetoday.timestamp
            AS
            Time,
            quetoday
            .
            room AS
            Room
          FROM
            quetoday
          WHERE
            status = 'RQ'
            AND department = ?
          ORDER BY priority,id ASC
                   LIMIT 6
          ;
        `, department);
    }

    getVSTRQ(db: Knex, department: any) {
        return db.raw(`
          SELECT
            quetoday.id                                            AS ID,
            Concat(quetoday.prefix, '-', LPAD(quetoday.qid, 3, 0)) AS QID,
            quetoday.time_update1
            AS
            Time,
            quetoday
            .
            vr_room AS
            Room
          FROM
            quetoday
          WHERE
            vr_status = 'RQ'
            AND department = ?
          ORDER BY priority,id ASC
                   LIMIT 6
          ;
        `, department);
    }

    getSSTRQ(db: Knex, department: any) {
        return db.raw(`
          SELECT
            quetoday.id                                            AS ID,
            Concat(quetoday.prefix, '-', LPAD(quetoday.qid, 3, 0)) AS QID,
            quetoday.time_update2
            AS
            Time,
            quetoday
            .
            sc_room AS
            Room
          FROM
            quetoday
          WHERE
            sc_status = 'RQ'
            AND department = ?
          ORDER BY priority,id ASC
                   LIMIT 6
          ;
        `, department);
    }

    getRSTRQ(db: Knex, department: any) {
        return db.raw(`
          SELECT
            quetoday.id                                            AS ID,
            Concat(quetoday.prefix, '-', LPAD(quetoday.qid, 3, 0)) AS QID,
            quetoday.time_update2
            AS
            Time,
            quetoday
            .
            sc_room AS
            Room
          FROM
            quetoday
          WHERE
            rx_status = 'RQ'
            AND department = ?
          ORDER BY priority,id ASC
                   LIMIT 6
          ;
        `, department);
    }

    chkQue(db: Knex, department: any, date: any) {
        return db.raw(`
          select count(*) as qid
          from hygge_que
          where department = ?
            and timestamp BETWEEN ?
            and ?
        `, [department, date + ' 00:00:00  ', date + ' 23:59:59']);
    }

    saveInsQue(db: Knex, data: any) {
        return db('hygge_que').insert(data);
    }

    saveHicsComputer(db: Knex, data: any){
        return db('hics_computer').insert(data).returning('id');
    }
    saveHicsLicense(db: Knex, data: any){
        return db('hics_license').insert(data).returning('id');
    }
    saveHicsActive(db: Knex, data: any){
        return db('hics_active').insert(data).returning('id');
    }
    checkHicsComputer(db:Knex,hoscode: any,macaddress: any){
        return db.raw(`select count(*) as 'cc' from hics_computer a  where a.hoscode = ? or a.macaddress = ?`,[hoscode,macaddress]);
    }
    updateDateHicsComputer(db:Knex,macaddress:any,datetimenow:any){
        return db('hics_computer').where('macaddress',macaddress).update('last_active_datetime',datetimenow);
    }
    getHicsLicense(db:Knex,license_id :any){
        return db.raw(`select * from hics_license a left join hics_package b on a.package_id = b.id where a.id = ?`,license_id);
    }
    getMacaddress(db:Knex,macaddress :any){
        return db.raw(`SELECT * FROM hics_computer a LEFT JOIN hics_active b on b.id = a.hics_active_id where a.macaddress = ? `,[macaddress]);
    }
    checkMacaddress(db:Knex,macaddress :any,hoscode: any,edate: any){
        return db.raw(`SELECT * FROM hics_computer a LEFT JOIN hics_active b on b.id = a.hics_active_id where a.macaddress = ? and a.hoscode = ? and b.edate >= ?`,[macaddress,hoscode,edate]);
    }
    checkActive(db:Knex,hoscode: any){
        return db.raw(`select *from hics_active a  where a.hoscode = ? and edate >= DATE(NOW()) and a.amount > (select count(*) from hics_computer b where b.hics_active_id = a.id and a.hoscode = b.hoscode)`,[hoscode]);
    }
    checkHosStaff(db:Knex,hoscode:any){
        return db.raw(`select * from hygge_staff where hospcode = ?`,[hoscode]);
    }
    selectPackageFree(db:Knex){
        return db.raw(`select * from hics_package where id = 1`);
    }

    updateDeviceToken(db:Knex,cid:any,token:any){
      return db('hygge_citizen').where('cid',cid).update({device_token: token});
    }

    getDeviceToken(db:Knex, cid: any){
      return db.select('device_token').from('hygge_citizen').where('cid',cid);
  }



    // saveRequest(db: Knex, data: any) {
    //   return db('requests')
    //     .insert(data);
    // }
}