import { ChevronDown, ChevronUp } from '../Icon';
import { removeItem, increase, decrease,calculateTotals } from '../../Redux/cartSlice';
import { useDispatch } from 'react-redux';
import '../../Styling/cartItem.css';

const CartItem = ({ _id, image, name, price, amount }) => {
  const dispatch = useDispatch();
  return (
    <article className='cart-item'>
      <img src={image} alt={name} />
      <div>
        <h4>{name}</h4>
        <h4 className='item-price'>₹{price}</h4>
        <button
          className='remove-btn'
          onClick={() => {
            dispatch(removeItem(_id));
            dispatch(calculateTotals());
          }}
        >
          remove
        </button>
      </div>
      <div>
        <button
          className='amount-btn'
          onClick={() => {
            dispatch(increase({ _id }));
            dispatch(calculateTotals());
          }}
        >
          <ChevronUp />
        </button>
        <p className='amount'>{amount}</p>
        <button
          className='amount-btn'
          onClick={() => {
            if (amount === 1) {
              dispatch(removeItem(_id));
              dispatch(calculateTotals());
              return;
            }
            dispatch(decrease({ _id }));
            dispatch(calculateTotals());
          }}
        >
          <ChevronDown />
        </button>
      </div>
    </article>
  );
};
export default CartItem;
