import { useState } from "react";
import { sendOtp, setRecovering } from "../../Redux/verificationState";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import style from '../../Styling/OtpModal.module.css';
import toast from "react-hot-toast";

export default function RecoveryEmail() {
    const [emailId, setEmailId] = useState('');
    const [loading,setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setEmailId(e.target.value)
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        dispatch(sendOtp(emailId)).then(data =>{ 
            setLoading(false);
            if(data.payload.otp)
            { 
                navigate('/otpModal',{state:{recoveryMail:emailId}});
            }
            else{
                toast.error('Unexpected error occured');
            }
        });
        dispatch(setRecovering(true));  
    };

    return (
        <div className={style.form_page}>
            <form className={style.form} onSubmit={handleSubmit} disabled={loading}>
                <h3>Recover By Email Address</h3>
                <p>To recover your account, please provide email address of your TROFI Account We'll use it only for account recovery purposes.</p>
                <input type="email" placeholder='Email Id' className={style.form_input} value={emailId} onChange={handleChange} />
                <button className={style.form_button} type="submit" disabled={loading}>{loading?'Loading...':"OTP"}</button>
            </form>
        </div>
    )
}