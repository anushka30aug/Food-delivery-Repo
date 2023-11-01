import { useEffect, useState } from "react"
import toast from "react-hot-toast";
import { resetPassword } from "../../Redux/verificationState";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import style from '../../Styling/ResetPassword.module.css';


export default function ResetPassword() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [reConfirm, setReConfirm] = useState('');

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/')
        }
        // eslint-disable-next-line
    }, [])


    const passwordChange = (e) => {
        setPassword(e.target.value)
    }
    const reConfirmChange = (e) => {
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
                    navigate('/')
                }
            })
        }
    }

    return (
        <form className={style.form}>
            <h3>Reset Password</h3>
            <p>To recover your account, please enter a new password below.</p>
            <input type='Password' placeholder="enter New Password" className={style.password} onChange={passwordChange} value={password} />
            <input type='Password' placeholder="Re-Enter new Password" className={style.password} onChange={reConfirmChange} value={reConfirm} />
            <button onClick={handleClick} className={style.form_button}>Reset password</button>

        </form>
    )
}