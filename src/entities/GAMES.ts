import { CONSOLES } from './CONSOLES'
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
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
export class GAMES {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column()
  name!: string

  @Field()
  @ManyToOne(() => CONSOLES, (platform) => platform.platform)
  platform!: CONSOLES

  @Field(() => Int)
  @Column({ type: 'year' })
  year_of_release!: number

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
  User_Score!: number

  @Field(() => Int)
  @Column({ nullable: true })
  User_Count: number

  @Field()
  @Column({ nullable: true })
  Developer: string

  @Field(() => Ratings)
  @Column('varchar', { length: 4, nullable: true })
  Rating: Ratings
}
