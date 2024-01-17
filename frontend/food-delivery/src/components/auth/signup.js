import '../../Styling/auth.css';
import { Link } from 'react-router-dom';
import { setUser } from '../../Redux/signupState';
import { sendOtp } from '../../Redux/verificationState';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux'

function Signup() {
    const indianStates = [
        'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
    ];

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({ name: '', email: '', password: '', address: '', city: '', state: '', country: 'India', pincode: '', contact: '' });

    const handleChange = (e) => {
        //limit pincode length to 6
        if (e.target.name === 'pincode') {
            e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6)
        }
        //limit contact number length to 10 
        else if (e.target.name === 'contact') {
            e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10)
        }
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
        <form className="auth-form" onSubmit={handleSignup}>

            <h2 className="auth-heading">Signup</h2>

            <input type="text" minLength={6} placeholder="Name" name="name" id="name" onChange={handleChange} className="input" required />

            <input type="email" placeholder="Email ID" name="email" id="email" onChange={handleChange} className="input" required/>

            <input type="password" minLength={6} placeholder="password" name="password" id="password" onChange={handleChange} className="input" required />

            <input type='text' placeholder='enter address' name='address' id='address' onChange={handleChange} className='input' required />
            <input type='text' placeholder='enter city' name='city' id='city' onChange={handleChange} className='input' required />
            <input type='number' placeholder='enter pincode' name='pincode' id='pincode' onChange={handleChange} className='input' required />
            <select id="state" name="state" onChange={handleChange} className='input' required>
                { indianStates.map((state, index) => (
                    <option key={index} value={state}>
                        {state}
                    </option>
                ))}
            </select>
           
            <input type='tel' pattern="[0-9]{10}" placeholder='enter 10 digit contact no.' name='contact' id='contact' onChange={handleChange} className='input' required
            />
            <input type='submit' className='auth-button' value="Signup"/>

            <hr color="white" />

            already have an Account? <Link to='/login' style={{ 'color': 'chocolate' }}>Login here...</Link>

        </form>
    )
}

export default Signup;