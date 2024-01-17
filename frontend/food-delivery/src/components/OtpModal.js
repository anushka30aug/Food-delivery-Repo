import { useEffect, useState } from "react";
import { verifyOtp, setRecovering } from "../Redux/verificationState";
import { signupUser } from "../Redux/signupState";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {useLocation} from 'react-router-dom';
import style from '../Styling/OtpModal.module.css';

export default function OtpModal() {
    const [otp, setOtp] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const recovering = useSelector(state => state.verification.isRecovering);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/')
        }
        // eslint-disable-next-line
    }, [])
    const handleChange = (e) => {
        setOtp(e.target.value)
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const otpResponse = await dispatch(verifyOtp(otp));
            if (otpResponse.payload.success) {   //if otp is verified
                if (recovering)       //check is user is recovering the account or signing in for first time
                {   
                    dispatch(setRecovering(false));
                    //pass the verified prop to resetPassword to show that the user has entered the correct OTP and is verified to ensure that user is following the application flow
                    navigate('/resetPassword',{ state: { verified: true,recoveryMail:location.state.recoveryMail } })
                }
                else {
                    const signupResponse = await dispatch(signupUser());
                    if (signupResponse.payload.token) {
                        navigate('/');
                    }
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <div className={style.form_page}>
            <form className={style.form}>
                <h3>Verify your Account</h3>
                <p>we have sent you six digit code at your Email Address
                    enter the code below to confirm your Email Address
                </p>
                <input type="text" inputMode="numeric" placeholder='enter OTP' className={style.form_input} value={otp} onChange={handleChange} />
                <button className={style.form_button} onClick={handleSubmit}>Verify</button>
                {/* <p>if you didn't receive code!! <button onClick={}> Resend</button></p> */}
            </form>
        </div>
    )
}