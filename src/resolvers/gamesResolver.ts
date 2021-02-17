import { GAMES } from './../entities/GAMES'
import {
  Resolver,
  Query,
  UseMiddleware,
  Arg,
  Int,
  ObjectType,
  Field,
} from 'type-graphql'
import { isAuth } from './../middleware/isAuth'
import { getConnection } from 'typeorm'

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

@Resolver()
export class GamesResolver {
  @Query(() => String)
  @UseMiddleware(isAuth)
  hello() {
    return 'apollo resolver online'
  }

  @Query(() => PaginatedGames)
  @UseMiddleware(isAuth)
  async gamesByYear(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null
  ) {
    /*const realLimit = Math.min(50, limit)
    const realLimitPlusOne = realLimit + 1

    const games = await getConnection().query(`
    SELECT * FROM games
    ${cursor ? 'WHERE unique_by_year > $1' : ''}
    ORDER BY unique_by_year ASC
    LIMIT $2;
    `, [cursor, realLimitPlusOne])

    return {
      games: games.slice(0, realLimit),
      hasMore: games.length === realLimitPlusOne
    }*/
    const games = await findGamesByYear({ cursor, limit })
    return games
  }

  @Query(() => PaginatedGames)
  @UseMiddleware(isAuth)
  async gamesByName(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null
  ) {
    /*const realLimit = Math.min(50, limit)
    const realLimitPlusOne = realLimit + 1

    const games = await getConnection().query(`
    SELECT * FROM games
    ${cursor ? 'WHERE unique_by_year > $1' : ''}
    ORDER BY unique_by_year ASC
    LIMIT $2;
    `, [cursor, realLimitPlusOne])

    return {
      games: games.slice(0, realLimit),
      hasMore: games.length === realLimitPlusOne
    }*/
    const games = findGamesByName({ cursor, limit })
    return games
  }
}
