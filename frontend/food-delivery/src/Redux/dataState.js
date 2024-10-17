import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const host = process.env.REACT_APP_API_IP_ADDRESS;
export const fetchData = createAsyncThunk(
    '/fetchData',
    async (_, { getState }) => {
        const state = getState();
        const response = await fetch(`${host}/delivery/data/fetchData?category=${state.data.category}&page=${state.data.page}&city=${state.userCity.city}&state=${state.userCity.state}&filter=${state.data.filter}&sub_category=${state.data.sub_category}&name=${state.data.name}&seller_Id=${state.data.seller_Id}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        const data = await response.json();
        return data;
    }
)

const dataSlice = createSlice({
    name: 'data',
    initialState: {
        loading: false,
        error: null,
        page: 1,
        category: null,
        sub_category: 'none',
        name: 'none',
        filter: 'default',
        seller_Id: 'none',
        data: [],
        totalResults: 0,
    },
    reducers: {
        resetValues(state) {
            state.error = null;
            state.page = 1;
            state.name = 'none';
            state.filter = 'default';
            state.seller_Id = 'none';
            state.data = [];
            state.totalResults = 0;
        },
        setSubCategory(state, action) {
            state.sub_category = action.payload;
            state.page = 1;
            state.data = [];
            state.seller_Id = 'none';
            state.totalResults = 0;
        },
        setFilter(state, action) {
            state.filter = action.payload;
            state.page = 1;
            state.seller_Id = 'none';
            state.data = [];
            state.totalResults = 0;
        },
        incrementPage(state) {
            state.page = state.page + 1;
        },
        changeCategory(state, action) {
            state.category = action.payload;
            state.sub_category = 'none';
            state.seller_Id = 'none';
        },
        setSellerId(state, action) {
            state.seller_Id = action.payload;
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchData.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchData.fulfilled, (state, action) => {
                if (action.payload.err) {
                    // toast.error(`${action.payload.err}`) 
                    return;
                }
                else if (action.payload.error) {
                    toast.error(`${action.payload.error}`);
                    return;
                }
                if (state.page === 1) { state.data = []; }
                state.loading = false;
                state.totalResults = action.payload.totalResults;
                state.data = [...state.data, ...action.payload.data];
            })
            .addCase(fetchData.rejected, (state, action) => {
                state.loading = false;
                toast.error('some error occured while fetching fooditems\ntry again later');
                state.error = action.error.message;
            })
    }
})
export const { resetValues, incrementPage, changeCategory, setDetailing, setSubCategory, setFilter, setSellerId } = dataSlice.actions;
export default dataSlice.reducer;