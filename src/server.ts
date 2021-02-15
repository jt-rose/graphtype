import 'reflect-metadata'
import dotenv from 'dotenv'
import express from 'express'
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

/* ----------------------------- set up express ----------------------------- */

dotenv.config()

const main = async () => {
  const app = express()

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
      resolvers: [GamesResolver],
      validate: false,
    }),
    plugins: [apolloLogger],
    // context
  })

  apolloServer.applyMiddleware({ app })

  /* ----------------------------- listen on port ----------------------------- */

  const port = process.env.LOCAL_PORT

  app.listen(port, () => {
    console.log('listening on port ' + port)
  })
}

main().catch((err) => console.log(err))
