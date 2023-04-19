import { Request, Response, NextFunction } from 'express'
import { Service } from '../services/Service.js'
import createError from 'http-errors'

export class Controller {

  constructor (private service: Service = new Service()) {}

  async index (req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.service.getData()

      console.log(data);
      
      // Use js lib to render graph
  
      res.render('index')
    } catch (error) {
      next(createError(500))
    }
  }
}