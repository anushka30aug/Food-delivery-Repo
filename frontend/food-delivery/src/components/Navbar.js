import '../Styling/Navbar.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Location } from './Icon';
import { useState } from 'react';
import { changeCity } from '../Redux/userCityState';
const Navbar = () => {
    const [city, setCity] = useState('');
    const [search, setSearch] = useState(false);
    const dispatch = useDispatch();
    const location = useSelector(state => state.userCity.city)
    const navigate = useNavigate();
    const logOutClick = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }
    const signupClick = () => {
        navigate('/signup')
    }

    const searchState = () => {
        setSearch(!search);
    }

    const handleChange = (e) => {
        setCity(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setCity('');
        setSearch(!search)
        dispatch(changeCity(city));
    }

    return (
        <div>
            <nav className='navbar'>
                <h2>Trofi</h2>
                <div className='navbar-activities'>
                    {localStorage.getItem('token') ? (
                        <div>
                            <div className='nav-location' onClick={searchState}>
                                <Location />
                                <b>Other</b>
                            </div>
                            {location}
                        </div>

                    ) : (
                        // Token doesn't exist, render Sign Up and Login buttons
                        <>
                            <button onClick={signupClick}>Sign Up</button>
                            <button onClick={logOutClick}>Login</button>
                        </>
                    )}
                </div>
            </nav>
            <div className='search-location' style={{ display: search ? 'flex' : 'none' }}>
                <input type="search" placeholder="enter city e.g. Delhi" value={city} onInput={handleChange}/>
                <button onClick={handleSubmit}>Search</button>
            </div>
        </div>
    )
}

export default Navbar;