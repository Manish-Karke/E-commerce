const userPublicRouter = require('express').Router();
const { userRoles } = require('../../config/const.config');
const auth = require('../../middleware/auth.middleware');
const categoryCtrl = require('../category/category.controller');
const orderItemsCtrl = require('../orderItems/orderItems.controller');
const productCtrl = require('../product/product.controller');

//public Rotue
userPublicRouter.get('/products', productCtrl.listProduct)
userPublicRouter.get('/products/:id', productCtrl.getSingleProductById)
userPublicRouter.get('/categories', categoryCtrl.listCategory)
userPublicRouter.get('/categories/:id/products', categoryCtrl.listProductByCateogoryId)
userPublicRouter.get('/search', productCtrl.listProduct)

userPublicRouter.post('/checkout/:id', auth(userRoles.CUSTOMER), orderItemsCtrl.checkout)
userPublicRouter.delete('/checkout/remove/:id', auth(userRoles.CUSTOMER), orderItemsCtrl.cancelCheckout)
userPublicRouter.get('/checkout/list', auth(userRoles.CUSTOMER), orderItemsCtrl.checkoutList)
userPublicRouter.post('/checkout/payment/:id', auth(userRoles.CUSTOMER), orderItemsCtrl.khaltPaymentCheckout)

module.exports = userPublicRouter