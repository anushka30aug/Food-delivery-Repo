import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { changeCity, changeState, fetchCity } from "../Redux/userCityState";
import toast from "react-hot-toast";
import style from '../Styling/Location.module.css';
import { Position } from "./Icon";

export default function Location() {
    const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
    const [location, setLocation] = useState('')
    const dispatch = useDispatch();
    const navigate = useNavigate()

    useEffect(()=>{
        if (!localStorage.getItem('token') ) {
            return navigate('/login')
        }
    },[])

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

    const handleClick = (e) => {
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
        <div className={style.location} onSubmit={handleClick}>
            <form className={style.form}>
                <input type="search" placeholder="enter city,state" onChange={handleChange} />
                <button onClick={handleClick}>change</button>
            </form>
            <div onClick={useGPS} className={style.gps}>
              Get Current Location
            </div>
            <img src="https://cliply.co/wp-content/uploads/2019/03/371903340_LOCATION_MARKER_400.gif" alt="location GIF"></img>
        </div>
    )
}