import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { changeCategory, fetchData, resetValues, setSubCategory } from '../Redux/dataState';
import { fetchCity, fetchPayload } from '../Redux/userCityState';
import { setModal, setProductDetail } from '../Redux/Detailing';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import RestaurantList from './Restaurant/RestaurantList';
import Footer from './Footer';
import style from '../Styling/Home.module.css';
import { fetchCartItems } from '../Redux/cartSlice';


export default function Home() {
    // eslint-disable-next-line
    const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
    const [searchValue,setSeachValue]=useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const city = useSelector(state => state.userCity.city)
    useEffect(() => {
        if (!localStorage.getItem('token') ) {
            return navigate('/login')
        }
        else {
            if (city === null) {
                var load = toast.loading("fetching...")
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            console.log('fetching geolocation');
                            const updatedCoordinates = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                            };
                            setCoordinates(updatedCoordinates);
                            dispatch(fetchCity(updatedCoordinates)).then(data => toast.dismiss(load));
                        },
                        (error) => {
                            console.log('Geolocation is not available. Fetching data...');
                            dispatch(fetchPayload()).then(data => toast.dismiss(load));
                        }
                    );
                } else {
                    console.log('Geolocation is not supported. Fetching data...');
                    dispatch(fetchPayload()).then(data => toast.dismiss(load));
                }
            }
            dispatch(setModal(false))
            dispatch(setProductDetail({}))
            //this is because whenever we open the detailing of product and direct come back to home page without closing the detail then it remains openif we click on any other category
            dispatch(fetchCartItems());
        }
        // eslint-disable-next-line
    }, []);

    
    const handleCategoryClick = (e) => {
        e.preventDefault();
        dispatch(resetValues());
        dispatch(changeCategory(e.target.name));
        navigate('/productList');
    }

   const handleSubCategoryChange=(e)=>{
      setSeachValue(e.target.value)
   }

   const handleSubCategoryClick=(e)=>{
       e.preventDefault();
       dispatch(setSubCategory(searchValue.trim()));
       dispatch(fetchData());
       navigate('/productList');
   }



    return (
        <div className={style.home}>

            <header className={style.header}>
                <div>
                    <h1>Trofi</h1>
                    <b>Find the best food nearby</b>
                    <form className={style.searchForm} onSubmit={handleSubCategoryClick}>
                        <input type='search' placeholder='search Food e.g. pizza' value={searchValue} onChange={handleSubCategoryChange}/>
                        <button onClick={handleSubCategoryClick}>Search</button>
                    </form>
                </div>
            </header>

            <main className={style.main}>
                <div className={style.mainItems}> <li className={style.category}> <img src="https://img.freepik.com/free-photo/gourmet-bowl-with-healthy-rice-meat-vegetables-generated-by-ai_188544-14076.jpg?size=626&ext=jpg&ga=GA1.1.982961382.1695667691&semt=ais" alt="" onClick={handleCategoryClick} name='Indian' ></img> </li> INDIAN </div>
                <div className={style.mainItems}> <li className={style.category}> <img src="https://img.freepik.com/free-photo/top-view-delicious-noodles-concept_23-2148773775.jpg?size=626&ext=jpg&ga=GA1.2.982961382.1695667691&semt=sph" alt="" onClick={handleCategoryClick} name='Chinese' ></img> </li> CHINESE </div>
                <div className={style.mainItems}> <li className={style.category}> <img src="https://img.freepik.com/free-photo/baked-lasagna-with-gourmet-italian-bolognese-sauce-generated-by-ai_188544-9608.jpg?size=626&ext=jpg&ga=GA1.1.982961382.1695667691&semt=sph" alt="" onClick={handleCategoryClick} name='Italian' ></img> </li> ITALIAN </div>
                <div className={style.mainItems}> <li className={style.category}> <img src="https://img.freepik.com/free-photo/top-view-fast-food-mix-hamburger-doner-sandwich-chicken-nuggets-rice-vegetable-salad-chicken-sticks-caesar-salad-mushrooms-pizza-chicken-ragout-french-fries-mayo_141793-3997.jpg?size=626&ext=jpg&ga=GA1.1.982961382.1695667691&semt=sph" alt="" onClick={handleCategoryClick} name='fast-food' ></img> </li> FAST-FOOD</div>
                <div className={style.mainItems}> <li className={style.category}> <img src="https://img.freepik.com/free-photo/cocktail-glasses_144627-34955.jpg?size=626&ext=jpg&ga=GA1.2.982961382.1695667691&semt=sph" alt="" onClick={handleCategoryClick} name='Drinks' ></img> </li> DRINKS </div>
                <div className={style.mainItems}> <li className={style.category}> <img src="https://img.freepik.com/free-photo/gourmet-dessert-collection-cute-macaroon-tray-generated-by-ai_188544-21953.jpg?size=626&ext=jpg&ga=GA1.2.982961382.1695667691&semt=sph" alt="" onClick={handleCategoryClick} name='Sweets' ></img> </li> SWEETS</div>
            </main>
            <RestaurantList />
        </div>
    )
}