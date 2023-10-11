import { type RequestHandler, createProxyMiddleware } from 'http-proxy-middleware'
const apiProxy = (app: { use: (arg0: string[], arg1: RequestHandler) => void }) => {
  app.use(
    ['/*'], // the base api route you can change it
    createProxyMiddleware({
      target: 'http://localhost:4000' // the local server endpoint
    })
  )
}

export default apiProxy
