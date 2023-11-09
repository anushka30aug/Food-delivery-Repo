import { useNavigate } from 'react-router';
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchData, setSubCategory } from "../Redux/dataState";

import style from '../Styling/Footer.module.css';
import { ProfileIcon, Home, Search, Cart } from './Icon';
export default function Footer() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchState, setSearchState] = useState(false);
    const [searchItem, setSearchItem] = useState('')
    const handleClick = () => {
        setSearchState(searchState => !searchState)
    }

    const handleChange = (e) => {
        setSearchItem(e.target.value)
    }

    const handleSearch = (e) => {
        dispatch(setSubCategory(searchItem.trim()));
        dispatch(fetchData());
        setSearchState(false);
        navigate('/productList');
    }

    const goTo=()=>{

    }

    const goToCart = () => {
      navigate('/cart')
    }
    return (
        <div>

            <div className={style.searchBar} style={{ display: searchState ? 'block' : 'none' }}>
                <input type="search" value={searchItem} onChange={handleChange} placeholder="Pizza" />
                <button onClick={handleSearch}>Search</button>
            </div>

            <div className={style.footer}>
                <div value='home' onClick={() => { navigate('/') }} > <Home /> </div>
                <div value='search' onClick={handleClick}> <Search /> </div>
                <div value='orders' onClick={goTo}> Trofi </div>
                <div value='cart' onClick={goToCart}> <Cart /> </div>
                <div value='account' onClick={goTo}> <ProfileIcon /> </div>
            </div>

        </div>
    )
}