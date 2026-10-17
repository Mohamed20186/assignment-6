import { ObjectId } from 'mongodb'

const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/

export const toObjectIdIfValid = (value) => {
  return typeof value === 'string' && OBJECT_ID_PATTERN.test(value) ? new ObjectId(value) : value
}
