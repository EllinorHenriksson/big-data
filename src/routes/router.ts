import express, { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import { Controller } from '../controllers/Controller'

export const router = express.Router()

/**
 * Resolves a Controller object from the IoC container.
 *
 * @param {Request} req - Express request object.
 * @returns {Controller} An object that can act as a Controller object.
 */
const resolveController = (req: Request) => req.app.get('container').resolve('Controller')

router.get('/', (req: Request, res: Response, next: NextFunction) => resolveController(req).index(req, res, next))

router.use('*', (req: Request, res: Response, next: NextFunction) => next(createError(404)))
