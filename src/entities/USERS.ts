import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
@Entity()
export class USERS extends BaseEntity {
  @Field()
  @PrimaryColumn()
  username: string

  @Column()
  password: string
}

type ErrorField = 'username' | 'password' | 'unknown'

type ErrorMessage =
  | 'not logged in'
  | 'no such user found'
  | 'username already exists'
  | 'wrong password'
  | 'username must be at least three characters'
  | 'password must be at least three characters'

@ObjectType()
class ErrorResponse {
  @Field()
  field: ErrorField

  @Field()
  message: ErrorMessage
}

@ObjectType()
export class UserResponse {
  @Field(() => ErrorResponse, { nullable: true })
  error?: ErrorResponse

  @Field(() => USERS, { nullable: true })
  user?: USERS

  constructor(response: { error?: ErrorResponse; user?: USERS }) {
    this.user = response.user
    this.error = response.error
  }
}
