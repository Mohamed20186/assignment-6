import dotenv from 'dotenv'
import { resolve } from 'node:path'

const NODE_ENV = process.env.NODE_ENV ?? 'development'

const envFiles = {
  development: 'development.env',
  production: 'production.env',
}

dotenv.config({
  path: resolve(process.cwd(), envFiles[NODE_ENV] ?? envFiles.development),
  quiet: true,
})

export const PORT = Number(process.env.PORT) || 3000
export const DB_URI = process.env.DB_URI || 'mongodb://127.0.0.1:27017'
export const DB_NAME = process.env.DB_NAME || 'Assignment7'
