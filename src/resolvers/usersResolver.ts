import { MyContext } from './../utils/types'
import { Mutation, Query, Ctx, Arg, Resolver } from 'type-graphql'
import { USERS, UserResponse } from '../entities/USERS'
import argon2 from 'argon2'
import { COOKIE_NAME } from './../utils/constants'

@Resolver()
export class UsersResolver {
  @Query(() => USERS, { nullable: true })
  async fetchUser(@Ctx() { req }: MyContext) {
    const { userId } = req.session
    if (!userId) return undefined

    return USERS.findOne(userId)
  }

  @Mutation(() => UserResponse)
  async createUser(
    @Arg('username') username: string,
    @Arg('password') password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    if (username.length < 3) {
      return new UserResponse({
        error: {
          field: 'username',
          message: 'username must be at least three characters',
        },
      })
    }
    if (password.length < 3) {
      return new UserResponse({
        error: {
          field: 'password',
          message: 'password must be at least three characters',
        },
      })
    }
    try {
      const hashedPassword = await argon2.hash(password)
      const res = await USERS.createQueryBuilder()
        .insert()
        .values({
          username,
          password: hashedPassword,
        })
        .returning('*')
        .execute()
      //const res = await USERS.insert({ username, password: hashedPassword })

      const user = res.raw[0] as USERS
      req.session.userId = user.username
      return new UserResponse({ user })
    } catch (err) {
      if (err.code === '23505') {
        return new UserResponse({
          error: { field: 'username', message: 'username already exists' },
        })
      }
      return err
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('username') username: string,
    @Arg('password') password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    try {
      const user = await USERS.findOne(username)
      if (!user) {
        return new UserResponse({
          error: {
            field: 'username',
            message: 'no such user found',
          },
        })
      }
      const correctPassword = await argon2.verify(user.password, password)
      if (!correctPassword) {
        return new UserResponse({
          error: {
            field: 'password',
            message: 'wrong password',
          },
        })
      }

      req.session.userId = username
      return new UserResponse({ user })
    } catch (err) {
      return err
    }
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME)
        if (err) {
          console.log(err)
          resolve(false)
          return
        }

        resolve(true)
      })
    )
  }
}
