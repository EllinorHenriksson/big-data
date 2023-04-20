import { Client, errors } from '@elastic/elasticsearch'

export class Repository {
  private client: Client

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
   * @throws {errors.ElasticsearchClientError} If call to Elasticsearch server fails.
   */
  async getData (): Promise<any> {
    const result = await this.client.search({
      index: 'life_expectancy',
      aggs: {
        'life_expectancy_over_time': {
          'date_histogram': {
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
                'avg_life_expectancy': {
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

    return result
  }
}