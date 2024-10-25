import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from 'react-hot-toast';
const host = process.env.REACT_APP_API_IP_ADDRESS;

export const fetchOrders = createAsyncThunk('/buy/orders', async () => {
  const response = await fetch(`${host}/delivery/buy/fetchOrders`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem('token')
    }
  });
  const data = await response.json();
  return data;
})

const initialState = {
  orderedItems: [],
  pending: false,
  error: false
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers:{
    resetOrders(state){
      state.orderedItems=[];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state, actions) => {
        state.pending = true;
        state.error = false;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.pending = false;
        state.error = false;
        if (action.payload.notFound) {
          toast('No orders')
        }
        else if (action.payload.error) {
          toast.error(`${action.payload.error}`);
        }
        else {
          state.orderedItems=[]
          state.orderedItems = [...state.orderedItems, ...action.payload.orders]
        }
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.pending = false;
        state.error = action.error.message;
        toast.error('Network error');
        console.log(state.error)
      })
  }
})

export const{resetOrders}=ordersSlice.actions;
export default ordersSlice.reducer;

