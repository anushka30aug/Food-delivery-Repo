import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { changeCategory, resetValues } from '../Redux/dataState';
import { fetchCity, fetchPayload } from '../Redux/userCityState';
import { setModal, setProductDetail } from '../Redux/Detailing';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import RestaurantList from './Restaurant/RestaurantList';
import Footer from './Footer';
import style from '../Styling/Home.module.css';


export default function Home() {
    // eslint-disable-next-line
    const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const city = useSelector(state => state.userCity.city)
    useEffect(() => {
        if (localStorage.getItem('token') === null || undefined) {
            return navigate('/login')
        }
        else {
            if (city === null) {
                var x = toast.loading("fetching...")
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const updatedCoordinates = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                            };
                            setCoordinates(updatedCoordinates);
                            dispatch(fetchCity(updatedCoordinates)).then(data => toast.dismiss(x));
                        },
                        (error) => {
                            console.log('Geolocation is not available. Fetching data...');
                            dispatch(fetchPayload()).then(data => toast.dismiss(x));
                        }
                    );
                } else {
                    console.log('Geolocation is not supported. Fetching data...');
                    dispatch(fetchPayload()).then(data => toast.dismiss(x));
                }
            }
            dispatch(setModal(false))
            dispatch(setProductDetail({}))
            //this is because wheneber we open the detailing of product and direct come back to home page without closing the detail then it remains openif we click on any other category
        }
        // eslint-disable-next-line
    }, []);


    const handleClick = (e) => {
        e.preventDefault();
        dispatch(resetValues());
        dispatch(changeCategory(e.target.name));
        navigate('/productList');
    }

    return (
        <div>

            <header className={style.header}>
                <div>
                    <h1>Trofi</h1>
                    <b>Find the best food nearby</b>
                </div>
            </header>

            <main className={style.main}>
                <div className={style.mainItems}> <li className={style.category}> <img src="https://img.freepik.com/free-photo/gourmet-bowl-with-healthy-rice-meat-vegetables-generated-by-ai_188544-14076.jpg?size=626&ext=jpg&ga=GA1.1.982961382.1695667691&semt=ais" alt="" onClick={handleClick} name='Indian' ></img> </li> INDIAN </div>
                <div className={style.mainItems}> <li className={style.category}> <img src="https://img.freepik.com/free-photo/top-view-delicious-noodles-concept_23-2148773775.jpg?size=626&ext=jpg&ga=GA1.2.982961382.1695667691&semt=sph" alt="" onClick={handleClick} name='Chinese' ></img> </li> CHINESE </div>
                <div className={style.mainItems}> <li className={style.category}> <img src="https://img.freepik.com/free-photo/baked-lasagna-with-gourmet-italian-bolognese-sauce-generated-by-ai_188544-9608.jpg?size=626&ext=jpg&ga=GA1.1.982961382.1695667691&semt=sph" alt="" onClick={handleClick} name='Italian' ></img> </li> ITALIAN </div>
                <div className={style.mainItems}> <li className={style.category}> <img src="https://img.freepik.com/free-photo/top-view-fast-food-mix-hamburger-doner-sandwich-chicken-nuggets-rice-vegetable-salad-chicken-sticks-caesar-salad-mushrooms-pizza-chicken-ragout-french-fries-mayo_141793-3997.jpg?size=626&ext=jpg&ga=GA1.1.982961382.1695667691&semt=sph" alt="" onClick={handleClick} name='fast-food' ></img> </li> FAST-FOOD</div>
                <div className={style.mainItems}> <li className={style.category}> <img src="https://img.freepik.com/free-photo/cocktail-glasses_144627-34955.jpg?size=626&ext=jpg&ga=GA1.2.982961382.1695667691&semt=sph" alt="" onClick={handleClick} name='Drinks' ></img> </li> DRINKS </div>
                <div className={style.mainItems}> <li className={style.category}> <img src="https://img.freepik.com/free-photo/gourmet-dessert-collection-cute-macaroon-tray-generated-by-ai_188544-21953.jpg?size=626&ext=jpg&ga=GA1.2.982961382.1695667691&semt=sph" alt="" onClick={handleClick} name='Sweets' ></img> </li> SWEETS</div>
            </main>
            <RestaurantList />
            <Footer />
        </div>
    )
}