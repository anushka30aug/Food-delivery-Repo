const mongoose = require('mongoose');
const { Schema } = mongoose;
const cartItems = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    productQuantity:{
        type:Number,
        required:true  
    },
    image: {  
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    sub_category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required: true
    },
    seller_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seller_City: {
        type: String,
        required: true
    },
    seller_State: {
        type: String,
        required: true
    }
})

const Cart = new Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        unique:true
    },
    totalQuantity: {
        type: Number,
    },
    cartItems: [cartItems]
})

module.exports = mongoose.model('Cart', Cart);
// module.exports= cartItems