import { useEffect, useState } from "react";
import { verifyOtp } from "../../Redux/verificationState";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { MuiOtpInput } from 'mui-one-time-password-input';
import style from '../../Styling/Otp.module.css';
import toast from "react-hot-toast";
import { fetchuser } from "../../Redux/UserProfile";

export default function Otp() {
    const [otp, setOtp] = useState();
    const [loading,setLoading]=useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
   

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/')
        }
        // eslint-disable-next-line
    }, [])
    const handleChange = (value) => {
        //mui direct passes value to change function assigned to handleChange event listener
        // so we dont need to write event.target
        setOtp(value);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(otp===null||otp===undefined){
            toast('please enter OTP');
            return;
        }
        setLoading(true);
        try {
            const otpResponse = await dispatch(verifyOtp(otp));
            setLoading(false);
            if (otpResponse.payload.success) { //if otp is verified
                localStorage.setItem('token',otpResponse.payload.data);
                dispatch(fetchuser());
                navigate('/');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <div className={style.form_page}>
            <form className={style.form} onSubmit={handleSubmit} disabled={loading}>
                <h3>Verify your Account</h3>
                <p> we have sent you six digit code at your Email Address
                    enter the code below to confirm your Email Address
                </p>
                <div className={style.form_input}>
                <MuiOtpInput value={otp} length={4} onChange={handleChange}/>
                </div>
                <button className={style.form_button} type="submit" disabled={loading} >{loading?'Loading...':'Verify'}</button>
            </form>
        </div>
    )
}