import '../../Styling/auth.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../Redux/loginState';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const Load=()=>{
    return(
            <span><i>Loading...</i></span> 
    )
}

const Login=()=>{
    
        useEffect(()=>{
            if(localStorage.getItem('token'))
            {
                navigate('/')
            }
           // eslint-disable-next-line 
        },[])
        
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading,setLoading]=useState(false);
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        dispatch(loginUser(credentials)).then((response)=>{
            if(response.payload.token)
            {   setLoading(false);
                navigate('/');
            }
            else{
                setLoading(false);
                navigate('/login');
            }
        });
    }

    return (

        <form className="auth-form">
            <h2 className="auth-heading">Login</h2>
            <input type="email" placeholder="Email ID" name="email" id="email" value={credentials.email} onChange={handleChange} className="input" />
            forgot pasword?<Link to='/recoveryEmail' style={{'color':'rgba(255, 68, 0)'}}> click here....</Link>
            <input type="password" minLength={6} placeholder="password" name="password" id="password" value={credentials.password} onChange={handleChange} className="input" />

            <button className="auth-button" onClick={handleLogin} disabled={loading}>{loading?<Load/>:"Login"}</button>
            <br/>
            <hr color="white" />
            Create new account? <Link to='/signup' style={{ 'color': 'rgba(255, 68, 0)' }}>signup here...</Link>
        </form>

    )

}
export default Login;