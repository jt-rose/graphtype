import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Field, Int, ObjectType } from 'type-graphql'
import { CONSOLE_MAKERS } from './CONSOLE_MAKERS'

enum ConsoleType {
  home = 'home console',
  handheld = 'handheld',
}

@ObjectType()
@Entity()
export class CONSOLES {
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
  maker!: CONSOLE_MAKERS
}
