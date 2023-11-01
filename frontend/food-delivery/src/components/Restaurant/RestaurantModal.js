import style from '../../Styling/RestaurantModal.module.css';
import { useDispatch } from 'react-redux';
import { setRestDetail } from '../../Redux/Detailing';
import { Rating } from '../Icon';
import { useNavigate } from 'react-router';
export default function RestaurantModal(prop) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const showDetail=(e)=>{
        e.preventDefault();
        dispatch(setRestDetail(prop.item));
        navigate('/restaurantDetail')
    }
    return (
       <div className={style.restaurant} onClick={showDetail}>
        <div className={style.restaurantImage}>
            <img src={prop.item.image} alt=''></img>
            <div><Rating/>&nbsp;{prop.item.rating}</div>
        </div>
        <h3>{prop.item.name}</h3>
        <p>{prop.item.description.slice(0,150)}.....</p>
       </div>
    )
}