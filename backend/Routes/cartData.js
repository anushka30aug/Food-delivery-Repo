const express = require('express');
const route = express.Router();
const Cart = require('../Models/Cart');
const mongoose = require('mongoose');
const fetchUser = require('../Middleware/fetchUser');

route.get('/fetchCartItems',fetchUser, async (req, res) => {
    
    try { 
        const  userId  = req.user.id;
        const userCart = await Cart.findOne({ customerId :userId});
        if (!userCart || userCart.length === 0) {
            res.status(404).send({ noDataFound: "no cart data found" })
        }
  
        else {
            const cartItems = userCart.cartItems;
            const totalQuantity = userCart.totalQuantity;
            res.status(200).send({ cartItems, totalQuantity });
        }
    }
    catch (error) {
        res.status(400).send({ error: "Internal server error" })
    }
})

route.post('/addToCart',fetchUser, async (req, res) => {
    try {
        const { product } = req.body;
        const userId=req.user.id;
        const userCart = await Cart.findOne({ customerId:userId });
        if (!userCart) {
            Cart.create({
                customerId: userId,
                totalQuantity: 1,
                cartItems: [product]
            }).then(newCart => {
                res.status(200).send({ newCart: newCart.cartItems });
            })
        }
        else {
            const productId = new mongoose.Types.ObjectId(product._id)
            const item = userCart.cartItems.find(items => items._id.equals(productId));
            if (!item) {
                userCart.cartItems.push(product);
                userCart.totalQuantity += 1;
                userCart.save();
                res.status(200).send({ product })
            }
            else {
                item.productQuantity += 1;
                userCart.totalQuantity += 1;
                userCart.save();
                const id = item._id
                res.status(200).send({ id })
            }
        }
    }

    catch (error) {
        res.status(400).send({ error: "Internal server error" })
    }
})

route.delete('/removeFromCart',fetchUser, async(req,res)=>{
    try{
        const {productId} = req.body;
        const userId = req.user.id;
        const userCart = await Cart.findOne({ customerId:userId });
        const itemId = new mongoose.Types.ObjectId(productId)
         if(!userCart)
         {
            res.status(404).send({notFound:"user cart Not Found"})
         }
         else if(!productId)
         {
            userCart.cartItems=[];
            userCart.totalQuantity=0;
            userCart.save();
            res.status(200).send({userCart})
         }
         else{
            const item = userCart.cartItems.find(items => items._id.equals(itemId));
            userCart.totalQuantity-=item.productQuantity;
            userCart.cartItems.pull({_id:productId});
            userCart.save();
            res.status(200).send({userCart})
         }
    }
    catch(error)
    {
        res.status(400).send({error:'Internal server error'})
    }
})

route.put('/updateQuantity',fetchUser,async(req,res)=>{
    try{
    const userId = req.user.id;
    const {productId,newQuantity} = req.body;
    const userCart = await Cart.findOne({customerId:userId});
    if(!userCart)
    {
        res.status(404).send({notFound:"user not found"})
    }
    else{

        const item = userCart.cartItems.find(items => items._id.equals(productId));
        if(newQuantity==='+')
        {
            item.productQuantity+=1;
            userCart.totalQuantity+=1;
        }
        else{
            item.productQuantity-=1;
            userCart.totalQuantity-=1;
        }
        userCart.save();
        res.status(200).send({userCart})
    }
}
catch(error)
{
    res.status(400).send({error:'Internal server error'})
}
})
module.exports = route;
