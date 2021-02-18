import { GAMES } from './../entities/GAMES'
import {
  Resolver,
  Query,
  UseMiddleware,
  Arg,
  Int,
  ObjectType,
  Field,
  FieldResolver,
  Root,
} from 'type-graphql'
import { isAuth } from './../middleware/isAuth'
import { getConnection } from 'typeorm'

/* ---------------------------- pagination logic ---------------------------- */

@ObjectType()
class PaginatedGames {
  @Field(() => [GAMES])
  games: GAMES[]

  @Field(() => Boolean)
  hasMore: boolean
}

const findGamesByType = (
  searchType: 'unique_by_year' | 'unique_by_name'
) => async (searchBy: {
  cursor: string | null
  limit: number
}): Promise<PaginatedGames> => {
  const { cursor, limit } = searchBy
  const realLimit = Math.min(50, limit)
  const realLimitPlusOne = realLimit + 1

  const replace = cursor ? [realLimitPlusOne, cursor] : [realLimitPlusOne]

  const games =
    searchType === 'unique_by_year'
      ? await getConnection().query(
          `
    SELECT * FROM games
    ${cursor ? 'WHERE unique_by_year > $2' : ''}
    ORDER BY unique_by_year ASC
    LIMIT $1;
    `,
          replace
        )
      : await getConnection().query(
          `
  SELECT * FROM games
  ${cursor ? 'WHERE unique_by_name > $2' : ''}
  ORDER BY unique_by_name ASC
  LIMIT $1;
  `,
          replace
        )

  return {
    games: games.slice(0, realLimit),
    hasMore: games.length === realLimitPlusOne,
  }
}

const findGamesByYear = findGamesByType('unique_by_year')
const findGamesByName = findGamesByType('unique_by_name')

/* ----------------------------- games resolver ----------------------------- */

@Resolver((type) => GAMES)
export class GamesResolver {
  @FieldResolver(() => String, { nullable: true })
  async consoleMaker(@Root() game: GAMES) {
    const maker = await getConnection().query(
      `
    SELECT maker FROM consoles
    WHERE console = $1
    `,
      [game.console]
    )
    console.log(maker)
    return maker[0].maker
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  hello(@Arg('name') name: string) {
    return `hello ${name}`
  }

  @Query(() => PaginatedGames)
  @UseMiddleware(isAuth)
  async gamesByYear(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null
  ) {
    return findGamesByYear({ cursor, limit })
  }

  @Query(() => PaginatedGames)
  @UseMiddleware(isAuth)
  async gamesByName(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null
  ) {
    return findGamesByName({ cursor, limit })
  }
}

// data loader - concept

// individual field resolvers can make their own calls,
// but these don't scale well
// if I look up 10 posts with a single select, where, a seperate
// query will run on each one, making for 11 queries
//
// data loader fixes this

// create a new data loader instance on each call to context
// in that instance, pass a function that will resolve all the batched data
// then do a single query with the full data set
// and follow up by associating each post with the second query results
// 1,2,3 group with [[a,b,c], [e],[]]
// and retunr this coupled object
// reducing the post calls down to 2
// then, in the individual resolver query
// sinmply use dataloaderInstance.load(singleData)
// behind the scenes, data loader will wait until the next step in
// the event loop, when the first sql query has finished
// and then stop loading new data and send call the batched resolver function
// that, in a nutshell, is the n+1 problem and data loader
