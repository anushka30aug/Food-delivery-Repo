import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurantById, setId } from "../../Redux/restaurantDtataState";
import { setOrderDetailModal, setRestDetail } from "../../Redux/Detailing";
import { useNavigate } from "react-router";
import { addToCart } from "../../Redux/cartSlice";
import { Cross } from '../Icon';
import style from '../../Styling/OrderDetailModal.module.css'

export default function OrderDetailModal() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const orderDetail = useSelector(state => state.Detail.orderDetail);
    const visitRestaurant = (e) => {
        e.preventDefault();
        dispatch(setId(orderDetail.productDetail.seller_Id))
        dispatch(fetchRestaurantById()).then(restaurant => {
            dispatch(setRestDetail(restaurant.payload.data))
            navigate('/restaurantDetail')
        })
    }

    const addItemToCart = (e) => {
        e.preventDefault();
        dispatch(addToCart(orderDetail.productDetail))
    }

    return (
        <div className={style.modal}>
            <div className={style.orderDetail}>
                <div className={style.orderDetail_svg} onClick={() => { dispatch(setOrderDetailModal(false)) }}><Cross /></div>
                <div className={style.deliveryDetail}>
                    <h3>Delivery Address</h3>
                    <p>{orderDetail.deliver_to}<br />{orderDetail.delivery_address}</p>
                    <span>Contact: {orderDetail.contact_number}</span>
                    <h5>Payment Status: {orderDetail.payment_status}</h5>
                </div>
                <div className={style.orderedProductDetail}>
                    <h3>Product Detail</h3>
                    <div className={style.orderedProductHeader}>
                        <div className={style.orderedProductImage}><img src={orderDetail.productDetail.image} alt=""></img></div>
                        <span><b>{orderDetail.productDetail.name}</b></span>
                    </div>
                    <div>
                        <p>{orderDetail.productDetail.description}</p>
                        <h4>₹{orderDetail.productDetail.price} each</h4>
                        <h5>Quantity - {orderDetail.productDetail.productQuantity}</h5>
                        <button onClick={visitRestaurant}>Visit restaurant</button>
                        <button onClick={addItemToCart}>+ADD</button>
                    </div>
                </div>
            </div>
        </div>
    )
}