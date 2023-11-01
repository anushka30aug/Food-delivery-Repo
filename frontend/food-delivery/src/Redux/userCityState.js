import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from 'react-hot-toast';
export const fetchPayload = createAsyncThunk('/fetchPayload', async () => {
    const resp = await fetch(`http://192.168.109.74:5000/delivery/auth/fetchUser`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
        }
    })
    const data = await resp.json();
    return data;
})

export const fetchCity = createAsyncThunk('fetchCity', async (coordinates) => {
    const resp = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&localityLanguage=en`);
    const data = await resp.json();
    return data;
})

const userSlice = createSlice({
    name: 'user',
    initialState: {
        loading: false,
        error: false,
        city: null,
    },
    reducers:{
        changeCity(state,action)
        {
            state.city = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCity.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCity.fulfilled, (state, action) => {
                state.loading = false;
                state.city = action.payload.city;
            })
            .addCase(fetchCity.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                toast.error(`can't fetch user details\n try again after sometime...`)
            })
            .addCase(fetchPayload.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPayload.fulfilled, (state, action) => {
                if (action.payload.err) {
                    toast.error('login to validate user');
                    return;
                }
                else if (action.payload.error) {
                    toast.error('unexpected error occured');
                    return;
                }
                state.loading = false;
                state.city = action.payload.city;
            })
            .addCase(fetchPayload.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                toast.error(`can't fetch user details\n try again after sometime...`)
            })


    }
})
export const {changeCity}=userSlice.actions;
export default userSlice.reducer;