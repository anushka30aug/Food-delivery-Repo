import CartItem from './CartItem';
import { useSelector } from 'react-redux';
import '../../Styling/cartContainer.css';

const CartContainer = () => {
  const { cartItems, total, amount } = useSelector((store) => store.cart);

  if (amount < 1){
    return (
      <section className='cart'>
        <header>
          <h2>your Plate</h2>
          <h4 className='empty-cart'>Oops!! your plate is empty 😔</h4>
        </header>
      </section>
    );
  }

  return (
    <section className='cart'>
      <header>
        <h2>your Plate 😋</h2>
      </header>
      <div>
        {cartItems.map((item) => {
          return <CartItem key={item.id} {...item} />;
        })}
      </div>
      <footer>
        <hr />
        <div className='cart-total'>
          <h4>
            total <span>₹{total.toFixed(2)}</span>
          </h4>
        </div>
      </footer>
    </section>
  );
};
export default CartContainer;
