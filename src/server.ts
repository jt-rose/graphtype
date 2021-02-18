import 'reflect-metadata'
import dotenv from 'dotenv'
import express from 'express'
import Redis from 'ioredis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { apolloLogger } from './utils/apolloLogger'
import { createConnection } from 'typeorm'
import { GAMES } from './entities/GAMES'
import { CONSOLES } from './entities/CONSOLES'
import { CONSOLE_MAKERS } from './entities/CONSOLE_MAKERS'
import { USERS } from './entities/USERS'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { GamesResolver } from './resolvers/gamesResolver'
import { UsersResolver } from './resolvers/usersResolver'
import { MyContext } from './utils/types'
import { COOKIE_NAME } from './utils/constants'
import { createMakerLoader } from './utils/makerLoader'

/* ----------------------------- set up express ----------------------------- */

dotenv.config()

const main = async () => {
  const app = express()

  const RedisStore = connectRedis(session)
  const redis = new Redis() // auto-connect when on localhost

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      },
      secret: process.env.COOKIE_SECRET as string,
      resave: false,
      saveUninitialized: false,
    })
  )

  /* ----------------------------- set up typeORM ----------------------------- */

  const orm = await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: true, // disable in prod
    entities: [GAMES, CONSOLES, CONSOLE_MAKERS, USERS],
    namingStrategy: new SnakeNamingStrategy(),
  })

  /* -------------------------- set up apollo server -------------------------- */

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [GamesResolver, UsersResolver],
      validate: false,
    }),
    plugins: [apolloLogger],
    context: ({ req, res }): MyContext => ({
      req,
      res,
      redis,
      orm, // may not need on context
      makerLoader: createMakerLoader(),
    }),
  })

  apolloServer.applyMiddleware({ app })

  /* ----------------------------- listen on port ----------------------------- */

  const port = process.env.LOCAL_PORT

  app.listen(port, () => {
    console.log('listening on port ' + port)
  })
}

main().catch((err) => console.log(err))
