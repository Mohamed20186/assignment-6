import { Router } from 'express'
import * as bookService from './book.service.js'

const router = Router()

router.post('/', bookService.createBook)
router.post('/batch', bookService.createBooks)
router.patch('/:title', bookService.updateBookByTitle)

router.get('/title', bookService.getBookByTitle)
router.get('/year', bookService.getBooksBetweenYears)
router.get('/genre', bookService.getBooksByGenre)
router.get('/skip-limit', bookService.getBooksSkipLimit)
router.get('/year-integer', bookService.getBooksWithIntegerYear)
router.get('/exclude-genres', bookService.getBooksExcludingGenres)
router.delete('/before-year', bookService.deleteBooksBeforeYear)

router.get('/aggregate1', bookService.aggregateRecentBooksSorted)
router.get('/aggregate2', bookService.aggregateRecentBooksProjected)
router.get('/aggregate3', bookService.aggregateUnwindGenres)
router.get('/aggregate4', bookService.aggregateLogsWithBooks)

export default router
