import style from '../../Styling/Success.module.css'
import img from '../Helper/delivery_van.png'
import { useNavigate } from 'react-router';

export default function Success(){
    const navigate = useNavigate();
    return(
        <div className={style.success}>
            <div className={style.image}>
                <img src={img} alt='delivery boy'/>
            </div>
            <div className={style.text}>
                <div>🎉your order placed successfully🎉</div>
                
                <button onClick={()=>{
                   navigate('/')
                }}>Continue</button>
            </div>
        </div>
    )
}