import {persistReducer,persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import localStorage from 'redux-persist/lib/storage';
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from "@reduxjs/toolkit";
import loginReducer from "./loginState";
import signupReducer from './signupState';
import userReducer from './userCityState';
import dataReducer from './dataState';
import cartReducer from './cartSlice';
import verificationReducer from './verificationState';
import restaurantDataState from './restaurantDtataState';
import Detailing from './Detailing';
// nested persist 
const userCityPersistConfig={
    key:'userCity',
    storage,
    whitelist:['city']
}

const detailingPersistConfig={
    key:'Detail',
    storage,
    whitelist:['restaurantDetail']
}

const dataPersistConfig={
    key:'data',
    storage,
    whitelist:['category']
}

const cartPersistConfig={
    key:'cart',
    storage:localStorage
}


const persistedUserCityReducer = persistReducer(userCityPersistConfig,userReducer);
const persistedDetailingReducer = persistReducer(detailingPersistConfig,Detailing);
const persistedDataReducer = persistReducer(dataPersistConfig,dataReducer);
const persistedCartReducer = persistReducer(cartPersistConfig,cartReducer)

const rootReducer = combineReducers({
    login: loginReducer,
    signup: signupReducer,
    userCity: persistedUserCityReducer,
    data: persistedDataReducer,
    verification:verificationReducer,
    Detail:persistedDetailingReducer,
    cart:persistedCartReducer,
    restaurantData:restaurantDataState
});


export const store = configureStore({
    reducer:rootReducer
})


export const persistor = persistStore(store)
