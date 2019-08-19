import * as Knex from 'knex';

export class Api_hygge_replica {


    getDb2(db: Knex) {
        return db.raw(`
          select *
          from quetoday limit
               10
        `,)
    }

    getEst(db: Knex, department: any){
      return db.raw(`
      SELECT
      IFNULL( ROUND( AVG( MINUTE ( TIMEDIFF( time_confirm, q.TIMESTAMP ) ) ) ), d.waitingtime ) AS est 
    FROM
      quetoday AS q
    RIGHT OUTER JOIN hygge_que_department AS d ON q.department = d.department_id 
    WHERE
      q.department = ? 
        `, department);
    }

    getRqandcf(db: Knex, department: any){
      return db.raw(`
      SELECT
	count( quetoday.id ) AS QueAtThisDay,
	
sum( quetoday.vr_status = 'RQ' ) AS All_VR_RQ,
	
sum( quetoday.vr_status = 'CF' ) AS All_VR_CF,
	
sum( quetoday.sc_status = 'RQ' ) AS All_SC_RQ,
	
sum( quetoday.sc_status = 'CF' ) AS All_SC_CF,
	
sum( quetoday.STATUS = 'RQ' ) AS All_DT_RQ,
	
sum( quetoday.STATUS = 'CF' ) AS All_DT_CF 


FROM
	quetoday 


WHERE
	quetoday.department = ? 
        `, department);
    }

    getHyggeQueDepartment(db: Knex, hosp: any) {
        return db.raw(`
          select *
          from hygge_que_department
          where hospcodde = ?
            and register_online = 'Y'
        `, hosp);
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
          ORDER BY priority,id DESC
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
          ORDER BY priority,id DESC
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
          ORDER BY priority,id DESC
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

    doLoginstaff(db: Knex, username: string, password: string) {
      return db('hygge_staff')
        .select('cid', 'pname', 'fname', 'lname', 'email', 'situation', 'status', 'hospcode' )
        .where('login', username)
        .where('password', password)
        .limit(1);
    }

    chkQueueHygge(db: Knex, cid: any) {
        return db.raw(`
          SELECT
            quetoday.id                                            AS ID,
            LPAD(quetoday.id, 10, '0')                             AS QID,
            concat(quetoday.prefix, '-', LPAD(quetoday.qid, 3, 0)) AS ShowNowQue,
            hygge_que_department.department_name,
            hygge_que_department.department_id                     AS DepartmentID,
            hygge_que_department.department_name                   AS DepartmentName,
            quetoday.hospcode,
            hygge_hospcode.name as HospitalName

          FROM
            quetoday
              INNER JOIN hygge_que_department ON quetoday.department = hygge_que_department.department_id
              LEFT JOIN hygge_hospcode on hygge_hospcode.hospcode = quetoday.hospcode
          WHERE
            quetoday.cid = ?
            AND
            quetoday.status = 'RQ'
          ORDER BY
            ID DESC
        `, cid);
    }

    // saveRequest(db: Knex, data: any) {
    //   return db('requests')
    //     .insert(data);
    // }
}