import { useNavigate } from 'react-router';
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData, setSubCategory } from "../Redux/dataState";
import style from '../Styling/Footer.module.css';
import { ProfileIcon, Home, Search, Cart } from './Icon';

export default function Footer() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchState, setSearchState] = useState(false);
    const [searchItem, setSearchItem] = useState('');
    const Quantity = useSelector(state => state.cart.totalQuantity);

    const handleClick = () => {
        setSearchState(searchState => !searchState)
    }

    const handleChange = (e) => {
        setSearchItem(e.target.value)
    }

    const handleSearch = (e) => {
        dispatch(setSubCategory(searchItem.trim()));
        setSearchState(false);
        dispatch(fetchData()).then(data=>{
            if(data.payload.err)
            {
                navigate('/productNotFound')
            }
            else{
                navigate('/productList')
            }
        });
       
       
    }

    const goTo = () => {
        
    }

    const goToAccount = () => {
        navigate('/Account')
    }

    const goToCart = () => {
        navigate('/cart')
    }
    return (
        <div style={{ display: localStorage.getItem('token') ? 'block' : 'none' }}>

            <div className={style.searchBar} style={{ display: searchState ? 'block' : 'none' }}>
                <input type="search" value={searchItem} onChange={handleChange} placeholder="Pizza" />
                <button onClick={handleSearch}>Search</button>
            </div>

            <div className={style.footer}>
                <div value='home' onClick={() => { navigate('/') }} > <Home /> </div>
                <div value='search' onClick={handleClick}> <Search /> </div>
                <div value='orders' onClick={goTo}> Trofi </div>
                <div value='cart' onClick={goToCart} className={style.cart_container}> <Cart />  <span className={style.amount_container} 
                style={{display:Quantity===0?"none":"inline-block"}}>
                    {Quantity === 0 ? '' : Quantity}
                </span> </div>
                <div value='account' onClick={goToAccount}> <ProfileIcon /> </div>
            </div>

        </div>
    )
}