import { db } from '../../db/connection.js'
import {
  BOOKS_COLLECTION,
  bookValidator,
  LOGS_COLLECTION,
  LOGS_CAPPED_SIZE,
  booksCollection,
  authorsCollection,
} from '../../db/models/index.js'

export const createBooksCollection = async (req, res) => {
  const result = await db.command({ create: BOOKS_COLLECTION, validator: bookValidator })

  return res.status(201).json({ ok: result.ok })
}

export const createAuthorsCollection = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: 'author data is required' })
  }

  const result = await authorsCollection().insertOne(req.body)

  return res.status(201).json(result)
}

export const createCappedLogsCollection = async (req, res) => {
  const result = await db.command({ create: LOGS_COLLECTION, capped: true, size: LOGS_CAPPED_SIZE })

  return res.status(201).json({ ok: result.ok })
}

export const createBooksTitleIndex = async (req, res) => {
  const indexName = await booksCollection().createIndex({ title: 1 })

  return res.status(201).send(indexName)
}
