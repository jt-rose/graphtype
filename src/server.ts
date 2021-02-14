import 'reflect-metadata'
import dotenv from 'dotenv'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { apolloLogger } from './utils/apolloLogger'

/* ----------------------------- set up express ----------------------------- */

dotenv.config()

const main = async () => {
  const app = express()

  /* -------------------------- set up apollo server -------------------------- */

  /*
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [],
      validate: false,
    }),
    plugins: [apolloLogger],
    // context
  })

  apolloServer.applyMiddleware({ app })
  */
  /* ----------------------------- listen on port ----------------------------- */

  const port = process.env.LOCAL_PORT

  app.listen(port, () => {
    console.log('listening on port ' + port)
  })
}

main()
