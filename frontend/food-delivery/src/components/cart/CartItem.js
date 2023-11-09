import { ChevronDown, ChevronUp } from '../Icon';
import { removeFromCart, increase, decrease, calculateAmount, updateQuantity } from '../../Redux/cartSlice';
import { setModal, setProductDetail } from '../../Redux/Detailing';
import { useDispatch } from 'react-redux';
import '../../Styling/cartItem.css';

const CartItem = (prop) => {
  const { _id, image, name, price, productQuantity } = prop.item;
  const dispatch = useDispatch();
  const showItem = (e) => {
    e.preventDefault();
    dispatch(setProductDetail(prop.item))
    dispatch(setModal(true));
  }

  return (
    <article className='cart-item'>
      <img src={image} alt={name} onClick={showItem} />
      <div>
        <h4>{name}</h4>
        <h4 className='item-price'>₹{price}</h4>
        <button
          className='remove-btn'
          onClick={() => {
            dispatch(removeFromCart(_id)).then(item => dispatch(calculateAmount()));
          }}
        >
          remove
        </button>
      </div>
      <div>
        <button
          className='amount-btn'
          onClick={() => {
            dispatch(increase());
            dispatch(updateQuantity(_id)).then(item => dispatch(calculateAmount()))

          }}
        >
          <ChevronUp />
        </button>
        <p className='amount'>{productQuantity}</p>
        <button
          className='amount-btn'
          onClick={() => {
            if (productQuantity === 1) {
              dispatch(removeFromCart(_id));
              dispatch(calculateAmount());
              return;
            }
            dispatch(decrease());
            dispatch(updateQuantity(_id)).then(item => dispatch(calculateAmount())
            )
          }}
        >
          <ChevronDown />
        </button>
      </div>
    </article>
  );
};
export default CartItem;
