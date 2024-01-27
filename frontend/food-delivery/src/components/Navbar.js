import '../Styling/Navbar.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Position, ProfileIcon, Cart } from './Icon';

const Navbar = () => {
    const location = useSelector(state => state.userCity.city)
    const state = useSelector(state => state.userCity.state)
    const Quantity = useSelector(state=>state.cart.totalQuantity)
    const navigate = useNavigate();
    const logOutClick = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }
    const signupClick = () => {
        navigate('/signup');
    }

    const goToAccount = () => {
        navigate('/Account')
    }

    const goToCart = () => {
        navigate('/cart')
    }

    return (
        <div className='navigation-menu'>
            <nav className='navbar'>
                <h2>Trofi</h2>
                <div className='navbar-activities'>
                    {localStorage.getItem('token') ? (
                        <div className='icons'>
                            
                            <button onClick={goToCart} className='cart-container'>
                            <Cart />
                            <div className='amount-container'>
                                {Quantity===0?'':Quantity}
                            </div>
                            
                            </button>
                           
                            
                            <button onClick={goToAccount}><ProfileIcon /></button>
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
            {localStorage.getItem('token') ? (
                <div className='location' onClick={() => { console.log('navigating'); navigate('/location') }}>
                    <Position /> Delivery in {location},{state}
                </div>) : (<></>)
            }

        </div>
    )
}

export default Navbar;