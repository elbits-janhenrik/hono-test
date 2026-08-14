import { jwt } from 'hono/jwt'

export const authMiddleware = jwt({
  secret: process.env.JWT_SECRET!,   // required
  alg: 'HS256',                      // optional, default HS256
})