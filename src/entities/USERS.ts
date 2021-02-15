import { Column, Entity, PrimaryColumn } from 'typeorm'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
@Entity()
export class USERS {
  @Field()
  @PrimaryColumn()
  username: string

  @Column()
  password: string
}
