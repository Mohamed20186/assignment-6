import { MongoClient } from 'mongodb'
import { DB_URI, DB_NAME } from '../config/config.service.js'

const client = new MongoClient(DB_URI)

export let db

export const connectDB = async () => {
  await client.connect()
  db = client.db(DB_NAME)
  await db.command({ ping: 1 })
  console.log('Database connected')
}
