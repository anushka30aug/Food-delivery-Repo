import { useDispatch, useSelector } from "react-redux";
import {  Rating } from '../Icon';
import {fetchData } from "../../Redux/dataState";
import { resetValues,setSellerId } from "../../Redux/dataState";
import style from '../../Styling/RestaurantDetail.module.css'
import { useEffect, useState } from "react";
import ProductCart from '../product/productModal';
import ProductDetail from "../product/ProductDetail";
import { CircularProgress } from "@mui/material";


export default function RestaurantDetail() {
    const detail = useSelector(state => state.Detail.restaurantDetail)
    const data = useSelector(state=>state.data.data);
    const showdetail=useSelector(state=>state.Detail.showdetail)
    const[loading,setLoading]=useState(false);
    const dispatch = useDispatch();
    useEffect(
        ()=>{
           
            setLoading(true);
            window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
            dispatch(resetValues());
            dispatch(setSellerId(detail._id)); 
            dispatch(fetchData()).then(data=>setLoading(false));
            //eslint-disable-next-line
        },[])

    return (
        <div className={style.detail}>
            {showdetail&&<ProductDetail/>}
            <div className={style.detailImage}>
                <img src={detail.image} alt="" />
            </div>
            <div className={style.detailDesc}>
                <h3>{detail.name}</h3>
                <i>{detail.cuisine}</i>
                <p>{detail.description}</p>
                <div className={style.rating}><Rating />&nbsp;{detail.rating}</div>
                <address>{detail.address}</address>
            </div>
        
        <h3>Menu</h3>
        <div className={style.detailMenu}>
            {    
                data.map((item, index) => (
                    <ProductCart key={index} item={item} />
                ))
                
            }
                {loading ? <div className={style.Loader}><CircularProgress  style={{color:'green'}}/></div> : ''}
                </div> 
        </div>

    )
}