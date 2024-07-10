import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
const host = process.env.REACT_APP_API_IP_ADDRESS;

export const fetchuser = createAsyncThunk('/fetchUser', async () => {
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

export const editUserProfile = createAsyncThunk('/editUserProfile', async ({ name,number }) => {
    const response = await fetch(`${host}/delivery/user/editProfile`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "auth-token": localStorage.getItem('token')
        },
        body: JSON.stringify({ name: name, contact: number })
    })
    const data = await response.json();
    return data;
})

export const uploadProfilePicture = createAsyncThunk('/upload', async ({ photo }) => {
    const formData = new FormData();
    formData.append('photo', photo);
    const data = await fetch(`${host}/delivery/user/upload`,
        {
            method: 'POST',
            headers:{
            "auth-token": localStorage.getItem('token')
            },
            body: formData
        }
    );
    const response = await data.json();
    return response;
});

const customerDataSlice = createSlice({
    name: 'customer data',
    initialState: {
        name: null,
        address: null,
        city: null,
        state: null,
        pincode: null,
        contact: null,
        email: null,
        profilePicture:null,
        editProfile: false
    },
    reducers: {
        changeAddress(state, action) {
            state.city = action.payload.city;
            state.state = action.payload.state;
            state.address = action.payload.address;
            state.pincode = action.payload.pincode;
            state.name = action.payload.name;
            state.contact = action.payload.contact
            state.profilePicture=action.payload.profilePicture;
        },
        setProfile(state, action) {
            state.editProfile = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchuser.pending, (state, action) => {
                toast("fetching user details")
            })
            .addCase(fetchuser.fulfilled, (state, action) => {
                if (action.payload.not_found) {
                    toast.error("user not found")
                }
                else if (action.payload.error) {
                    toast.error(`${action.payload.error}`);
                }
                else {
                    state.name = action.payload.data.name;
                    state.contact = action.payload.data.contact;
                    state.email = action.payload.data.email;
                    state.address = action.payload.data.address;
                    state.city = action.payload.data.city;
                    state.state = action.payload.data.state;
                    state.pincode = action.payload.data.pincode;
                    state.profilePicture=action.payload.data.profilePicture;
                }
            })
            .addCase(fetchuser.rejected, (state, action) => {
                toast.error("Network error")
            })
            .addCase(editUserProfile.fulfilled, (state, action) => {
                if (action.payload.error) {
                    toast.error(`${action.payload.error}`);
                }
                else {
                    toast.success('updated successfully')
                }
            })
            .addCase(editUserProfile.rejected, (state, action) => {
                toast.error('Networ error')
            })


    }
})
export const { changeAddress, setProfile } = customerDataSlice.actions;
export default customerDataSlice.reducer;