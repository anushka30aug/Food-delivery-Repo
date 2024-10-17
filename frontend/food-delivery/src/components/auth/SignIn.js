import '../../Styling/auth.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendOtp, setDetails } from '../../Redux/verificationState';

const SignIn=()=>{
        
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [credentials, setCredentials] = useState({ email: '', Name: '' });
    const [loading,setLoading]=useState(false);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        dispatch(setDetails({ email: credentials.email, name: credentials.Name }));
        dispatch(sendOtp(credentials.email)).then((response)=>{
            if(response.payload.otp)
            {   setLoading(false); 
                navigate('/otp');
            } 
            else{
                setLoading(false);
                navigate('/sign-in');
            }
        });
    }

    return (<>    
        <form className="auth-form" onSubmit={handleLogin} disabled={loading}>
            <h2 className="auth-heading" >Sign-in</h2>
            <input type="text" placeholder="Name" name="Name" id="Name" value={credentials.Name} onChange={handleChange} autocomplete="off" className="input" required/>
            <input type="email" placeholder="Email ID" name="email" id="email" value={credentials.email} onChange={handleChange} autocomplete="off" className="input" required/>
            <button type='submit' className='auth-button' disabled={loading}>{loading ? 'Loading...' : "Continue"}</button>
            <br/>
            <hr color="white" />
        </form>
        </>

    )

}
export default SignIn;