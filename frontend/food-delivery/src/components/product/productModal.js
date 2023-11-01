import style from '../../Styling/productModal.module.css';
import { setProductDetail } from '../../Redux/Detailing';
import { setModal } from '../../Redux/Detailing';
import { useDispatch } from 'react-redux';
import { addItem,calculateTotals } from '../../Redux/cartSlice';


export default function ProductCart(prop) {
  const dispatch = useDispatch();
  
  const showProduct = (e) => {
    e.preventDefault();
    dispatch(setProductDetail(prop.item));
     dispatch(setModal(true))
  }

  const addToCart=(e)=>{
  e.preventDefault();
  const cart = {...prop.item,amount:1};
  dispatch(addItem(cart));
  dispatch(calculateTotals());
  }

  return (
    <div className={style.product}>
      <div className={style.productImage}><img src={prop.item.image} alt="" /><button onClick={addToCart}>+ADD</button></div>
      <div className={style.productDetail}  onClick={showProduct}>
        <h3>{prop.item.name}</h3>
        <h5>₹{prop.item.price}</h5>  
      </div>
    </div>
  )
}
