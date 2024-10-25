import CartItem from './CartItem';
import { useDispatch, useSelector } from 'react-redux';
import style from'../../Styling/cartContainer.module.css';
import { useEffect } from 'react';
import { calculateAmount, fetchCartItems, removeFromCart } from '../../Redux/cartSlice';
import ProductDetail from '../product/ProductDetail';
import Footer from '../Footer';
// import { fetchuser } from '../../Redux/UserProfile';
import { useNavigate } from 'react-router';

const CartContainer = () => {
  const navigate = useNavigate()
  const { cartItems, totalQuantity, amount } = useSelector((store) => store.cart);
  const showdetail = useSelector(state => state.Detail.showdetail)
  // const userCity = useSelector(state => state.userCity.city)
  // const userState = useSelector(state => state.userCity.state)
  const dispatch = useDispatch()
  useEffect(() => {
    if (!localStorage.getItem('token') ) {
      return navigate('/sign-in')
      // return navigate('/login')
  }
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
    dispatch(fetchCartItems()).then(items => dispatch(calculateAmount()));
    // eslint-disable-next-line
  }, [])

  const removeAll = (e) => {
    e.preventDefault();
    dispatch(removeFromCart()).then(item => dispatch(calculateAmount()))
  }

  const Buy = (e) => {
    e.preventDefault();
    // dispatch(fetchuser()).then(response => {
      // if ((response.payload.data.city.toUpperCase() === userCity.toUpperCase()) && (response.payload.data.state.toUpperCase() === userState.toUpperCase())) {
      //   navigate('/buy')
      // }
      // else {
        // console.log(response)
        navigate('/changeAddress');
      // }
    // })
  }

  if (totalQuantity < 1) {
    return (
      <section className={style.cart}>
        <header className={style.cart_empty}>
          <h2>your Plate</h2>
          <h4 className={style.empty_cart}>Oops!! your plate is empty </h4>
          <h5>
            Good food is always cooking! 
            Go ahead , order some yummy items from the menu
          </h5>
        </header>
        <Footer/>
      </section>
    );
  }

  return (
    <section className={style.cart}>
      {showdetail && <ProductDetail />}
      <header>
        <h2>your Plate 😋</h2>
      </header>
      <div>
        {cartItems.map((item,index) => {
          return <CartItem key={index} item={item} />;
        })
        }
      </div>
      <footer>
        <hr />
        <div className={style.cart_total}>
          <h4>
            total <span>₹{amount.toFixed(2)}</span>
          </h4>
        </div>
        <div className={style.cart_button}>
          <button className={style.clear} onClick={removeAll}>Remove All</button>
          <button className={style.buy} onClick={Buy}>Order Now</button>
        </div>
      </footer>
      <Footer />
    </section>
  );
};
export default CartContainer;
