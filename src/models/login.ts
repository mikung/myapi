import * as Knex from 'knex';

export class Login {
  // doCustomerLogin(db: Knex, username: string, password: string) {
  //   return db('customers as c')
  //     .select('c.customer_id', 'c.first_name', 'c.last_name', 'd.department_name')
  //     .leftJoin('departments as d', 'd.department_id', 'c.department_id')
  //     .where('username', username)
  //     .where('password', password)
  //     .limit(1);
  // }

  // doTechnicianLogin(db: Knex, username: string, password: string) {
  //   return db('technicians as t')
  //     .select('t.technician_id', 't.first_name', 't.last_name')
  //     .where('username', username)
  //     .where('password', password)
  //     .limit(1);
  // }
  doLogin(db: Knex, username: string, password: string) {
    return db('hygge_citizen')
      .select('cid', 'pname', 'fname', 'lname', 'gender', 'telecom', 'active')
      .where('cid', username)
      .where('passcode', password)
      .limit(1);
  }
  doLoginstaff(db: Knex, username: string, password: string) {
    return db('hygge_staff')
      .select('cid', 'pname', 'fname', 'lname', 'email', 'situation', 'status', 'hospcode' )
      .where('login', username)
      .where('password', password)
      .limit(1);
  }
}