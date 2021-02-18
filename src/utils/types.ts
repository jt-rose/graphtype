import { createMakerLoader } from './makerLoader'
import { Request, Response } from 'express'
import { Session } from 'express-session'
import { Redis } from 'ioredis'
import { Connection } from 'typeorm'

export type MyContext = {
  req: Request & { session: IGetUserIDSession } // & for union?
  res: Response
  redis: Redis
  orm: Connection
  makerLoader: ReturnType<typeof createMakerLoader>
}

interface IGetUserIDSession extends Session {
  userId?: string
}
