import { useDispatch, useSelector } from "react-redux";
import { Loading, Rating } from '../Icon';
import {fetchData } from "../../Redux/dataState";
import { resetValues,setSellerId } from "../../Redux/dataState";
import style from '../../Styling/RestaurantDetail.module.css'
import { useEffect, useState } from "react";
import ProductCart from '../product/productModal';
import ProductDetail from "../product/ProductDetail";
import { useNavigate } from 'react-router-dom';


export default function RestaurantDetail() {
    const navigate = useNavigate();
    const detail = useSelector(state => state.Detail.restaurantDetail)
    const data = useSelector(state=>state.data.data);
    const showdetail=useSelector(state=>state.Detail.showdetail)
    const[loading,setLoading]=useState(false);
    const dispatch = useDispatch();
    useEffect(
        ()=>{
            if (!localStorage.getItem('token') ) {
                return navigate('/login')
            }
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
            { loading?<div className={style.Loader}><b>Loading</b><Loading /></div>:'' }
        </div> 
        </div>

    )
}