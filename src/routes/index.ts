import * as express from 'express';
import { Router, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send({ ok: true, message: 'Welcome to RESTful api server!', code: HttpStatus.OK });
});

router.get('/hello/:name',(req:Request,res:Response) => {
  //http://localhost:4000/hello/Name
  let name = req.params.name;
  res.send({myname:name});
});

router.get('/hello/:name/:age',(req:Request,res:Response) => {
  //http://localhost:4000/hello/Name/Age
  let name = req.params.name;
  
  res.send({myname:name,age:req.params.age});
});

router.get('/hello/world',(req: Request, res: Response) => {

  res.send('Hello world');
});

router.get('/hello',(req: Request, res: Response) => {
  //http://localhost:4000/hello?name=xxx&age=20
  let name = req.query.name;
  let age = req.query.age;
  res.send({name:name,age: age});
});
router.post('/hello',(req: Request, res: Response) => {
  //http://localhost:4000/hello
  let name = req.body.name;
  let age = req.body.age;
  res.send({method:'POST',name:name,age: age});
});
export default router;