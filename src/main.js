import express from 'express'
import { MongoServerError } from 'mongodb'
import { PORT } from './config/config.service.js'
import { connectDB } from './db/connection.js'
import { collectionRouter, bookRouter, logRouter } from './module/index.js'

const bootstrap = async () => {
  const app = express()

  app.use(express.json())
  app.use((req, res, next) => {
    req.body ??= {}
    next()
  })

  app.use('/collection', collectionRouter)
  app.use('/books', bookRouter)
  app.use('/logs', logRouter)

  app.use((error, req, res, next) => {
    if (error instanceof MongoServerError) {
      if (error.code === 48) {
        return res.status(409).json({ message: 'Collection already exists.' })
      }
      if (error.code === 121) {
        return res.status(400).json({
          message: 'Document failed validation',
          details: error.errInfo?.details,
        })
      }
      if (error.code === 11000) {
        return res.status(409).json({ message: 'Duplicate key error.' })
      }
    }
    if (error.status && error.status < 500) {
      return res.status(error.status).json({ message: error.message })
    }

    console.error(error)
    return res.status(500).json({ message: 'Internal server error', error: error.message })
  })

  await connectDB()
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
}

bootstrap().catch((error) => {
  console.error('Failed to start the application:', error)
  process.exit(1)
})
