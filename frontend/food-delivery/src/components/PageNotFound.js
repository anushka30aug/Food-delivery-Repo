import { useNavigate } from 'react-router'
import img from './Helper/error-icon.png'
import style from '../Styling/Failure.module.css'

export default function PageNotFound(){
    const navigate = useNavigate();
    return(
        <div className={style.failure}>
        <div className={style.image}>
            <img src={img} alt='error'/>
        </div>
        <div className={style.text}>
           <div> <b>OOPS!! The page you are looking for doesn't exist</b></div>
            
            <button onClick={()=>{
               navigate('/')
            }}>Continue</button>
        </div>
    </div>
    )
}