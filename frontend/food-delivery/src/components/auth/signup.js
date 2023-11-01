import '../../Styling/auth.css';
import { Link } from 'react-router-dom';
import { setUser } from '../../Redux/signupState';
import { sendOtp } from '../../Redux/verificationState';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux'

function Signup() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({ name: '', email: '', password: '', address: '', city: '', state: '', country: '', pincode: '', contact: '' });

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const handleSignup = (e) => {
        e.preventDefault();
        const str = credentials.city.charAt(0).toUpperCase() + credentials.city.slice(1).toLowerCase();
        const updatedCredentials = { ...credentials, city: str };
        dispatch(setUser(updatedCredentials));
        dispatch(sendOtp(credentials.email));
        navigate('/otpModal');
    }

    return (
        <form className="auth-form">

            <h2 className="auth-heading">Signup</h2>

            <input type="text" minLength={6} placeholder="Name" name="name" id="name" onChange={handleChange} className="input" />

            <input type="email" placeholder="Email ID" name="email" id="email" onChange={handleChange} className="input" />

            <input type="password" minLength={6} placeholder="password" name="password" id="password" onChange={handleChange} className="input" />

            <input type='text' placeholder='enter address' name='address' id='address' onChange={handleChange} className='input' />
            <input type='text' placeholder='enter city' name='city' id='city' onChange={handleChange} className='input' />
            <input type='number' placeholder='enter pincode' name='pincode' id='pincode' onChange={handleChange} className='input' />
            <input type='text' placeholder='enter state' name='state' id='state' onChange={handleChange} className='input' />
            <input type='text' placeholder='enter country' name='country' id='country' onChange={handleChange} className='input' />


            <input type='number' minLength={10} maxLength={10} placeholder='enter contact no.' name='contact' id='contact' onChange={handleChange} className='input' />

            <button className="auth-button" onClick={handleSignup}>Signup</button>

            <hr color="white" />

            already have an Account? <Link to='/login' style={{ 'color': 'chocolate' }}>Login here...</Link>

        </form>
    )
}

export default Signup;