const routes = require('express').Router()
routes.get('/totalCalculation/', require('./cart.controller').totalCalculation);
routes.post('/updateQuantityOfItemInCart/', require('./cart.controller').updateQuantityOfItemInCart);
routes.post('/applyPromoCode/', require('./cart.controller').applyPromoCode);
module.exports = routes