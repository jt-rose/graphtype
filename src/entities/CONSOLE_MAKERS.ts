import { Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { Field, ObjectType } from 'type-graphql'
import { CONSOLES } from './CONSOLES'

@ObjectType()
@Entity()
export class CONSOLE_MAKERS {
  @Field()
  @PrimaryColumn()
  maker!: string

  @OneToMany(() => CONSOLES, (consoles) => consoles.maker)
  consoles!: CONSOLES
}
