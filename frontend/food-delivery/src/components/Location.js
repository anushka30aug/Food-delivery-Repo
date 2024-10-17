import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import {  useState } from "react";
import { changeCity, changeState, fetchCity } from "../Redux/userCityState";
import toast from "react-hot-toast";
import style from '../Styling/Location.module.css';
import { Location, Search } from "./Icon";

export default function LocationPage() {
    //eslint-disable-next-line
    const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
    const [location, setLocation] = useState('')
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const useGPS = () => {
        if (navigator.geolocation) {
            console.log('fetching city')
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('fetching geolocation');
                    const updatedCoordinates = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    setCoordinates(updatedCoordinates);
                    dispatch(fetchCity(updatedCoordinates)).then(city => { console.log(city); navigate('/')});
                },
                (error) => {
                    toast(`Geolocation is not available... please allow the site to access location for better experience in site's setting`);
                }
            );
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const string = location.split(',');
        dispatch(changeCity(string[0].trim()));
        dispatch(changeState(string[1].trim()));
        navigate('/')
    }

    const handleChange = (e) => {
        setLocation(e.target.value);
    }

    return (
        <div className={style.location} >
            
            {/* <img src="https://cliply.co/wp-content/uploads/2019/03/371903340_LOCATION_MARKER_400.gif" alt="location GIF"></img> */}
            <div className={style.location_icon}>
            <Location/>
            </div>
            <h4>Find restaurants near you!</h4>
            <p>
             Enter your city and state manually, or enable location services to find restaurants near you.
             If location access is blocked, please enable it in your browser settings
            </p>
            <form  onSubmit={handleSubmit}>
                <div className={style.form}>
                    <span>
                    <Search/>
                    </span>
                    <input type="search" placeholder="Enter City, State" onChange={handleChange}  required/>
                    <input type="submit" hidden/>
                </div>
            </form>
            <button onClick={useGPS} className={style.gps_button}>Use GPS location</button>
        </div>
    )
}