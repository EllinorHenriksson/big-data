import express from 'express';
import createError from 'http-errors';
export const router = express.Router();
/**
 * Resolves a Controller object from the IoC container.
 *
 * @param {Request} req - Express request object.
 * @returns {Controller} An object that can act as a Controller object.
 */
const resolveController = (req) => req.app.get('container').resolve('Controller');
router.get('/', (req, res, next) => resolveController(req).index(req, res, next));
router.use('*', (req, res, next) => next(createError(404)));
