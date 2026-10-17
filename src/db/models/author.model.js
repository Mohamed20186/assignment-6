import { db } from '../connection.js'

export const AUTHORS_COLLECTION = 'authors'

export const authorsCollection = () => db.collection(AUTHORS_COLLECTION)
