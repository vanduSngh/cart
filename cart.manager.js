const CartModel = require('./cart.model')

const books = (quantity) => {
    let priceOfOne = 100; discountInPercentage = 10; maximumDiscount = 60; priceForDiscount = 500
    let totalCost = priceOfOne * quantity;
    let totalCostBeforeDiscount = totalCost
    let discountedAmount = 0
    if (priceForDiscount <= totalCost) {

        /**
         * Caluclating discount
         */
        discountedAmount = (totalCost / 100) * discountInPercentage
        /*********************************************************************************** */

        maximumDiscount < discountedAmount ? discountedAmount = maximumDiscount : discountedAmount = discountedAmount
        totalCost = totalCost - discountedAmount
    }
    return { discountedAmount, totalCost, totalCostBeforeDiscount };
}

const sanitizer = (quantity) => {
    let priceOfOne = 250; discount = 100; priceForDiscount = 3000
    let totalCostBeforeDiscount = priceOfOne * quantity;
    let totalCost = priceOfOne * quantity;
    priceForDiscount < totalCost ? totalCost = totalCost - discount : ''
    return { discountedAmount: priceForDiscount < totalCost ? discount : 0, totalCost, totalCostBeforeDiscount };
}

const bags = (quantity) => {
    let priceOfOne = 1500;
    let totalCost = priceOfOne * quantity;
    return totalCost
}

const totalCalculation = async () => {
    try {
        /**
         * Getting quantity from database
         */
        let cartData = await CartModel.find({})
        let quantityOfBooks = cartData.length > 0 && cartData[0].quantityOfBook ? cartData[0].quantityOfBook : 0
        let quantityOfSanitizer = cartData.length > 0 && cartData[0].quantityOfSanitizer ? cartData[0].quantityOfSanitizer : 0
        let quantityOfBag = cartData.length > 0 && cartData[0].quantityOfBag ? cartData[0].quantityOfBag : 0
        /*************************************************************************************************************************** */

        /*************************************************************************************************************************** */
        if (quantityOfBooks < 3)
            return { code: 500, data: { msg: 'Minimum 3 books should be in there. Please update your cart' } };
        if (quantityOfSanitizer < 10)
            return { code: 500, data: { msg: 'Minimum 10 Sanitizer should be in there. Please update your cart' } };
        if (quantityOfBag > 2)
            return { code: 500, data: { msg: 'You can only have two bags. Please update your cart' } };
        /*************************************************************************************************************************** */

        /*************************************************************************************************************************** */
        let bookResponse = books(quantityOfBooks)
        let sanitizerResponse = sanitizer(quantityOfSanitizer)
        let totalAmountOfBags = bags(quantityOfBag)
        /*************************************************************************************************************************** */

        let totalAmount = bookResponse.totalCost + sanitizerResponse.totalCost + totalAmountOfBags
        let returnMsg = `Your  total amount is ${totalAmount}. `
        if (totalAmount > 10000) {
            returnMsg += 'Your amount is greater than 10000. Waana apply promocode PRIME123'
        }
        await CartModel.updateOne({ _id: cartData[0]._id }, { totalAmount })
        return { code: 201, data: { returnMsg, totalAmount } }
    } catch (error) {
        console.log(error, 'totalCalculation');
    }
}

const updateQuantityOfItemInCart = async (body) => {
    try {
        querry = body.itemName == 'Books' ? { quantityOfBook: body.quantity }
            : body.itemName == 'Sanitizer' ? querry = { quantityOfSanitizer: body.quantity }
                : body.itemName == 'Bag' ? querry = { quantityOfBag: body.quantity } : ''

        let cartData = await CartModel.find({})
        if (cartData.length > 0) await CartModel.updateOne({ _id: cartData[0]._id }, querry)
        else await CartModel(querry).save()

        if (body.itemName == 'Books' && body.quantity < 3)
            return { code: 500, data: { msg: 'Minimum 3 books should be in there. Please update your cart' } };
        if (body.itemName == 'Sanitizer' && body.quantity < 10)
            return { code: 500, data: { msg: 'Minimum 10 Sanitizer should be in there. Please update your cart' } };
        if (body.itemName == 'Bag' && body.quantity > 2)
            return { code: 500, data: { msg: 'You can only have two bags. Please update your cart' } };

        let msg = ''
        if (body.itemName == 'Books') {
            let bookResponse = books(body.quantity)
            msg = `your total amount of books is ${bookResponse.totalCostBeforeDiscount}.  `
            bookResponse.discountedAmount ? msg += `you're eligible for discount. Total amount after apply discount is ${bookResponse.totalCost}` : "you're not eligible for discount"
        }
        else if (body.itemName == 'Sanitizer') {
            let bookResponse = sanitizer(body.quantity)
            msg = `your total amount of sanitizer is ${bookResponse.totalCostBeforeDiscount}.  `
            bookResponse.discountedAmount ? msg += `you're eligible for discount. Total amount after apply discount is ${bookResponse.totalCost}` : "you're not eligible for discount"

        }
        else if (body.itemName == 'Bag') {
            let bagResponse = bags(body.quantity)
            msg = `your total amount of Bag is ${bagResponse}.  `
        }
        return { code: 201, data: { msg: msg } }
    } catch (error) {
        console.log(error, 'updateQuantityOfItemInCart');
    }
}

const applyPromoCode = async (body) => {
    let cartData = await CartModel.find({})
    if (body.promoCode === cartData[0].promoCode) {
        await CartModel.updateOne({ _id: cartData[0]._id }, { totalAmountAfterApplyingPromoCode: cartData[0].totalAmount - 123 })
        return { code: 201, data: { totalAmountAfterApplyingPromoCode: cartData[0].totalAmount - 123, msg: `Previous amount is: ${cartData[0].totalAmount}, Total amount after applying promocode ${body.promoCode} is ${cartData[0].totalAmount - 123}` } }
    } else
        return { code: 500, data: { msg: `${body.promoCode} This promocode is invalid` } }

}

// http://localhost:6000/cart/totalCalculation/
// {
//     "itemName": "Bag",
//     "quantity": 1
// }
// {
//     "promoCode": "PRIME123"
// }

module.exports = {
    totalCalculation,
    updateQuantityOfItemInCart,
    applyPromoCode
}