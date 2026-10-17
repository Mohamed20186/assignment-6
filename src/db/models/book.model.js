import { db } from '../connection.js'

export const BOOKS_COLLECTION = 'books'

export const bookValidator = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['title'],
    properties: {
      title: {
        bsonType: 'string',
        minLength: 1,
        description: 'title is required and must be a non-empty string',
      },
    },
  },
}

export const booksCollection = () => db.collection(BOOKS_COLLECTION)
