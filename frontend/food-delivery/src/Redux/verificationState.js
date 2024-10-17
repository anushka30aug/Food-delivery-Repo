import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
const host = process.env.REACT_APP_API_IP_ADDRESS;

export const sendOtp = createAsyncThunk('/verification/sendOtp',
    async (email) => {
        console.log(`sending otp at email ${email}`)
        const response = await fetch (`${host}/delivery/auth/sendOtp?emailId=${email}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        const data = await response.json();
        return data;
    })

export const verifyOtp = createAsyncThunk('/verification/verifyOtp',
    async (enteredOtp,{getState}) => {
        const state= getState();
        const {email,name}=state.verification;
        const response = await fetch(`${host}/delivery/auth/verifyOtp`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({enteredOtp,email,name}),       
            })
        const data = await response.json();
        return data;
    }
)

export const resetPassword = createAsyncThunk('/verification/reset',
async({password,emailId})=>{
   const response = await fetch(`${host}/delivery/auth/resetPassword`,{
    method:'POST',
    headers:{
        "Content-Type":'application/json'
    },
    body:JSON.stringify({emailId,password})
   })
   const data = await response.json();
   return data;
}
)

// create builders of this function

const verificationSlice = createSlice(
    {
        name: 'verification',
        initialState: {
            loading: false,
            name:null,
            email:null,
            error: null,
            isRecovering:false
        },
        reducers:{
          setRecovering(state,action)
          {
            state.isRecovering=action.payload
          },
          setDetails(state,action){
            state.name=action.payload.name;
            state.email = action.payload.email;
          }
        },
        extraReducers: (builder) => {
            builder
                .addCase(sendOtp.pending, (state) => {
                    state.loading = true;
                })
                .addCase(sendOtp.fulfilled, (state, action) => {
                    state.loading = false;
                    if(action.payload.invaliId)
                    {
                        toast.error('enter valid email address')
                    }
                    if (action.payload.error) {
                        toast.error(`${action.payload.error}`)
                    }
                    else if (action.payload.otp) {
                        toast.success('otp sent successfully')
                    }
                })
                .addCase(sendOtp.rejected, (state, action) => {
                    state.loading = false;
                    toast.error('Network error')

                })

                .addCase(verifyOtp.pending, (state) => {
                    state.loading = true;
                })
                .addCase(verifyOtp.fulfilled, (state, action) => {
                    state.loading = false;
                    if (action.payload.error) {
                        toast.error(`${action.payload.error}`)
                    }
                    else if (action.payload.fail) {
                        toast.error('wrong OTP')
                    }

                })
                .addCase(verifyOtp.rejected, (state, action) => {
                    state.loading = false;
                    toast.error('Network error')
                })

                .addCase(resetPassword.pending,(state,action)=>{
                    state.loading = true;
                })

                .addCase(resetPassword.fulfilled,(state,action)=>{
                    state.loading = false;
                    if(action.payload.notFound)
                    {
                        toast.error('no user found with entered EmailId \n SIGNUP REQUIRED')
                        return
                    }
                    else if(action.payload.error)
                    {
                        toast.error(`${action.payload.error}`);
                        return
                    }
                    localStorage.setItem('token',action.payload.token)
                    toast.success('welcome back !!')
                    sessionStorage.removeItem('recover');
                })
                .addCase(resetPassword.rejected,(state,action)=>{
                    state.loading=false;
                    toast.error('Network error')
                })

        }
    }
)
export const {setRecovering,setDetails} = verificationSlice.actions;
export default verificationSlice.reducer;

