import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
const host = process.env.REACT_APP_API_IP_ADDRESS;

export const fetchUserById = createAsyncThunk('/signup/userExist',async(email)=>{
    const response = await fetch(`${host}/delivery/auth/fetchUserByEmailId?email=${email}`,{
        method:'GET',
        headers:{
            'Content-Type':'application/json'
        }
    })
    const data = response.json();
    return data;
})

export const signupUser = createAsyncThunk(
    '/signup', async (_,{getState}) => {
        const {signup}=getState();
        const response = await fetch(`${host}/delivery/auth/signup`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(signup.user)
        })
        const data = await response.json();
        return data;
    }
)

const signupSlice = createSlice({
    name: 'signup',
    initialState: {
        user:{ name: null, email: null, password: null, address: null, city: null, state: null, country: null, pincode: null, contact: null },
        loading: false,
        response: null,
        error: null
    },
    reducers:{
        setUser(state,action)
        {
          state.user=action.payload
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(signupUser.pending,(state)=>{
            state.loading=true;
            state.response=null;
            state.error=null;
        })
        .addCase(signupUser.fulfilled,(state,action)=>{
            state.loading=false;
            state.response=action.payload;
            if(state.response.err)
            {
                toast.error(state.response.err);
                return;
            }
            else if(state.response.error)
            {
                toast.error(`${action.payload.error}`);
                return;
            }
            else if(state.response.alreadyExist)
            {
                toast.error('user with the email ID already exist')
                return;
            }        
            toast.success('welcome');
            localStorage.setItem('token',state.response.token);
            state.error=null;
        })
        .addCase(signupUser.rejected,(state,action)=>{
            state.loading=false;
            state.response=null;
            state.error=action.error.message;
            toast.error('Network error')
        })
    }
})
export const {setUser}=signupSlice.actions;
export default signupSlice.reducer;