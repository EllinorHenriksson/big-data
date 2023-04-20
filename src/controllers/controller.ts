import { Request, Response, NextFunction } from 'express'
import { Service } from '../services/Service.js'
import createError from 'http-errors'

export class Controller {

  constructor (private service: Service = new Service()) {}

  async index (req: Request, res: Response, next: NextFunction) {
    try {
      //const data = await this.service.getData()
      const data = 'Hello'

      console.log(data);

      const viewData = {
        data
      }
      
      res.render('index', { viewData })
    } catch (error) {
      next(createError(500))
    }
  }
}