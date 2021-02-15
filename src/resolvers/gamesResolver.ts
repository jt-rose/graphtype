//import { GAMES } from './../entities/GAMES'
import { Resolver, Query } from 'type-graphql'

@Resolver()
export class GamesResolver {
  @Query(() => String)
  hello() {
    return 'apollo resolver online'
  }
}
