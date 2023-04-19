import { Repository } from "../repositories/Repository.js";

export class Service {
  constructor (private repository: Repository = new Repository()) {}

  async getData (): Promise<unknown> {
    return this.repository.getData()
  }
}