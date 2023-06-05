import express from 'express'
import {
    createCategory,
    deleteCategory,
    readAllCategories,
    updateCategory,
} from '../../controllers/categories'

const router = express.Router()

router.post('/new', createCategory)

router.get('/', readAllCategories)

router.patch('/update/:category_id', updateCategory)

router.delete('/delete/:category_id', deleteCategory)

export default router
