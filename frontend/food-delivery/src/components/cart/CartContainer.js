import CartItem from './CartItem';
import { useDispatch, useSelector } from 'react-redux';
import '../../Styling/cartContainer.css';
import { useEffect } from 'react';
import { calculateAmount, fetchCartItems, removeFromCart } from '../../Redux/cartSlice';
import ProductDetail from '../product/ProductDetail';
import Footer from '../Footer';


const CartContainer = () => {
  const { cartItems, totalQuantity, amount } = useSelector((store) => store.cart);
  const showdetail=useSelector(state=>state.Detail.showdetail) 
  const dispatch=useDispatch()
    useEffect(()=>{
       dispatch(fetchCartItems()).then(items=> dispatch(calculateAmount()));
    },[])

    const removeAll = (e)=>{
      e.preventDefault();
      dispatch(removeFromCart()).then(item=>dispatch(calculateAmount()))
    }

  if (totalQuantity < 1){
    return (
      <section className='cart'>
        <header>
          <h2>your Plate</h2>
          <h4 className='empty-cart'>Oops!! your plate is empty 😔</h4>
        </header>
        <Footer/>
      </section>
    );
  }

  return (
    <section className='cart'>
       {showdetail&&<ProductDetail/>}
      <header>
        <h2>your Plate 😋</h2>
      </header>
      <div>
        {cartItems.map((item) => {
          return <CartItem key={item.id} item={item} />;
        })}
      </div>
      <footer>
        <hr/>
        <div className='cart-total'>
          <h4>
            total <span>₹{amount.toFixed(2)}</span>
          </h4>
        </div>
        <div className='Cart-button'>
           <button className='clear'  onClick={removeAll}>Remove All</button>
           <button className='buy'>Buy Now</button>
        </div>
      </footer>
      <Footer/>
    </section>
  );
};
export default CartContainer;
