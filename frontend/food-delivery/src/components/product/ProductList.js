import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchData, setSubCategory,resetValues } from "../../Redux/dataState";
import { incrementPage } from "../../Redux/dataState";
import { useDispatch, useSelector } from "react-redux";
import ProductCart from './productModal';
import { Food } from "../Icon";
import ProductDetail from "./ProductDetail";
import style from '../../Styling/ProductList.module.css';


export default function ProductList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const dataValue = useSelector((state) => state.data.data || []);
    const totalLength = useSelector((state) => state.data.totalResults);
    const dataLength = useSelector((state) => dataValue.length);
    const city = useSelector(state => state.userCity.city);
    const showdetail=useSelector(state=>state.Detail.showdetail)
    
    useEffect(() => {
        if (localStorage.getItem('token') === null || undefined) {
            return navigate('/login')
        }
        dispatch(resetValues());
        dispatch(fetchData());
        // eslint-disable-next-line
    }, [city]);

    const [searchState, setSearchState] = useState(false);
    const [searchItem, setSearchItem] = useState('')
    const handleClick = () => {
        setSearchState(true)
    }

    const handleChange = (e) => {
        setSearchItem(e.target.value)
    }

    const handleSearch = (e) => {
        dispatch(setSubCategory(searchItem));
        dispatch(fetchData());
        setSearchState(false);

    }

    const fetchMore = () => {
        dispatch(incrementPage());
        dispatch(fetchData());
    }

    return (
        <div>
            {showdetail&&<ProductDetail/>}
            <InfiniteScroll
                dataLength={dataLength}
                hasMore={dataLength < totalLength}
                next={fetchMore}
                inverse={false}>
                <div className={style.products}>
                    {dataValue === null ? (
                        <h3>No Food Item Found</h3>
                    ) : (
                        dataValue.map((item, index) => (
                            <ProductCart key={index} item={item} />
                        )
                        )
                    )}
                </div>

            </InfiniteScroll>

            <div className={style.searchOption} style={{ display: searchState ? 'none' : 'block' }} onClick={handleClick}>
                <Food />
                Browse Menu
            </div>

            <div className={style.searchBar} style={{ display: searchState ? 'block' : 'none' }}>
                <input type="search" value={searchItem} onChange={handleChange} placeholder="Pizza" />
                <button onClick={handleSearch}>Search</button>
            </div>
        </div>
    );
}
