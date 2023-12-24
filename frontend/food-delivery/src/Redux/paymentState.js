import { createAsyncThunk } from "@reduxjs/toolkit";
const host = process.env.REACT_APP_API_IP_ADDRESS;

export const digitalPayment = createAsyncThunk('/digitalPayment', async (_, { getState }) => {
    const state = getState();
    const delivery_detail=state.deliveryData;
    const token = localStorage.getItem('token')
    const response = await fetch(`${host}/delivery/buy/digitalPayment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': token
        },
        body: JSON.stringify({ products: state.cart.cartItems , delivery_detail:delivery_detail  })
    });
    const session = await response.json();
    return session;
});

export const offlinePayment = createAsyncThunk('/offlinePayment', async (_, { getState }) => {
    const state = getState();
    const delivery_detail=state.deliveryData;
    const token = localStorage.getItem('token')
    const response = await fetch(`${host}/delivery/buy/OfflinePayment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': token
        },
        body: JSON.stringify({ CartData: state.cart.cartItems , delivery_detail:delivery_detail })
    })
    const data = await response.json();
    return data;
})


