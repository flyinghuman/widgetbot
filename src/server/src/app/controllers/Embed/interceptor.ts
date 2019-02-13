import metaTags from 'engine/util/meta'
import { Request, Response } from 'express'
import interceptor from 'express-interceptor'

const intercept = interceptor((req: Request, res: Response) => {
  return {
    isInterceptable: () => /text\/html/.test(res.get('Content-Type')),
    intercept: async (body, send) => {
      const { originalUrl } = req

      if (originalUrl.startsWith('/channels/') || originalUrl === '/channels') {
        const domain = req.get('X-Forwarded-Host') || req.get('host')
        const url = `${
          domain.startsWith('localhost')
            ? 'https://widgetbot.io'
            : `${req.protocol}://${domain}`
        }${req.originalUrl}`

        const [server, channel] = originalUrl.split('/').slice(2)
        return send(
          body.replace(
            '<head>',
            `<head>${await metaTags({ server, channel, url })}`
          )
        )
      }

      send(body)
    }
  }
})

export default intercept
