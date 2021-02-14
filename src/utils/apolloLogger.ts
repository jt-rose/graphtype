import { GraphQLRequestContext } from 'apollo-server-plugin-base'
import chalk from 'chalk'

export const apolloLogger = {
  // Fires whenever a GraphQL request is received from a client.
  requestDidStart(requestContext: GraphQLRequestContext) {
    const query = requestContext.request.query ?? null
    if (query && !query.includes('IntrospectionQuery')) {
      console.log(chalk.green('Apollo Query: ') + requestContext.request.query)
      /*
            return {
              // Fires whenever Apollo Server will parse a GraphQL
              // request to create its associated document AST.
              parsingDidStart(requestContext) {
                console.log('Parsing started!')
              },
      
              // Fires whenever Apollo Server will validate a
              // request's document AST against your GraphQL schema.
              validationDidStart(requestContext) {
                console.log('Validation started!')
              },*/
    }
  },
}

//}
