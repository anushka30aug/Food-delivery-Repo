import Navbar from './components/Navbar';
import ProductDetail from './components/product/ProductDetail';
import Home from './components/Home';
import ProductList from './components/product/ProductList';
import CartContainer from './components/cart/CartContainer';
import UserAccount from './components/Account/UserAccount';
import RestaurantDetail from './components/Restaurant/RestaurantDetail';
import Location from './components/Location';
import ProductNotFound from './components/product/ProductNotFound';
import ChangeDeliveryAddress from './components/buy/changeDeliveryAddress';
import BuyProduct from './components/buy/BuyProduct';
import Success from './components/buy/Success';
import Failure from './components/buy/Failure';
import ContactPanel from './components/ContactPanel';
import Footer from './components/Footer';
import { Routes, Route, useNavigate } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import Otp from './components/auth/Otp';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import OrderDetailModal from './components/Account/OrderDetailModal';
import PageNotFound from './components/PageNotFound';

export default function Entry() {
    const city = useSelector(state => state.userCity.city);
    const state = useSelector(state => state.userCity.state);
    // console.log("entry", city, state);
    const navigate = useNavigate();
    useEffect(() => {
        if (city == null || state == null) {
            navigate('/location');
        }
        //eslint-disable-next-line
    }, [])
    return (
        <div>
            <Navbar />
            <Routes>
                <Route path='/' element={<Home />}></Route>
                <Route path='/sign-in' element={<SignIn />}></Route>
                <Route path='/otp' element={<Otp />}></Route>
                <Route path='/location' element={<Location />}></Route>
                <Route path='/productList' element={<ProductList />}></Route>
                <Route path='/productDetail' element={<ProductDetail />}></Route>
                <Route path='/restaurantDetail' element={<RestaurantDetail />}></Route>
                <Route path='/productNotFound' element={<ProductNotFound />}></Route>
                <Route path='/cart' element={<CartContainer />}></Route>
                <Route path='/Account' element={<UserAccount />}></Route>
                <Route path='/changeAddress' element={<ChangeDeliveryAddress />}></Route>
                <Route path='/buy' element={<BuyProduct />}></Route>
                <Route path='/success' element={<Success />}></Route>
                <Route path='/failure' element={<Failure />}></Route>
                <Route path='/userOrder' element={<OrderDetailModal/>}></Route>
                <Route path='*' element={<PageNotFound/>}></Route>
            </Routes>
            <ContactPanel />
            <Footer />
        </div>
    )
}