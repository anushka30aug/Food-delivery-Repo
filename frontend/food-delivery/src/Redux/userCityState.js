import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from 'react-hot-toast';
const host = process.env.REACT_APP_API_IP_ADDRESS;
export const fetchPayload = createAsyncThunk('/fetchPayload', async () => {
    const resp = await fetch(`${host}/delivery/auth/fetchUser`, {
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
        state:null
    },
    reducers:{
        changeCity(state,action)
        {
            state.city = action.payload
        },
        changeState(state,action){
             state.state=action.payload
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
                state.state=action.payload.principalSubdivision;
            })
            .addCase(fetchCity.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                toast.error(`Network error`)
            })
            .addCase(fetchPayload.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPayload.fulfilled, (state, action) => {
                if (action.payload.err) {
                    toast.error(`${action.payload.err}`);
                    return;
                }
                else if (action.payload.error) {
                    toast.error(`${action.payload.error}`);
                    return;
                }
                state.loading = false;
                state.city = action.payload.data.city;
                state.state=action.payload.data.state;
            })
            .addCase(fetchPayload.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                toast.error(`Network error`)
            })


    }
})
export const {changeCity,changeState}=userSlice.actions;
export default userSlice.reducer;