import Navbar from './components/Navbar';
import ProductDetail from './components/product/ProductDetail';
import Login from './components/auth/login';
import Signup from './components/auth/signup';
import Home from './components/Home';
import ProductList from './components/product/ProductList';
import OtpModal from './components/OtpModal';
import CartContainer from './components/cart/CartContainer';
import RecoveryEmail from './components/Recover/RecoveryEmail';
import ResetPassword from './components/Recover/ResetPassword';
import RestaurantDetail from './components/Restaurant/RestaurantDetail';
import Location from './components/Location';
import ChangeDeliveryAddress from './components/buy/changeDeliveryAddress';
import BuyProduct from './components/buy/BuyProduct';
import Success from './components/buy/Success';
import Failure from './components/buy/Failure';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/signup' element={<Signup />}></Route>
          <Route path='/location' element={<Location/>}></Route>
          <Route path='/productList' element={<ProductList />}></Route>
          <Route path='/productDetail' element={<ProductDetail/>}></Route>
          <Route path='/restaurantDetail' element={<RestaurantDetail/>}></Route>
          <Route path='/cart' element={<CartContainer/>}></Route>
          <Route path='/changeAddress' element={<ChangeDeliveryAddress/>}></Route>
          <Route path='/buy' element={<BuyProduct/>}></Route>
          <Route path='/success'element={<Success/>}></Route>
          <Route path='/failure'element={<Failure/>}></Route>
          <Route path='/otpModal' element={<OtpModal/>}></Route>
          <Route path='/recoveryEmail' element={<RecoveryEmail/>}></Route>
          <Route path='/resetPassword' element={<ResetPassword/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;



// $2b$10$iDWyS4Gi92lAPb74G51WAOW8fWnFihD6PD7VrRtyUenNI3EK.qPbG
// $2b$10$rNwmhZDMEbSzwRVNaOM2qeDsZIQzuH3SOW98woNgNQIFCCW459gwa