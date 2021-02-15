import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { Field, Int, ObjectType } from 'type-graphql'
import { CONSOLE_MAKERS } from './CONSOLE_MAKERS'

@ObjectType()
@Entity()
export class CONSOLES {
  @Field()
  @PrimaryColumn()
  platform!: string

  @Field()
  @Column()
  full_name!: string

  @Field(() => Int)
  @Column({ type: 'year' })
  year_released: number

  @Field()
  @ManyToOne(() => CONSOLE_MAKERS, (maker) => maker.maker)
  maker!: CONSOLE_MAKERS
}
