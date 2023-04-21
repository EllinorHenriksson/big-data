import { Client, errors } from '@elastic/elasticsearch'

/**
 * Represents a repository.
 */
export class Repository {
  private client: Client

  /**
   * Initializing constructor that creates and saves an elasticsearch client.
   */
  constructor () {
    this.client = new Client({
      node: process.env.BASE_URL_ELASTIC,
      auth: {
        username: process.env.USERNAME_ELASTIC as string,
        password: process.env.PASSWORD_ELASTIC as string
      },
      tls: {
        rejectUnauthorized: false
      }
    })
  }

  /**
   * Gets the life expectancy data from Elasticsearch.
   *
   * @returns {Promise<any>} A promise that resolvees into an object with the data from Elasticsearch.
   * @throws {errors.ElasticsearchClientError} If call to Elasticsearch server fails.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getData (): Promise<any> {
    return this.client.search({
      index: 'life_expectancy',
      aggs: {
        life_expectancy_over_time: {
          date_histogram: {
            field: '@timestamp',
            calendar_interval: 'year',
            format: 'yyyy-MM-dd'
          },
          aggs: {
            regions: {
              terms: {
                field: 'Region'
              },
              aggs: {
                avg_life_expectancy: {
                  avg: {
                    field: 'Life_expectancy'
                  }
                }
              }
            }
          }
        }
      }
    })
  }
}
