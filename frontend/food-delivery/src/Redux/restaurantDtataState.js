import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
const host = process.env.REACT_APP_API_IP_ADDRESS;

export const fetchRestaurants = createAsyncThunk('/fetch/restaurants', async (_, { getState }) => {
    const state = getState();
    const api = `${host}/delivery/data/fetchRestaurant?city=${state.userCity.city}&rating=${state.restaurantData.rating}&name=${state.restaurantData.name}&page=${state.restaurantData.page}`
    const resp = await fetch(api,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

    const data = await resp.json();
    return data;
})

//seperate function to fetch a single restaurant by its id for any product (visit restaurant option) 
export const fetchRestaurantById = createAsyncThunk('/fetch/restaurant', async (_, { getState }) => {
    const state = getState();
    const api = `${host}/delivery/data/fetchRestaurant?id=${state.restaurantData.id}`
    const resp = await fetch(api,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
    const data = await resp.json();
    return data;
})


const restaurantSlice = createSlice({
    name: 'reataurant',
    initialState: {
        data: [],
        totalResults: 0,
        page: 1,
        city: null,
        id: null,
        rating: 'all',
        name: 'none',
        loading: 'false',
        error: 'false'
    },
    reducers: {
        setName(state, action) {
            state.name = action.payload;
            state.data = [];
            state.totalResults = 0;
            state.page = 1;
            state.rating = 'all';
        },
        setId(state,action)
        {
            state.id=action.payload;
        },
        setRating(state, action) {
            state.rating = action.payload;
            state.data = [];
            state.totalResults = 0;
            state.name = 'none';
            state.page = 1;
        },
        incrementPage(state) {
            state.page += 1;
        },
        reset(state) {
            state.data = [];
            state.totalResults = 0;
            state.page = 1;
            state.rating = "all";
            state.name = "none";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRestaurants.pending, (state) => {
                state.loading = 'true'
            })
            .addCase(fetchRestaurants.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.err) {
                    toast.error(`${action.payload.err}`);
                    return;
                }
                else if (action.payload.error) {
                    toast.error(`${action.payload.error}`);
                    return;
                }
                if (state.page === 1) {
                    state.data = [];
                }
                state.totalResults = action.payload.totalResults;
                state.data = [...state.data, ...action.payload.data];
            })
            .addCase(fetchRestaurants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
                toast.error('Network error')
            })


    }

})
export const { setName, setId, incrementPage, setRating, reset } = restaurantSlice.actions;
export default restaurantSlice.reducer;