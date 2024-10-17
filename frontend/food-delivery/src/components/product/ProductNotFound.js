import img from '../Helper/not_found.png'
import style from '../../Styling/ProductNotFound.module.css'
import { useNavigate } from 'react-router';
const ProductNotFound = () => {
    const navigate = useNavigate()
    const handleClick = () => {
        navigate('/');
    }

    return (
        <div className={style.not_found}>
            <div className={style.image}>
                <img src={img} alt='error' />
            </div>           
            <main className={style.main}>
                <p>OOPS!!No Such food Item Found Near You</p>
                <button onClick={handleClick}>Continue</button>
            </main>
        </div>
    )
}

export default ProductNotFound;