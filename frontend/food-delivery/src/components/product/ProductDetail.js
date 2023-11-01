import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { setModal,setProductDetail } from "../../Redux/Detailing";
import { addItem,calculateTotals } from "../../Redux/cartSlice";
import style from '../../Styling/ProductDetail.module.css'

export default function ProductDetail() {
    const navigate = useNavigate();
    const detail = useSelector(state => state.Detail.productDetail)
    const dispatch= useDispatch();
    useEffect(() => {
        if (localStorage.getItem('token') === null || undefined) {
            return navigate('/login')
        }
    });

    const handleExit=()=>{
      dispatch(setModal(false));
      dispatch(setProductDetail({}));
    }

    const addToCart=(e)=>{
        e.preventDefault();
        const item = {...detail,amount:1}
        dispatch(addItem(item))
        dispatch(calculateTotals());
    }

    return (
        <div className={style.productDetail} onClick={handleExit}>
            {console.log(detail)}
            <div className={style.detail}>
                <div className={style.detail_img}><img src={detail.image} alt=""></img></div>
                <div className={style.detail_desc}>
                    <h1>{detail.name}</h1>
                    <p>{detail.description}</p>
                    <h3>₹{detail.price}</h3>
                    <button onClick={addToCart}>+ ADD</button>
                </div>
            </div>
        </div>
    )
}