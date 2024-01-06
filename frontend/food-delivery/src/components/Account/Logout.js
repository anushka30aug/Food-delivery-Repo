import { useNavigate } from 'react-router';
import style from '../../Styling/Logout.module.css'
export default function Logout(){
    const navigate = useNavigate()
    const handleLogOutClick=(e)=>{
        e.preventDefault();
        localStorage.removeItem('token');
        sessionStorage.clear();
        navigate('/login')
        
    }

    const handleCancelClick=(e)=>{
        e.preventDefault();
        window.location.reload(false)
    }

    return(
        <div className={style.logout_module}>
            <h3>Are you sure want to logout ?</h3>
            <div>
            <button className={style.yesButton} onClick={handleLogOutClick}>Logout</button>
            <button className={style.noButton} onClick={handleCancelClick}>Cancel</button>
            </div>
        </div>
    )
}