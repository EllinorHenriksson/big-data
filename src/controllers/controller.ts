import { Request, Response, NextFunction } from 'express'
import { Service } from '../services/Service'

export class Controller {

  constructor (private service: Service = new Service()) {}

  index (req: Request, res: Response, next: NextFunction) {
    res.render('index')
  }
}