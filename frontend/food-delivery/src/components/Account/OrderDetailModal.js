import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurantById, setId } from "../../Redux/restaurantDtataState";
import {  fetchSingleOrder, setRestDetail } from "../../Redux/Detailing";
import { useLocation, useNavigate } from "react-router";
import { addToCart } from "../../Redux/cartSlice";
import style from '../../Styling/OrderDetailModal.module.css'
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function OrderDetailModal() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {search} =useLocation();
    const orderDetail = useSelector(state => state.Detail.orderDetail);
    // console.log(orderDetail);
    
    const visitRestaurant = (e) => {
        e.preventDefault();
        dispatch(setId(orderDetail.productDetail.seller_Id));
        dispatch(fetchRestaurantById()).then(restaurant => {
            dispatch(setRestDetail(restaurant.payload.data))
            navigate('/restaurantDetail')
        })
    }


    const addItemToCart = (e) => {
        e.preventDefault();
        dispatch(addToCart(orderDetail.productDetail))
    }

    const getQueryParam = (param) => {
        return new URLSearchParams(search).get(param);
    };

    useEffect(()=>{
            if(Object.keys(orderDetail).length === 0 ){
                // TODO- fetchordered item with order Id
                // also persist state of orderedItems to persist accross page reloads
                const id = getQueryParam('id');
                if(id===null||id===undefined){
                    toast.error('orderId not found');
                    return;
                }
                dispatch(fetchSingleOrder(id));
            }
            //eslint-disable-next-line
        },[])

    return (
        <div className={style.modal}>
            {
                Object.keys(orderDetail).length> 0  && 
           
            <div className={style.order}>
                <div className={style.order_div}>
                <div className={style.orderDetail}>
                    <h3>Order Detail</h3>
                    <h5>Payment Status: {orderDetail.payment_status}</h5>
                    <div>Order Id: #{orderDetail._id}</div>
                    <br/>
                    <div>Ordered on: <span style={{color:'green'}}>{orderDetail.date.split('T')[0]}</span></div>
                </div>

                <div className={style.orderedProductDetail}>
                    <h3>Product Detail</h3>
                    <div className={style.orderedProductHeader}>
                        <div className={style.orderedProductImage}><img src={orderDetail.productDetail.image} alt=""></img></div>
                        <div>
                        <span><b>{orderDetail.productDetail.name}</b></span>
                        <div className={style.desc}>{orderDetail.productDetail.description}</div>
                        </div>
                    </div>
                    <div>
                        <h4>Price- ₹{orderDetail.productDetail.price}</h4>
                        
                        {/* <h5>Quantity - {orderDetail.productDetail.productQuantity}</h5> */}
                        <button onClick={visitRestaurant}>Visit restaurant</button>
                        <button onClick={addItemToCart}>+ADD</button>
                    </div>
                </div>
                </div>

                <div className={style.order_div}>
                <div className={style.deliveryDetail}>
                    <h3>Delivery Detail</h3>
                    <b><i>Delivery Address</i></b>
                    <p>{orderDetail.deliver_to}<br />{orderDetail.delivery_address}</p>
                    <span>Contact: {orderDetail.contact_number}</span>
                    <h5>Delivery Status: <span style={{color:"green"}}> {orderDetail.delivery_status}</span></h5>
                </div>

                <div className={style.orderSummary}>
                    <h3>Order Summary</h3>
                    <div className={style.orderSummary_bullets}><span>Price-</span><span>₹{orderDetail.productDetail.price}</span> </div>
                    <div className={style.orderSummary_bullets}><span> Quantity-</span> <span> {orderDetail.productDetail.productQuantity}</span> </div>
                    <div className={style.orderSummary_bullets}><span> Delivery Charge-</span> <span>₹00.00</span> </div>
                    <hr style={{color:'black'}}/>
                    <div className={style.orderSummary_bullets}><span><b>Total-</b></span> <span><b>₹{orderDetail.productDetail.productQuantity*orderDetail.productDetail.price }</b> </span> </div>
                </div>
                </div>
            </div>
             }
        </div>
    )
}