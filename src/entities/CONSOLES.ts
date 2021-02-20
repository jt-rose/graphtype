import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm'
import { Field, Int, ObjectType } from 'type-graphql'
import { CONSOLE_MAKERS } from './CONSOLE_MAKERS'

type ConsoleType = 'home console' | 'handheld'

@ObjectType()
@Entity()
export class CONSOLES extends BaseEntity {
  @Field()
  @PrimaryColumn()
  console!: string

  @Field()
  @Column()
  full_name!: string

  @Field(() => Int)
  @Column({ type: 'integer' })
  year_released: number

  @Field(() => String)
  @Column()
  console_type: ConsoleType

  @Field()
  @ManyToOne(() => CONSOLE_MAKERS, (maker) => maker.maker)
  @JoinColumn({ name: 'maker' })
  maker!: string
}
/*
CONSOLES.insert({ 
  console: 'dc2', 
  full_name: 'dreamcast 2', 
  year_released: 3000, 
  console_type: 'home console', 
  maker: 'Sega' 
})

CONSOLES.find({ where: { console: 'dc2'}})
*/
