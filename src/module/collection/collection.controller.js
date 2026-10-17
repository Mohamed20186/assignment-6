import { Router } from 'express'
import * as collectionService from './collection.service.js'

const router = Router()

router.post('/books', collectionService.createBooksCollection)
router.post('/authors', collectionService.createAuthorsCollection)
router.post('/logs/capped', collectionService.createCappedLogsCollection)
router.post('/books/index', collectionService.createBooksTitleIndex)

export default router
