import { useState } from "react";
import { sendOtp, setRecovering } from "../../Redux/verificationState";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import style from '../../Styling/OtpModal.module.css';

export default function RecoveryEmail() {
    const [emailId, setEmailId] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setEmailId(e.target.value)
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(sendOtp(emailId)); 
        dispatch(setRecovering(true));
        sessionStorage.setItem('recover', emailId);
        navigate('/otpModal');
    };

    return (
        <div className={style.form_page}>
            <form className={style.form}>
                <h3>Recover By Email Address</h3>
                <p>To recover your account, please provide email address of your TROFI Account We'll use it only for account recovery purposes.</p>
                <input type="email" placeholder='Email Id' className={style.form_input} value={emailId} onChange={handleChange} />
                <button className={style.form_button} onClick={handleSubmit}>Send Otp</button>
            </form>
        </div>
    )
}