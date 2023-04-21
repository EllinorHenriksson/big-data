import { Request, Response, NextFunction } from 'express'
import { Service } from '../services/Service.js'
import createError from 'http-errors'

/**
 *
 */
export class Controller {
  /**
   * A service.
   *
   * @type {Service}
   */
  private service: Service

  /**
   * Initializing constructor.
   *
   * @param {Service} service The service.
   */
  constructor (service: Service) {
    this.service = service
  }

  /**
   * Shpws a graph with life expectancy data from elasticsearch.
   *
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The next Express middleware function.
   */
  async index (req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.service.getData()

      const viewData = { data }

      res.render('index', { viewData })
    } catch (error) {
      next(createError(500))
    }
  }
}
