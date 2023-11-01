import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

export const loginUser = createAsyncThunk(
    '/login', async (userCredentials) => {
        const response = await fetch(`http://192.168.109.74:5000/delivery/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userCredentials),
        });
        const data = await response.json();
        return data;
    }
)

const loginSlice = createSlice(
    {
        name: 'login',
        initialState: {
            loading: false,
            user: null,
            error: null
        },
        extraReducers: (builder) => {
            builder
                .addCase(loginUser.pending, (state) => {
                    state.loading = true;
                    state.user = null;
                    state.error = null;

                })
                .addCase(loginUser.fulfilled, (state, action) => {
                    state.loading = false;
                    state.user = action.payload;
                    console.log(state.user);
                    if (state.user.err) {
                        toast.error('enter valid credentials')
                        return
                    }
                    else if (state.user.error) {
                        toast.error('unexpected error occured')
                        return
                    }
                    else if (state.user.notFound) {
                        toast.error('user not found \n signup required!!')
                        return
                    }
                    localStorage.setItem('token', state.user.token)
                    toast.success('welcome');

                    state.error = null;

                })
                .addCase(loginUser.rejected, (state, action) => {
                    state.loading = false;
                    state.user = null;
                    toast.error('kuch locha hai')
                    state.error = action.error.message;

                })
        }
    }
)

export default loginSlice.reducer;