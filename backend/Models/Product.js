const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
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
});

const Product = mongoose.model('Product', productSchema)

// const jsonData = require('../csvjson.json')
// jsonData.forEach(item => {
//     const product = new Product(item);
//     product.save()
//         .then(savedProduct => {
//             console.log('data saved');
//         })
//         .catch(err => {
//             console.log('error in saving data:', err);
//         });
// });

module.exports = Product;
