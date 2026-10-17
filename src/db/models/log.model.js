import { db } from '../connection.js'

export const LOGS_COLLECTION = 'logs'

export const LOGS_CAPPED_SIZE = 1024 * 1024

export const logsCollection = () => db.collection(LOGS_COLLECTION)
