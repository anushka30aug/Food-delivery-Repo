import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import style from '../../Styling/changeDeliveryAddress.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { changeAddress } from '../../Redux/UserProfile';
import { useNavigate } from 'react-router';

export default function ChangeDeliveryAddress() {
    const indianStates = [
        'Andhra Pradesh',
        'Arunachal Pradesh',
        'Assam',
        'Bihar',
        'Chhattisgarh',
        'Goa',
        'Gujarat',
        'Haryana',
        'Himachal Pradesh',
        'Jharkhand',
        'Karnataka',
        'Kerala',
        'Madhya Pradesh',
        'Maharashtra',
        'Manipur',
        'Meghalaya',
        'Mizoram',
        'Nagaland',
        'Odisha',
        'Punjab',
        'Rajasthan',
        'Sikkim',
        'Tamil Nadu',
        'Telangana',
        'Tripura',
        'Uttar Pradesh',
        'Uttarakhand',
        'West Bengal',
        'Andaman and Nicobar Islands',
        'Chandigarh',
        'Dadra and Nagar Haveli and Daman and Diu',
        'Lakshadweep',
        'Delhi',
        'Puducherry'
    ];
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deliveryInfo, setDeliveryInfo] = useState({ address: '', city: '', state: '', pincode: '', name: '', contact: '' });
    const info = useSelector(state => state.deliveryData)
    const userCity = useSelector(state => state.userCity.city)
    const userState = useSelector(state => state.userCity.state)
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            return navigate('/login')
        }
        //if user current location is same as the address entered by user at signup time then autofill address for user's convenience
        if (info.city.toUpperCase() === userCity.toUpperCase() && info.state.toUpperCase() === userState.toUpperCase()) {
            setDeliveryInfo(info)
        }
        else {
            //otherwise set all the address field empty and autofill only user's name and contact no.
            setDeliveryInfo({ ...deliveryInfo, name: info.name, contact: info.contact })
        }
    }, [info])

    const handleChange = (e) => {
        //limit pincode length to 6
        if (e.target.name === 'pincode') {
            e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6)
        }
        //limit contact number length to 10 
        else if (e.target.name === 'contact') {
            e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10)
        }
        setDeliveryInfo({ ...deliveryInfo, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        //if the delivery location entered by user is not same as the current location selected by user(or location detected by geolocation)
        if (userCity.toUpperCase() !== deliveryInfo.city.toUpperCase() || userState.toUpperCase() !== deliveryInfo.state.toUpperCase()) {
            toast('the delivery location is out of delivery range..please enter address of same city')
        }
        else {
            dispatch(changeAddress(deliveryInfo))
            navigate('/buy')
        }
    }

    return (
        <>
            <h2 className={style.heading}>Delivery Address</h2>
            <form className={style.changeAddress} >
                <input type="text" placeholder="enter house no., locality" name='address' className={style.inputFields} value={deliveryInfo.address} onChange={handleChange} required ></input>
                <input type="text" placeholder="enter city" name='city' className={style.inputFields} value={deliveryInfo.city} onChange={handleChange} required></input>
                <select id="state" name="state" className={style.inputFields} value={deliveryInfo.state} onChange={handleChange}>
                    {indianStates.map((state, index) => (
                        <option key={index} value={state}>
                            {state}
                        </option>
                    ))}
                </select>
                {/* <input type="text" placeholder="enter state" name='state' className={style.inputFields} value={deliveryInfo.state} onChange={handleChange} required></input> */}
                <input type="number" placeholder="enter pincode" name='pincode' className={style.inputFields} value={deliveryInfo.pincode} onChange={handleChange} required></input>
                <h4 className={style.contactInfoHeading}>contact Details</h4>
                <span className={style.contactInfo}>
                    <input type="text" placeholder="name" name='name' className={`${style.inputFields} ${style.contactDetail}`} onChange={handleChange} value={deliveryInfo.name} required></input>
                    <input type="number" placeholder="contact no." name='contact' className={`${style.inputFields} ${style.contactDetail}`} onChange={handleChange} value={deliveryInfo.contact} required></input>
                </span>
                <button className={style.submit} onClick={handleSubmit}>Continue</button>
            </form>
        </>
    )
}