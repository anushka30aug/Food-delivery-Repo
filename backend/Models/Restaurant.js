const mongoose = require('mongoose');
const { Schema } = mongoose;

const restaurantSchema = new Schema({
    image: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        default: null
    },
    email: {
        type: String,
        required: true,
    },
    contact: {
        type: Number,
        required: true,
    },
    lic_no: {
        type: Number,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true,
        unique: true
    },
    pincode: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);