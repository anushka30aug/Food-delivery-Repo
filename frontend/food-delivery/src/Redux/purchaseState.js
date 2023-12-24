import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
const host = process.env.REACT_APP_API_IP_ADDRESS;

export const fetchuser = createAsyncThunk('/fetchUser',async()=>{
    const response = await fetch(`${host}/delivery/auth/fetchUser`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
        }     
    })
    const data = await response.json();
    return data;
})

const purchaseSlice = createSlice({
    name:'customer data',
    initialState:{
        name:null,
        address:null,
        city:null,
        state:null,
        pincode:null,
        contact:null
    },
    reducers:{
        changeAddress(state,action){
            state.city=action.payload.city;
            state.state=action.payload.state;
            state.address=action.payload.address;
            state.pincode=action.payload.pincode;
            state.name=action.payload.name;
            state.contact=action.payload.contact        
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchuser.pending,(state,action)=>{
            toast("fetching user details")
        })
        .addCase(fetchuser.fulfilled,(state,action)=>{
            if(action.payload.not_found)
            {
                toast.error("user not found")
            }
            else if(action.payload.error)
            {
                toast.error("unexpected error occured")
            }
            else{
                state.name=action.payload.data.name;
                state.contact=action.payload.data.contact;
                state.address=action.payload.data.address;
                state.city=action.payload.data.city;
                state.state=action.payload.data.state;
                state.pincode=action.payload.data.pincode;
            }
        })
        .addCase(fetchuser.rejected,(state,action)=>{
             toast.error("unexpected error occured")
        })
    }
})
export const {changeAddress}=purchaseSlice.actions;
export default purchaseSlice.reducer;