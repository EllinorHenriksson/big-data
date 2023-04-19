/**
 * Encapsulates an inversion of control container.
 */
export class IoCContainer {
  /**
   * A collection of services.
   *
   * @type {Map}
   */
  #services

  /**
   * A collection of single instances.
   *
   * @type {Map}
   */
  #singletons

  /**
   * Initializes a new instance.
   */
  constructor () {
    this.#services = new Map()
    this.#singletons = new Map()
  }

  /**
   * Registers a service with the container.
   *
   * @param {string} name - ...
   * @param {*} definition - ...
   * @param {object} options - ...
   * @param {string[]} options.dependencies - ...
   * @param {boolean} options.singleton - ...
   * @param {boolean} options.type - ...
   */
  register (name, definition, { dependencies, singleton = false, type = false } = {}) {
    this.#services.set(
      name,
      {
        definition,
        dependencies,
        singleton: !!singleton,
        type: !!type
      })
  }

  /**
   * Resolves a value or object by name.
   *
   * @param {string} name - The service's name to resolve.
   * @returns {*} A service.
   */
  resolve (name) {
    const service = this.#services.get(name)

    // Return the value.
    if (typeof service.definition !== 'function' || service.type) {
      return service.definition
    }

    // If not a singleton, create and return a new instance.
    if (!service.singleton) {
      return this.#createInstance(service)
    }

    // It's a singleton, so if it's necessary, create new instance,
    // and return the one and only instance.
    if (!this.#singletons.has(name)) {
      const instance = this.#createInstance(service)
      this.#singletons.set(name, instance)
    }
    return this.#singletons.get(name)
  }

  /**
   * Creates a new instance based on a service.
   *
   * @param {object} service - ...
   * @returns {*} ...
   */
  #createInstance (service) {
    const args = service.dependencies?.map((dependency) => this.resolve(dependency)) || []
    /* eslint-disable-next-line new-cap */
    return new service.definition(...args)
  }
}
