import 'dotenv/config'
import { jwt } from 'hono/jwt'

export const authMiddleware = jwt({
  secret: process.env.JWT_SECRET!,
  alg: 'HS256',
  verification: {
      iss: process.env.JWT_VALID_ISSUER,
      aud: process.env.JWT_VALID_AUDIENCE,
    },
})