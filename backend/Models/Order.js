const express = require('express');
const mongoose = require('mongoose')
const { Schema } = mongoose;

const cartItem = new Schema(
    { 
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            require: true
        },
        productQuantity: {
            type: Number,
            required: true
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

    }
)

const orderedItems = new Schema({
    delivery_address: {
        type: String,
        required: true
    },
    deliver_to: {
        type: String,
    },
    contact_number: {
        type: Number,
        required: true
    },
    delivery_status: { 
        type: String,
        default: 'processing'
    },
    payment_status: {
        type: String,
        default: 'Pending'
    },
    date: {
        type: Date,
        default: Date.now
    },
    productDetail: cartItem

})

const Orders = new Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    orderedItems: [orderedItems]
})

const Order = mongoose.model('Order', Orders);
module.exports = Order;
