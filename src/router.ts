import { Router } from 'express'
import { body } from 'express-validator'
import { addNewProduct, deleteProduct, getAllProducts, getUniqueProduct, updateProduct } from './handlers/product'
import { createUpdate, deleteUpdate, getAllUpdates, getOneUpdate, modifyUpdate } from './handlers/update'
import { inputErrorHandler } from './modules/middleware'
const router = Router()

//for products
router.get('/products', getAllProducts)
router.get('/products/:id',getUniqueProduct)
router.post('/products',body('name').isString(),inputErrorHandler,addNewProduct)
router.put('/products/:id',body('name').isString(),inputErrorHandler,updateProduct)
router.delete('/products/:id',deleteProduct)

//for updates
router.get('/updates', getAllUpdates)
router.get('/updates/:id', getOneUpdate)
router.post('/updates',
    body('title').exists().isString(),
    body('body').exists().isString(),
    body('productId').exists().isString(),
    inputErrorHandler,
    createUpdate)
router.put('/updates/:id',
    body('title').optional().isString(),
    body('body').optional().isString(),
    body('status').isIn(['IN_PROGRESS','LIVE','ARCHIVED','DEPRECATED']),
    body('versions').optional().isString(),
    inputErrorHandler,
    modifyUpdate)
router.delete('/updates/:id',deleteUpdate)

//for sub updates

router.get('/subupdates',()=>{})
router.get('/subupdates/:id',()=>{})
router.post('/subupdates',
    body('name').exists(),
    body('description').exists(),
    inputErrorHandler,
() => {})
router.put('/subupdates/:id',
    body('name').optional().isString(),
    body('description').optional().isString(),
    inputErrorHandler,
    () => {})
router.delete('/subupdates/:id',()=> {})


router.use((err,req,res,next)=> {
    if (err.type == 'auth') {
        res.status(401).json({message: 'unauthorisedd'})
    } else if(err.type == 'input') {
        res.status(400).json({message: 'invalid input'})
    } else {
        res.status(500).json({message: 'Sry try again later'})
    }
})

export default router