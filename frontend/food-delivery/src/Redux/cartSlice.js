import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
const host = process.env.REACT_APP_API_IP_ADDRESS;


export const fetchCartItems = createAsyncThunk('/cart/fetch', async () => {
  const response = await fetch(`${host}/delivery/cart/fetchCartItems`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem('token')
    }
  }
  );
  const data = await response.json();
  return data;
})

export const addToCart = createAsyncThunk('/cart/add', async (item, { getState }) => {
  const product = { ...item , productQuantity: 1 };
  const state = getState();
  const request = { totalQuantity: state.cart.totalQuantity, product: product }
  const response = await fetch(`${host}/delivery/cart/addToCart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem('token')
    },
    body: JSON.stringify(request),
  });
  const data = await response.json();
  return data;
})

export const removeFromCart = createAsyncThunk('/cart/remove', async (_id = null) => {
  const response = await fetch(`${host}/delivery/cart/removeFromCart`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem('token')
    },
    body: JSON.stringify({ productId: _id }),
  })
  const data = await response.json();
  return data;
})

export const updateQuantity = createAsyncThunk('/cart/updateQuantity', async (_id, { getState }) => {
  const state = getState();
  const { updateSymbol } = state.cart;
  const response = await fetch(`${host}/delivery/cart/updateQuantity`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem('token')
    },
    body: JSON.stringify({ productId: _id, newQuantity: updateSymbol })
  })
  const data = await response.json();
  return data;
})

const initialState = {
  cartItems: [],
  amount: 0,
  totalQuantity: 0,
  updateSymbol: null,
  pending: false,
  error: false
};
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetTotal(state){
      // used when user log out bcz we can update the session storage due to redux persist 
      state.totalQuantity = 0;
      state.amount=0;
      state.cartItems=[];
    },
    increase: (state) => {
      state.updateSymbol = "+";
    },
    decrease: (state) => {
      state.updateSymbol = '-';
    },
    calculateAmount: (state) => {
      let amount = 0;
      state.cartItems.forEach((item) => {
        amount += item.productQuantity * item.price;
      });
      state.amount = amount;
    },
    nonDeliverableAmount: (state,action)=>{
     const itemsWithDifferentCity= action.payload;
     let amount = 0;
     itemsWithDifferentCity.forEach((item)=>{
      amount+= item.productQuantity*item.price;
     })
    //  console.log("inside nonDeliverableAmount "+ amount)
     state.amount -= amount;
    //  console.log("inside nonDeliverableAmount "+ state.amount)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.pending = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.pending = false;
        if (action.payload.error) {
          toast.error(`${action.payload.error}`)
        }
        else if (action.payload.noDataFound) {

        }
        else {
          state.cartItems = [];
          state.cartItems = [...state.cartItems, ...action.payload.cartItems];
          state.totalQuantity = action.payload.totalQuantity;
        }
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.pending = false;
        state.error = action.error.message
        console.log(state.error)
      })
      .addCase(addToCart.pending, (state, action) => {
        state.pending = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.pending = false;
        if (action.payload.error) {
          toast.error(`${action.payload.error}`)        }
        else {
          if (action.payload.newCart) {
            state.cartItems = [...state.cartItems, action.payload.newCart]
            state.totalQuantity += 1
            toast.success('item added to cart')
          }

          else if (action.payload.product) {
            state.cartItems = [...state.cartItems, action.payload.product]
            state.totalQuantity += 1
            toast.success('item added to cart')
          }

          else if (action.payload.id) {
            state.cartItems.forEach((items) => {
              if (items._id === action.payload.id) {
                items.productQuantity += 1;
                toast.success('item added to cart')
              }
              state.totalQuantity += 1
            })
          }
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.pending = false;
        console.log('request rejected to add to cart')
      }
      )
      .addCase(removeFromCart.pending, (state, action) => {
        state.pending = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.pending = false;
        if (action.payload.error) {
          toast.error(`${action.payload.error}`)        }
        else if (action.payload.notFound) {
          toast.error('user cart not found')
        }
        else {
          state.cartItems = action.payload.userCart.cartItems;
          state.totalQuantity = action.payload.userCart.totalQuantity;
        }
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.pending = false;
        console.log('request rejected to remove from cart')
      })
      .addCase(updateQuantity.pending, (state, action) => {
        state.pending = true;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.pending = false;
        if (action.payload.error) {
          toast.error(`${action.payload.error}`)        }
        else if (action.payload.notFound) {
          toast.error('user cart not found')
        }
        else {
          state.cartItems = action.payload.userCart.cartItems;
          state.totalQuantity = action.payload.userCart.totalQuantity;
        }
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.pending = false;
        console.log('request rejected to update quantity')
      })
  }
})

export const { resetTotal,increase, decrease, calculateAmount, nonDeliverableAmount } = cartSlice.actions;
export default cartSlice.reducer;
