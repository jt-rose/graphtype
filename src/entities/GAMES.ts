import { CONSOLES } from './CONSOLES'
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  BaseEntity,
} from 'typeorm'
import { Field, Int, ObjectType, registerEnumType } from 'type-graphql'

enum Ratings {
  AO = 'AO',
  E = 'E',
  E10plus = 'E10+',
  EC = 'EC',
  K_A = 'K-A',
  M = 'M',
  RP = 'RP',
  T = 'T',
}

registerEnumType(Ratings, {
  name: 'Ratings',
  description: 'video game ratings for content',
})

@ObjectType()
@Entity()
export class GAMES extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn()
  id!: number

  @Field()
  @Column()
  name!: string

  @Field()
  @ManyToOne(() => CONSOLES)
  @JoinColumn({ name: 'console' })
  console!: CONSOLES

  @Field(() => Int)
  @Column({ type: 'integer' })
  year_of_release!: number

  @Field()
  @Column()
  genre: string

  @Field()
  @Column()
  publisher!: string

  // millions
  @Field()
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  NA_players!: number

  @Field()
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  EU_players!: number

  @Field()
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  JP_players!: number

  @Field()
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  other_players!: number

  @Field()
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  global_players!: number

  @Field(() => Int)
  @Column({ nullable: true })
  critic_score!: number

  @Field(() => Int)
  @Column({ nullable: true })
  critic_count!: number

  @Field()
  @Column({ type: 'decimal', precision: 2, scale: 1, nullable: true })
  user_score!: number

  @Field(() => Int)
  @Column({ nullable: true })
  user_count: number

  @Field()
  @Column({ nullable: true })
  Developer: string

  @Field(() => Ratings)
  @Column('varchar', { length: 4, nullable: true })
  Rating: Ratings

  @Field(() => String)
  @Column({ unique: true })
  unique_by_name: string

  @Field(() => String)
  @Column({ unique: true })
  unique_by_year: string
}
