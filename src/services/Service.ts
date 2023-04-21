import { Repository } from "../repositories/Repository.js";

export class Service {
  constructor (private repository: Repository = new Repository()) {}

  async getData (): Promise<unknown> {
    const data: any = await this.repository.getData()
    const buckets: any[] = data.aggregations['life_expectancy_over_time'].buckets
    const returnData = buckets.map(bucket => ({
      year: new Date(bucket['key']).getFullYear(),
      regions: bucket.regions.buckets.map((regionBucket: any) => ({
        name: regionBucket.key,
        avg_life_expectancy: regionBucket['avg_life_expectancy'].value
      }))
    }))

    return returnData
  }
}