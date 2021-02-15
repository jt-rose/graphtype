import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Field, Int, ObjectType, registerEnumType } from 'type-graphql'
import { CONSOLE_MAKERS } from './CONSOLE_MAKERS'

enum ConsoleType {
  home = 'home console',
  handheld = 'handheld',
}

registerEnumType(ConsoleType, {
  name: 'Console Type',
  description: 'handheld or home console',
})

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

  @Field(() => ConsoleType)
  @Column()
  console_type: ConsoleType

  @Field()
  @ManyToOne(() => CONSOLE_MAKERS, (maker) => maker.maker)
  @JoinColumn({ name: 'maker' })
  maker!: CONSOLE_MAKERS
}
