import { Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm'
import { Field, ObjectType } from 'type-graphql'
import { CONSOLES } from './CONSOLES'

@ObjectType()
@Entity()
export class CONSOLE_MAKERS {
  @Field()
  @PrimaryColumn()
  maker!: string

  @Field(() => CONSOLES)
  @OneToMany(() => CONSOLES, (consoles) => consoles.maker)
  @JoinColumn({ name: 'consoles' })
  consoles!: CONSOLES[]
}
