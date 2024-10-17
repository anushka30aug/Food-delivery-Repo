const mongoose= require('mongoose');
const {Schema}= mongoose; 
/* A Schema to temporarly store cart data for which online payment session is started
  this is done so that even if user makes any changes in their cart data (adding items or increasing quantity etc)
  the changes doesn't affect the data for which the payment is being started */
const cartItems = new Schema( 
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            require: true
        },
        productQuantity: {
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
    }
)

const deliveryData = new Schema({
    name:{
        type:String,
    },
    contact:{
        type:Number
    },
    address:{
        type:String
    },
    city:{
        type:String
    },
    state:{
        type:String
    },
    pincode:{
        type:Number
    },
    email:{
        type:String
    }
})

const CheckedOutCartItems = new Schema(
{
    customerId:{
        type: String,
        unique:true,
        required:true
    },
    cartItems:[cartItems], 
    deliveryData:deliveryData
})

const CheckOut = mongoose.model('CheckOut',CheckedOutCartItems);
module.exports=CheckOut;
