import { toObjectIdIfValid } from '../../common/object-id.validator.js'
import { logsCollection } from '../../db/models/index.js'

export const createLog = async (req, res) => {
  const { book_id, action } = req.body

  if (!book_id || !action) {
    return res.status(400).json({ message: 'book_id and action are required' })
  }

  const result = await logsCollection().insertOne({ book_id: toObjectIdIfValid(book_id), action })

  return res.status(201).json(result)
}
