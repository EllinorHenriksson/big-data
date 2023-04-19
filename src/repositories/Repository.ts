import fetch from "node-fetch"

export class Repository {
  async getData (): Promise<unknown> {
    const credentials = `${process.env.USERNAME}:${process.env.PASSWORD}`
    const bufferObj = Buffer.from(credentials, "utf8"); 
    const base64String = bufferObj.toString("base64");

    const data = {
      "aggs": {
          "life_expectancy_over_time": {
              "date_histogram": {
                  "field": "@timestamp",
                  "calendar_interval": "1y",
                  "format": "yyyy-MM-dd"
              },
              "aggs": {
                  "regions": {
                      "terms": {
                          "field": "Region"
                      },
                      "aggs": {
                          "avg_life_expectancy": {
                              "avg": {
                                  "field": "Life_expectancy"
                              }
                          }
                      }
                  }
              }
          }
      }
  }
  
    const response = await fetch(`${process.env.BASE_URL_ELASTIC}life_expectancy/_search?size=0`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${base64String}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    return response.json() as unknown
  }
}