const totalCalculation = function (request, response) {
    require('./cart.manager').totalCalculation()
        .then(result => response.status(result.code).send(result.data))
        .catch(error => response.status(500).send(error.message))
}
const updateQuantityOfItemInCart = function (request, response) {
    require('./cart.manager').updateQuantityOfItemInCart(request.body)
        .then(result => response.status(result.code).send(result.data))
        .catch(error => response.status(500).send(error.message))
}
const applyPromoCode = function (request, response) {
    require('./cart.manager').applyPromoCode(request.body)
        .then(result => response.status(result.code).send(result.data))
        .catch(error => response.status(500).send(error.message))
}

module.exports = {
    totalCalculation,
    updateQuantityOfItemInCart,
    applyPromoCode

}