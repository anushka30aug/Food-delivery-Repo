import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
export const fetchRestaurants = createAsyncThunk('/fetch/restaurants',async(_,{getState})=>{
    const state=getState();
    const resp = await fetch(`http://192.168.109.74:5000/delivery/data/fetchRestaurant?city=${state.userCity.city}&rating=${state.restaurantData.rating}&name=${state.restaurantData.name}&page=${state.restaurantData.page}`,
    {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
     const data= await resp.json();
     return data;
})
const restaurantSlice = createSlice({
    name:'reataurant',
    initialState:{
        data:[],
        totalResults:0,
        page:1,
        city:null,
        rating:'all',
        name:'none',
        loading:'false',
        error:'false'
    },
    reducers:{
        setName(state,action)
        {
            state.name=action.payload
            state.data=[];
            state.totalResults=0;
            state.page=1;
            state.rating='all';
        },
        setRating(state,action)
        {
            state.rating=action.payload;
            state.data=[];
            state.totalResults=0;
            state.name='none';
            state.page=1;
        },
        incrementPage(state)
        {
          state.page+=1;
        },
        reset(state)
        {
            state.data=[];
            state.totalResults=0;
            state.page=1;
            state.rating="all";
            state.name="none";
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchRestaurants.pending,(state)=>{
            state.loading='true'
        })
        .addCase(fetchRestaurants.fulfilled,(state,action)=>{
            state.loading=false;
            if(action.payload.err)
            {
                toast.error('no Restaurant found');
                return;
            }
            else if(action.payload.error)
            {
                toast.error('unexpected error occured');
                return;
            }
            if(state.page===1)
            {
                state.data=[];
            }
            state.totalResults=action.payload.totalResults;
            state.data = [...state.data, ...action.payload.data];
        })
        .addCase(fetchRestaurants.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.error;
            toast.error('error occured')
        })

        
    }

})
export const {setName,incrementPage,setRating,reset}=restaurantSlice.actions;
export default restaurantSlice.reducer;