import 'reflect-metadata'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

const main = async () => {
  const app = express()

  const port = process.env.LOCAL_PORT

  app.listen(port, () => {
    console.log('listening on port ' + port)
  })
}

main()
