import style from '../Styling/Navbar.module.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Position } from './Icon';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { resetTotal } from '../Redux/cartSlice';
import { resetOrders } from '../Redux/OrdersState';

const Navbar = () => {
    const location = useSelector(state => state.userCity.city)
    const state = useSelector(state => state.userCity.state)
    const Quantity = useSelector(state => state.cart.totalQuantity)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            //   right: -3,
            //   top: 13,
            border: `2px solid ${theme.palette.background.paper}`,
            //   padding: '0 4px',
        },
    }));

    const logOutClick = () => {
        localStorage.removeItem('token');
        sessionStorage.clear();
        dispatch(resetTotal());
        dispatch(resetOrders());
        navigate('/sign-in');
    }
    const signInClick = () => {
        navigate('/sign-in');
    }

    const goToAccount = () => {
        if(!localStorage.getItem('token')){
            navigate('/sign-in');
        }
        else
        navigate('/Account')
    }

    const goToCart = () => {
        if(!localStorage.getItem('token')){
            navigate('/sign-in');
        }
        else
        navigate('/cart')
    }

    return (
        <div className={style.navigation_menu}>
            <nav className={style.navbar}>
                <h2>Trofi</h2>
                <div className={style.navbar_activities}>
                    <div className={style.icons}>

                        <IconButton aria-label="cart" onClick={goToCart}>
                            <StyledBadge badgeContent={Quantity === 0 ? 0 : Quantity} color="success">
                                <ShoppingCartIcon fontSize='large' sx={{ color: 'black' }} />
                            </StyledBadge>
                        </IconButton>
                        <button onClick={goToAccount} className={style.profile}><AccountCircleIcon fontSize='large' /></button>

                    </div>
                        {
                            localStorage.getItem('token') ?
                                <button onClick={logOutClick} className={style.login}>Sign-out</button>
                                : <button onClick={signInClick} className={style.signup}>Sign-in</button>
                        }
                </div>
            </nav>
            {
                <div className={style.location} onClick={() => { navigate('/location') }}>
                    <Position /> Delivery in {location}, {state}
                </div>
            }

        </div>
    )
}

export default Navbar;