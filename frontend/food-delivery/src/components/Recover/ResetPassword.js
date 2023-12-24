import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPassword } from "../../Redux/verificationState";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import style from '../../Styling/ResetPassword.module.css';


export default function ResetPassword() {
    const location = useLocation();
    const { verified = false } = location.state || {};  
    //this is to check if user has reached to this page by properly following the application flow and by entering the correct OTP  or they have reached by changing the URL
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [reConfirm, setReConfirm] = useState('');

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/')
        }

        if(!verified)
        {   
            navigate('/otpModal')
        }
        // eslint-disable-next-line
    }, [])


    const handleChange = (e) => {
        setPassword(e.target.value)
    }
    const handleConfirmation = (e) => {
        setReConfirm(e.target.value)
    }

    const handleClick = (e) => {
        e.preventDefault();
        if (password !== reConfirm) {
            toast.error('you entered two different passwords');
        }
        else {
            dispatch(resetPassword(password)).then(response => {
                if (response.payload.token) {
                    sessionStorage.removeItem('recover')
                    navigate('/')
                }
            })
        }
    }

    return (
        <form className={style.form}>
            <h3>Reset Password</h3>
            <p>To recover your account, please enter a new password below.</p>
            <input type='Password' placeholder="enter New Password" className={style.password} onChange={handleChange} value={password} />
            <input type='Password' placeholder="Re-Enter new Password" className={style.password} onChange={handleConfirmation} value={reConfirm} />
            <button onClick={handleClick} className={style.form_button}>Reset password</button>

        </form>
    )
}