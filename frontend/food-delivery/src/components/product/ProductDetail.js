import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
import { useNavigate } from "react-router";
import { fetchData, setRestDetail } from "../../Redux/Detailing";
import { calculateAmount } from "../../Redux/cartSlice";
import style from '../../Styling/ProductDetail.module.css';
import { addToCart } from "../../Redux/cartSlice";
import { fetchRestaurantById, setId } from "../../Redux/restaurantDtataState";
import toast from "react-hot-toast";
import { useLocation } from 'react-router-dom';
import { useEffect } from "react";
import ShareProduct from "./ShareProduct";


export default function ProductDetail() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const detail = useSelector(state => state.Detail.productDetail)
    const dispatch = useDispatch();


    const getQueryParam = (param) => {
        return new URLSearchParams(search).get(param);
    };


    useEffect(() => {
        console.log(detail);
        if (Object.keys(detail).length === 0) {
            const id = getQueryParam('id');
            if (id === undefined || id === null) {
                toast.error("Product Id not found");
                return;
            }
            console.log("inside if", id)
            dispatch(fetchData(id));
        }
        //eslint-disable-next-line
    }, [])

    const add = (e) => {
        e.preventDefault();
        if (!localStorage.getItem('token')) {
           navigate('/sign-in');
        }
        else{
            dispatch(addToCart(detail))
            dispatch(calculateAmount());
        }
    }

    const visitRestaurant = (e) => {
        e.preventDefault();
        dispatch(setId(detail.seller_Id))
        dispatch(fetchRestaurantById()).then(restaurant => {
            dispatch(setRestDetail(restaurant.payload.data))
            navigate('/restaurantDetail')
        })
    }

    return (
        <div className={style.productDetail}>
            <div className={style.detail}>
                <div className={style.detail_img}><img src={detail.image} alt=""></img></div>
                <div className={style.detail_desc}>
                    <div className={style.header}>
                        <h1>{detail.name}</h1>
                        <ShareProduct />
                    </div>
                    <p>{detail.description}</p>
                    <h3>₹{detail.price}</h3>
                    <div className={style.btn}>
                        <button className={style.btn1} onClick={visitRestaurant}>Visit restaurant</button>
                        <button className={style.btn2} onClick={add}>+ ADD</button>
                    </div>
                </div>
            </div>
        </div>
    )
}