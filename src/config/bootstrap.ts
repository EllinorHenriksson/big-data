/**
 * Module for bootstrapping.
 */

import { IoCContainer } from '../util/IoCContainer.js'
import { Service } from '../services/Service.js'
import { Controller } from '../controllers/Controller.js'
import { Repository } from '../repositories/Repository.js'

const iocContainer = new IoCContainer()

iocContainer.register('RepositorySingleton', Repository, {
  singleton: true
})

iocContainer.register('ServiceSingleton', Service, {
  dependencies: [
    'RepositorySingleton'
  ],
  singleton: true
})

iocContainer.register('Controller', Controller, {
  dependencies: [
    'ServiceSingleton'
  ]
})

export const container = Object.freeze(iocContainer)
