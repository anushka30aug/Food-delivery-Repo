import style from '../../Styling/productModal.module.css';
import { setProductDetail } from '../../Redux/Detailing';
import { setModal } from '../../Redux/Detailing';
import { useDispatch } from 'react-redux';
import { calculateAmount, addToCart } from '../../Redux/cartSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

export default function ProductCart(prop) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showProduct = (e) => {
    e.preventDefault();
    dispatch(setProductDetail(prop.item));
    // console.log(prop.item);
    navigate(`/productDetail?id=${prop.item._id}`);
    // dispatch(setModal(true));
  }

  const add = (e) => {
    e.preventDefault();
    if(!localStorage.getItem('token')){
      toast("Please sign in to add items to your cart.");
      return;
  }
    dispatch(addToCart(prop.item));
    dispatch(calculateAmount());  
  }

  return (
    <div className={style.product}>
      <div className={style.productImage}><img src={prop.item.image } alt="" /><button onClick={add}>+ADD</button></div>
      <div className={style.productDetail } onClick={showProduct}>
        <h3>{prop.item.name}</h3>
        <h5>₹{prop.item.price}</h5>
      </div> 
    </div>
  )
}
