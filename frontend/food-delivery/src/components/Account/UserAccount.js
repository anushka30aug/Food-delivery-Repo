import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { fetchuser, setProfile } from "../../Redux/UserProfile";
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from "../../Redux/OrdersState";
import UserOrders from "./UserOrders";
import Style from '../../Styling/UserAccount.module.css'
import EditProfile from "./EditProfile";
import img from '../Helper/profile-pic.jpg'
import Logout from "./Logout";


export default function UserAccount() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const name = useSelector(state => state.deliveryData.name);
    const contact = useSelector(state => state.deliveryData.contact);
    const email = useSelector(state => state.deliveryData.email);
    const editProfile = useSelector(state => state.deliveryData.editProfile);
    const image = useSelector(state => state.deliveryData.profilePicture);
    const [selectedButton, setSelectedButton] = useState('orders')
    useEffect(
        () => {
            if(!localStorage.getItem('token'))
            {
                return navigate('/login')
            }
            
            dispatch(fetchuser());
            dispatch(fetchOrders());
        }, []
    )

    const handleButtonClick = (e) => {
        // e.target.
        setSelectedButton(e.target.value)
    }

    const handleEditProfileClick = (e) => {
        e.preventDefault();
        dispatch(setProfile(true));
    }
    return (
        <div className={Style.userAccount}>
            {editProfile && <EditProfile />}
            <div className={Style.Account}>
                <header className={Style.header}>
                    <div className={Style.profileSection}>
                        <div className={Style.profilePicture}>
                            <img src={image === '' || image === null ? img : image} alt='' />
                        </div>
                        <div className={Style.UserDetail}>
                            <h3>{name}</h3>
                            <span>{contact} • {email}</span>
                        </div>
                    </div>
                    <button onClick={handleEditProfileClick}>Edit</button>
                </header>

                <main className={Style.main}>
                    <div className={Style.mainMenu}>
                        <button value='orders' onClick={handleButtonClick} style={{
                            backgroundColor: selectedButton === 'orders' ? 'white' : 'initial',
                            color: selectedButton === 'orders' ? 'black' : 'initial',
                        }}>
                            Orders
                        </button>
                        <button value='logout' onClick={handleButtonClick} style={{
                            backgroundColor: selectedButton === 'logout' ? 'white' : 'initial',
                            color: selectedButton === 'logout' ? 'black' : 'initial',
                        }}>
                            Logout
                        </button>
                    </div>
                    <div className={Style.mainContent}>
                        {selectedButton === 'orders' ? (
                            <UserOrders />
                        ) : (
                            <Logout/>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}