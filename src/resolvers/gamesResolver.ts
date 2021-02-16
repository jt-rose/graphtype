//import { GAMES } from './../entities/GAMES'
import { Resolver, Query, UseMiddleware } from 'type-graphql'
import { isAuth } from './../middleware/isAuth'

@Resolver()
export class GamesResolver {
  @Query(() => String)
  @UseMiddleware(isAuth)
  hello() {
    return 'apollo resolver online'
  }
}
