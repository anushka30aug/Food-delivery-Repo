import { digitalPayment, offlinePayment } from '../../Redux/paymentState';
import { loadStripe } from '@stripe/stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartItems, calculateAmount, nonDeliverableAmount } from '../../Redux/cartSlice';
import { useEffect, useState ,useRef} from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import PurchaseItemDesc from './purchaseItemDesc';
import style from '../../Styling/BuyProduct.module.css';
import LoadingBar from 'react-top-loading-bar'

export default function BuyProduct() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const ref = useRef(null)
    const [paymentMode, setPaymentMode] = useState('')
    const [itemsWithDifferentCity, setItemsWithDifferentCity] = useState([]);
    const name = useSelector(state => state.deliveryData.name)
    const address = useSelector(state => state.deliveryData.address)
    const city = useSelector(state => state.deliveryData.city)
    const state = useSelector(state => state.deliveryData.state)
    const contact = useSelector(state => state.deliveryData.contact)
    const cartItems = useSelector(state => state.cart.cartItems)
    const amount = useSelector(state => state.cart.amount)
    useEffect(
        () => {
            if (!localStorage.getItem('token') ) {
                return navigate('/login')
            }
            dispatch(fetchCartItems()).then(items => dispatch(calculateAmount()));
            window.scrollTo(0, 0)
            // eslint-disable-next-line
        }, []
    )
    // different useEffect because window will be scrolled to top each time if we put it in same useEffect
    useEffect(
        () => {
            // find the items which belong to different city and state to style them differently
            const itemsWithDifferentCity = cartItems.filter(item => item.seller_City.toUpperCase() !== city.toUpperCase() || item.seller_State.toUpperCase() !== state.toUpperCase());
            setItemsWithDifferentCity(itemsWithDifferentCity);
            dispatch(calculateAmount());
            // issue : subtracting the nondeliverable product amount from total amount , it is updating the value of amount correctly
            //         but is not reflected to the product overview  section
             dispatch(nonDeliverableAmount(itemsWithDifferentCity));
             // eslint-disable-next-line
        }, [cartItems, city, state]
    )

    const handleClick = async (e) => {
        e.preventDefault();
        e.target.disabled = true;
        ref.current.continuousStart()
        // if the payment mode is online or no payment mode (by maliciously doing change in the code) is selected
        if (paymentMode === 'online' || paymentMode === '') {
            dispatch(fetchCartItems()).then(async () => {
                const stripe = await loadStripe('pk_test_51OBIL6SIRBsKhKupShJnlhsQCHB7chEZorOKOJSy6sxAJghXwKMlxoBvoU3SYPJf8M161LWOtKfZbrXEAwkuNnd100d7N1ln6k');
                const session = await dispatch(digitalPayment())
                const result = stripe.redirectToCheckout(
                    {
                        sessionId: session.payload.id
                    }
                );

                if (result.error) {
                    toast.error('error occured')
                    e.target.disabled = false;
                    console.error(result.error.message);
                }
                else if (result.success) {
                    console.log("success")
                }
            })
        }
        else {
            dispatch(fetchCartItems()).then(() => {
                dispatch(calculateAmount())
                dispatch(offlinePayment()).then(resp => {
                    if (resp.payload.success) {
                        toast.success('congratulations!!Order placed')
                        navigate('/success')
                    }
                    else {
                        toast.error('error occured!!')
                        navigate('/failure')
                    }
                })
            })
        }

    }

    const changeAddress = (e) => {
        e.preventDefault();
        navigate('/changeAddress')
    }


    const handlePaymentModeChange = (e) => {
        setPaymentMode(e.target.value)
    }

    return (
        <div className={style.buyproduct}>
            <LoadingBar color='#ff4400d3' height='5px'  ref={ref} />
            <div className={style.products}>
                <h2>product overview</h2>
                {cartItems.map((item) => {
                    const isDifferentCity = itemsWithDifferentCity.includes(item);
                    return <PurchaseItemDesc key={item.id} item={item} isDifferentCity={isDifferentCity} />;
                })
                }
                <div className={style.productsAmount}> Amount - ₹{amount}.00</div>
            </div>
            <div className={style.address}>
                <h3>Delivery to-</h3>
                {` ${name} at ${address} , ${city} ,${state} \n contact:${contact}`}
                <br />
                <button onClick={changeAddress}>change address</button>
            </div>

            <div className={style.payment}>
                <h3>Select Payment Method</h3>
                <label className={style.paymentOption}>
                    <input type='radio' name='paymentMode' value='online' className={style.paymentInput} onClick={handlePaymentModeChange} /> Pay Online
                </label>

                <label className={style.paymentOption}>
                    <input type='radio' name='paymentMode' value='offline' className={style.paymentInput} onClick={handlePaymentModeChange} /> Cash On Delivery
                </label>
                <button onClick={handleClick} disabled={cartItems.length === itemsWithDifferentCity.length || paymentMode === '' ? true : false}>{paymentMode === 'offline' || paymentMode === '' ? 'place Order' : 'continue'}</button>
            </div>

        </div>
    )
}