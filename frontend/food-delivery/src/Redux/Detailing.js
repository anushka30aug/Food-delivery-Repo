import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { json } from "react-router";
const host = process.env.REACT_APP_API_IP_ADDRESS;

export const fetchData = createAsyncThunk(
  '/fetch',
  async (id) => {
    console.log("fetching data for id", id);
    const response = await fetch(`${host}/delivery/data/fetchSingleProduct?id=${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
    const data = await response.json();
    // console.log(data)
    return data;
  }
)

export const fetchSingleOrder=createAsyncThunk('/fetch/order',async(id)=>{
  console.log("insile fetch single order");
  const response = await fetch(`${host}/delivery/buy/fetchSingleOrder?orderedItemsId=${id}`,
    {
      method:'GET',
      headers:{
        'Content-type':'application/json',
      }
      // body:JSON.stringify({orderedItemsId:id})
    }
  );
  const data = await response.json();
  // console.log(data);
  return data;
})


const Detailing = createSlice(
  {
    name: 'Detail',
    initialState: {
      showdetail: false,
      productDetail: {},     //to show detailing of a product being clicked
      restaurantDetail: {},
      orderDetail: {}
    },
    reducers: {
      setModal(state, action) {
        state.showdetail = action.payload
      },
      setProductDetail(state, action) {
        state.productDetail = action.payload
      },
      setRestDetail(state, action) {
        state.restaurantDetail = action.payload;
      },
      setOrderDetail(state, action) {
        state.orderDetail = action.payload
      },
    
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchData.pending, (state) => {

        })
        .addCase(fetchData.fulfilled, (state, action) => {
          console.log(action.payload.data)
          if (action.payload.data)
            state.productDetail = action.payload.data;
          else {
            toast.error(action.payload.error);
          }
        })
        .addCase(fetchData.rejected, (state) => { 
          toast.error("Network issue");
        })
        .addCase(fetchSingleOrder.pending,(state)=>{

        })
        .addCase(fetchSingleOrder.fulfilled,(state,action)=>{
          if(action.payload.success){
            state.orderDetail = action.payload.order[0];
          }
          else{
            toast.error(`${action.payload.error}`)
          }
        })
        .addCase(fetchSingleOrder.rejected,(state,action)=>{
          console.log(action)
            toast.error('Poor Network connection');
        })
    }
  }
)

export const { setModal, setProductDetail, setRestDetail, setOrderDetail } = Detailing.actions;
export default Detailing.reducer;