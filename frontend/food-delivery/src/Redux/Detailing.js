import { createSlice } from "@reduxjs/toolkit";

const Detailing = createSlice(
  {
    name: 'Detail',
    initialState: {
      showdetail: false,
      productDetail: {},     //to show detailing of a product being clicked
      restaurantDetail: {}
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
      }
    }
  }
)

export const { setModal, setProductDetail, setRestDetail } = Detailing.actions;
export default Detailing.reducer;