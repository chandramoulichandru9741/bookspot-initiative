const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');
const router = require('express').Router();
router.post('/:bookId', authController.isLoggined, cartController.addtoCart);
router.delete('/:bookId', authController.isLoggined, cartController.deleteCart);
router.get('/addItem', cartController.addItem);
module.exports = router;
