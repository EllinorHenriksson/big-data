import express, { Request, Response, NextFunction } from 'express'
import expressLayouts from 'express-ejs-layouts'
import logger from 'morgan'
import { HttpError } from 'http-errors'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { router } from './routes/router.js'
import { container } from './config/bootstrap.js'

import helmet from 'helmet';
import * as dotenv from 'dotenv'
dotenv.config()

try {
  const app = express()

  app.set('container', container)

  // Get full name of current directory.
  const directoryFullName = dirname(fileURLToPath(import.meta.url))

  // Set the URL of the applicaton's root directory.
  const baseURL = process.env.BASE_URL || '/'

  // Use helmet to enfore security.
  app.use(helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'script-src': ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
    }
  }))

  // Use morgan logger to monitor the network traffic.
  app.use(logger('dev'))

  // Create setup for the view engine.
  app.set('view engine', 'ejs')
  app.set('views', join(directoryFullName, 'views'))
  app.use(expressLayouts)
  app.set('layout', join(directoryFullName, 'views', 'layouts', 'default'))

  // Parse form requests and populate request object with body object.
  app.use(express.urlencoded({ extended: false }))

  // Serve static files.
  app.use(express.static(join(directoryFullName, '..', 'public')))

  // Middleware to be executed before the routes.
  app.use((req, res, next) => {
    res.locals.baseURL = baseURL

    next()
  })

  // Register routes.
  app.use('/', router)

  // Error handler.
  app.use(function (err: HttpError, req: Request, res: Response, next: NextFunction) {
    if (err.status === 404) {
      return res
        .status(404)
        .sendFile(join(directoryFullName, 'views', 'errors', '404.html'))
    }

    if (req.app.get('env') !== 'development') {
      return res
        .status(500)
        .sendFile(join(directoryFullName, 'views', 'errors', '500.html'))
    }

    // Development only!
    res
      .status(err.status || 500)
      .render('errors/error', { error: err })

    console.error(err)
  })

  // Starts HTTP server listening for connections.
  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
    console.log('Press Ctrl-C to terminate...')
  })
} catch (err) {
  console.error(err)
  process.exitCode = 1
}
