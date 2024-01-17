import { createSlice } from "@reduxjs/toolkit";

const Detailing = createSlice(
  {
    name: 'Detail',
    initialState: {
      showdetail: false,
      showOrderDetailModal:false,
      productDetail: {},     //to show detailing of a product being clicked
      restaurantDetail: {},
      orderDetail:{}
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
      setOrderDetail(state,action) {
        state.orderDetail=action.payload
      },
      setOrderDetailModal(state,action)
      {
        state.showOrderDetailModal=action.payload;
      }
    }
  }
)

export const { setModal, setProductDetail, setRestDetail,setOrderDetail,setOrderDetailModal } = Detailing.actions;
export default Detailing.reducer;