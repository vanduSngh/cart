const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    quantityOfBook: { type: Number, default: null },
    quantityOfSanitizer: { type: Number, default: null },
    quantityOfBag: { type: Number, default: null },
    totalAmount: { type: Number, default: null },
    promoCode: { type: String, default: 'PRIME123' },
    totalAmountAfterApplyingPromoCode: { type: Number, default: null },
});
module.exports = mongoose.model("Cart", cartSchema);


