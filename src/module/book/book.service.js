import { parseNumber } from '../../common/number.validator.js'
import { BOOKS_COLLECTION, booksCollection, logsCollection } from '../../db/models/index.js'

// 5. insert one document into books
export const createBook = async (req, res) => {
  const result = await booksCollection().insertOne(req.body)

  return res.status(201).json(result)
}

export const createBooks = async (req, res) => {
  if (!Array.isArray(req.body) || req.body.length === 0) {
    return res.status(400).json({ message: 'body must be a non-empty array of books' })
  }

  const { acknowledged, insertedIds } = await booksCollection().insertMany(req.body)

  return res.status(201).json({ acknowledged, insertedIds })
}

export const updateBookByTitle = async (req, res) => {
  const { title } = req.params
  const { _id, ...fields } = req.body

  if (Object.keys(fields).length === 0) {
    return res.status(400).json({ message: 'at least one field to update is required' })
  }

  const { acknowledged, matchedCount, modifiedCount } = await booksCollection().updateOne(
    { title },
    { $set: fields }
  )
  if (matchedCount === 0) {
    return res.status(404).json({ message: 'Book not found.' })
  }

  return res.status(200).json({ acknowledged, matchedCount, modifiedCount })
}

export const getBookByTitle = async (req, res) => {
  const { title } = req.query
  if (typeof title !== 'string' || !title) {
    return res.status(400).json({ message: 'title query parameter is required' })
  }

  const book = await booksCollection().findOne({ title })
  if (!book) {
    return res.status(404).json({ message: 'Book not found.' })
  }

  return res.status(200).json(book)
}

export const getBooksBetweenYears = async (req, res) => {
  const from = parseNumber(req.query.from)
  const to = parseNumber(req.query.to)
  if (Number.isNaN(from) || Number.isNaN(to)) {
    return res.status(400).json({ message: 'from and to query parameters must be numbers' })
  }

  const books = await booksCollection()
    .find({ year: { $gte: from, $lte: to } })
    .toArray()

  return res.status(200).json(books)
}

export const getBooksByGenre = async (req, res) => {
  const { genre } = req.query
  if (typeof genre !== 'string' || !genre) {
    return res.status(400).json({ message: 'genre query parameter is required' })
  }

  const books = await booksCollection().find({ genres: genre }).toArray()

  return res.status(200).json(books)
}

export const getBooksSkipLimit = async (req, res) => {
  const books = await booksCollection().find().sort({ year: -1 }).skip(2).limit(3).toArray()

  return res.status(200).json(books)
}

// 13. books where the year field is stored as an integer
export const getBooksWithIntegerYear = async (req, res) => {
  const books = await booksCollection()
    .find({ year: { $type: 'int' } })
    .toArray()

  return res.status(200).json(books)
}

export const getBooksExcludingGenres = async (req, res) => {
  const books = await booksCollection()
    .find({ genres: { $nin: ['Horror', 'Science Fiction'] } })
    .toArray()

  return res.status(200).json(books)
}

export const deleteBooksBeforeYear = async (req, res) => {
  const year = parseNumber(req.query.year)
  if (Number.isNaN(year)) {
    return res.status(400).json({ message: 'year query parameter must be a number' })
  }

  const result = await booksCollection().deleteMany({ year: { $lt: year } })

  return res.status(200).json(result)
}

export const aggregateRecentBooksSorted = async (req, res) => {
  const books = await booksCollection()
    .aggregate([{ $match: { year: { $gt: 2000 } } }, { $sort: { year: -1 } }])
    .toArray()

  return res.status(200).json(books)
}

export const aggregateRecentBooksProjected = async (req, res) => {
  const books = await booksCollection()
    .aggregate([
      { $match: { year: { $gt: 2000 } } },
      { $project: { _id: 0, title: 1, author: 1, year: 1 } },
    ])
    .toArray()

  return res.status(200).json(books)
}

export const aggregateUnwindGenres = async (req, res) => {
  const books = await booksCollection()
    .aggregate([{ $unwind: '$genres' }, { $project: { _id: 0, title: 1, genres: 1 } }])
    .toArray()

  return res.status(200).json(books)
}

export const aggregateLogsWithBooks = async (req, res) => {
  const logs = await logsCollection()
    .aggregate([
      {
        $lookup: {
          from: BOOKS_COLLECTION,
          localField: 'book_id',
          foreignField: '_id',
          as: 'book_details',
        },
      },
      {
        $project: {
          _id: 0,
          action: 1,
          'book_details.title': 1,
          'book_details.author': 1,
          'book_details.year': 1,
        },
      },
    ])
    .toArray()

  return res.status(200).json(logs)
}
