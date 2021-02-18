import { getConnection } from 'typeorm'
import DataLoader from 'dataloader'

export const createMakerLoader = () =>
  new DataLoader(async (consoles) => {
    const makers = (await getConnection().query(
      `
        SELECT maker, console FROM consoles
        WHERE console = ANY($1)
        `,
      [consoles]
    )) as { maker: string; console: string }[]
    console.log(makers)

    // associate data in correct order
    return consoles.map(
      (console) => makers.find((x) => x.console === console)?.maker
    )
  })
