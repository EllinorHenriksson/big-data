import { Repository } from '../repositories/Repository.js'
import { errors } from '@elastic/elasticsearch'

/**
 *
 */
export class Service {
  /**
   * The repository.
   *
   * @type {Repository}
   */
  private repository: Repository

  /**
   * Initializing constructor.
   *
   * @param {Repository} repository The repository.
   */
  constructor (repository: Repository) {
    this.repository = repository
  }

  /**
   * Gets the life expectancy data from Elasticsearch.
   *
   * @returns {Promise<Array<object>>} A promise that resolves into an array of objects representing the data.
   * @throws {errors.ElasticsearchClientError} If call to Elasticsearch server fails.
   */
  async getData (): Promise<Array<object>> {
    const data = await this.repository.getData()
    const buckets = data.aggregations.life_expectancy_over_time.buckets
    const returnData = buckets.map((bucket: { key: string | number | Date; regions: { buckets: unknown[] } }) => ({
      year: new Date(bucket.key).getFullYear(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      regions: bucket.regions.buckets.map((regionBucket: any) => ({
        name: regionBucket.key,
        avg_life_expectancy: regionBucket.avg_life_expectancy.value
      }))
    }))

    return returnData
  }
}
