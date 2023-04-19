import { Request, Response, NextFunction } from 'express'

export class Controller {
  index (req: Request, res: Response, next: NextFunction) {
    res.render('index')
  }
}