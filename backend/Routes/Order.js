const express = require('express');
const jwt = require('jsonwebtoken');
const Cart = require('../Models/Cart');
const route = express.Router();
const CheckOut = require('../Models/CheckOutItems')
const Order = require('../Models/Order')
const User = require('../Models/User') 
const transporter = require('../Helper/NodeMailer');
const fetchUser = require('../Middleware/fetchUser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

route.post('/digitalPayment', fetchUser, async (req, res) => {
  try {
    const { products,delivery_detail } = req.body;
    // perform check to ensure that all the cartItems are deliverable to provided location
    const deliverableProducts = products.map(product=>{
      if(product.seller_City.toUpperCase() !== delivery_detail.city.toUpperCase() || product.seller_State.toUpperCase() !== delivery_detail.state.toUpperCase())
      {
        return undefined
      }
      else{
        return product
      }
    }).filter(product=> product !== undefined)

    const id = req.user.id;
    key = id.toString() + Date();
    // to store the customer checkOut cart items temporarily
    CheckOut.create({
      customerId: key,
      cartItems: deliverableProducts,
      deliveryData:delivery_detail
    })

    const lineItems = deliverableProducts.map((product) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: product.name,
          images: [product.image]
        },
        unit_amount: product.price * 100,
      },
      quantity: product.productQuantity,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,

      metadata: {
        key: key,
        customerId: id
      },
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/failure',
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.post('/webhook', express.json({ type: 'application/json' }), async (request, response) => {
  const event = request.body;
  try {
    switch (event.type) {
      case 'checkout.session.completed':

        const checkoutSessionCompleted = event.data.object;
        const key = checkoutSessionCompleted.metadata.key;
        const customerId = checkoutSessionCompleted.metadata.customerId;

        // to find the user from CheckOut schema by using the user id
        const UserCheckOutData = await CheckOut.findOne({ customerId: key })
        const CheckedItems = UserCheckOutData.cartItems;

        const UserCart = await Cart.findOne({ customerId });
        let quantity = 0;
        const updatedCartItems = UserCart.cartItems.map(items => {

          // know if the item(product) was checkedOut by user or not
          // this is for scenario in case where user proceeds for payment in one tab and open app in new tab and adds item to cart
        let checkedProduct = CheckedItems.find(product => product._id.toString() == items._id.toString())

          // if item exist in checkedItems , decrease the quantity of items from cart
          // remaining cart item quantity = initial cart item quantity - quantity of the item checkedOut
          if (checkedProduct) {
            if (checkedProduct.productQuantity === items.productQuantity) {
              return undefined;
            }
            else {
              // of the item is not checked
              items.productQuantity = items.productQuantity - checkedProduct.productQuantity;
              quantity += items.productQuantity;
              return { ...items }
            }
          }
          else {
            // if the item was not checkedOut by user put it as it is to updatedCartItems without decreasing its quantity 
            quantity += items.productQuantity;
            return { ...items }
          }
        }).filter(item => item !== undefined);


        // update user cart by removing the items whose order are placed and
        // updating the totalQuantity of product in user cart
        await Cart.updateOne(
          { customerId },
          {
            $set: { totalQuantity: quantity, cartItems: updatedCartItems }
          }
        );
         
          const orderedItem=CheckedItems.map((item)=>({
            delivery_address:`${UserCheckOutData.deliveryData.address},${UserCheckOutData.deliveryData.city},${UserCheckOutData.deliveryData.state}`,
            deliver_to:`${UserCheckOutData.deliveryData.name}`,
            contact_number:`${UserCheckOutData.deliveryData.contact}`,
            payment_status:'Done',
            productDetail:item
          }))

        // push the checkedOut items in order db 
        const userOrder = await Order.findOne({ customerId })
        if (userOrder) {
          userOrder.orderedItems = [...userOrder.orderedItems, ...orderedItem]
          userOrder.save();
        }
        else {
          Order.create({
            customerId: customerId,
            orderedItems: orderedItem
          })
        }

        // delete temporary stored checkedout data
        const result = await CheckOut.deleteOne({ customerId: key })

        //send mail to customer
        const customer = await User.findById(customerId).select('-password');
        const { name, email } = customer;

        // Generate HTML table dynamically
        const tableRows = CheckedItems.map(item => `
      <tr>
       <td>${item.name}</td>
      <td>${item.productQuantity}</td>
      <td>${item.price}</td>
     </tr>
    `).join('');

        // HTML template with dynamic table rows
        const html = `
    <p>Hello dear ${name}, your order has been placed for the following items:</p>
    <table border="1">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Quantity</th>
          <th>Price per unit</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
    <h3>Payment Mode - Online </h3>
    <h4>Payment status - Done </h4> 
    `;

        await transporter.sendMail({
          from: '"Anushka shukla👻" <anushkashukla3003@gmail.com>',
          to: `${email}`,
          subject: "Order placed",
          text: `Hello dear ${name} , your order has been placed successfully`,
          html: html,
        });

        break;


      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    response.json({ received: true });
  }
  catch (error) {
    response.status(404).send({ error: 'error occured' })
  }
});

route.post('/OfflinePayment', fetchUser, async (req, res) => {
  try {
    const { CartData,delivery_detail } = req.body;
    const userId = req.user.id;
    //check if the cart items are deliverable to the delivery city and state 
    // create an array of deliverable products
    const deliverableProducts = CartData.map(product=>{
      if(product.seller_City.toUpperCase() !== delivery_detail.city.toUpperCase() || product.seller_State.toUpperCase() !== delivery_detail.state.toUpperCase())
      {
        return undefined
      }
      else{
        return product
      }
    }).filter(product=> product !== undefined)

    //create object for each item with additional information
    const orderedItem=deliverableProducts.map((item)=>({
      delivery_address:`${delivery_detail.address},${delivery_detail.city},${delivery_detail.state}`,
      deliver_to:`${delivery_detail.name}`,
      contact_number:`${delivery_detail.contact}`,
      payment_status:'pending',
      productDetail:item
    }))

    const userOrder = await Order.findOne({ customerId:userId })
    if (userOrder) {
      userOrder.orderedItems = [...userOrder.orderedItems, ...orderedItem]
      userOrder.save();
    }
    else {
      Order.create({
        customerId: userId, 
        orderedItems: orderedItem
      })
    }
   

    const UserCart = await Cart.findOne({ customerId:userId });
    let quantity = 0;
    const updatedCartItems = UserCart.cartItems.map(items => {

    //find the non-deliverable product from cart and return them
    let checkedProduct = deliverableProducts.find(product => product._id.toString() == items._id.toString())
     if(checkedProduct)
     { 
         return undefined;
     }
     else{
      quantity+=items.productQuantity;
      return items;
     }
    }).filter(item => item !== undefined);


    //update user cart by removing the items whose order are placed and
    // updating the totalQuantity of product in user cart
    await Cart.updateOne(
      { customerId:userId },
      {
        $set: { totalQuantity: quantity, cartItems: updatedCartItems }
      }
    );


    //send mail to customer
    const customer = await User.findById(userId).select('-password');
    const { name, email } = customer;

    // Generate HTML table dynamically
    const tableRows = deliverableProducts.map(item => `
         <tr>
          <td>${item.name}</td>
          <td>${item.productQuantity}</td>
          <td>${item.price}</td>
         </tr>
         `).join('');

    // HTML template with dynamic table rows
    const html = `
          <p>Hello dear ${name}, your order has been placed for the following items:</p>
            <table border="1">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price per unit</th>
                </tr>
              </thead>
            <tbody> 
         ${tableRows}
            </tbody>
          </table>
            <h3>Payment Mode - Offline </h3>
            <h4>Payment status - Pending </h4> 
          `;

    await transporter.sendMail({
      from: '"Anushka shukla👻" <anushkashukla3003@gmail.com>',
      to: `${email}`,
      subject: "Order placed",
      text: `Hello dear ${name} , your order has been placed successfully`,
      html: html,
    });
    res.status(200).send({ success: "sucessful" })
  }
  catch (error) {
    res.status(400).send({ fail: 'failed' })
  }
})



module.exports = route;