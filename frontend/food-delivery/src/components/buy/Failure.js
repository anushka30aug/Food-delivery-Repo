import { useNavigate } from 'react-router'
import img from '../Helper/error-icon.png'
import style from '../../Styling/Failure.module.css'

export default function Failure(){
    const navigate = useNavigate();
    return(
        <div className={style.failure}>
        <div className={style.image}>
            <img src={img} alt='error'/>
        </div>
        <div className={style.text}>
            <div>Something Wrong Happened !! </div>
            <p>please try again later</p>
            
            <button onClick={()=>{
               navigate('/')
            }}>Continue</button>
        </div>
    </div>
    )
}