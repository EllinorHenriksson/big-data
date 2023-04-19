import { Client } from '@elastic/elasticsearch'

export class Repository {
  /**
   * @throws {Error} If fetch fails
   */
  async getData (): Promise<any> {
    try {
      const client = new Client({
        node: process.env.BASE_URL_ELASTIC,
        auth: {
          username: process.env.USERNAME as string,
          password: process.env.PASSWORD as string
        },
        tls: {
          rejectUnauthorized: false
        }
      })

      const result = await client.search({
        index: 'life_expectancy',
        aggs: {
          'life_expectancy_over_time': {
            'date_histogram': {
              field: '@timestamp',
              calendar_interval: '1Y',
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

      console.log('Result: ', result);
    } catch (error) {
      console.log('Error: ', error);
    }
  }
}