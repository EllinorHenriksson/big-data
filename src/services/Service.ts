import { Repository } from "../repositories/Repository.js";

export class Service {
  constructor (private repository: Repository = new Repository()) {}

  async getData (): Promise<unknown> {
    // TODO: Gör om datan så att den enkelt kan omvandlas till en graf i controllern
    return this.repository.getData()
  }
}