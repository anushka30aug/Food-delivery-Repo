import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { incrementPage, fetchRestaurants, setName, setRating } from "../../Redux/restaurantDtataState";
import { useEffect, useState } from "react";
import RestaurantModal from "./RestaurantModal";
import style from '../../Styling/RestaurantList.module.css';
import { useNavigate } from 'react-router-dom';
import { Loading } from "../Icon";


export default function RestaurantList() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = useSelector(state => state.restaurantData.data);
    const totalLength = useSelector(state => state.restaurantData.totalResults);
    const city = useSelector(state => state.userCity.city)
    const dataLength = data.length;
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(
        () => {
            if (!localStorage.getItem('token')) {
                return navigate('/login')
            }
            if (city !== null) {
                if (dataLength === 0 && totalLength === 0) {
                    setLoading(true);
                    dispatch(fetchRestaurants())
                }
            }
            // eslint-disable-next-line
        }, [city])


    const handleChange = (e) => {
        setSearch(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(setName(search.trim()));
        dispatch(fetchRestaurants());
    }

    const fetchMore = () => {
        dispatch(incrementPage());
        dispatch(fetchRestaurants());
    }

    const hasMore = () => {
        if (dataLength < totalLength) {
            if (loading === false)
            setLoading(true);
            return true;
        }
        else {
            if (loading === true)
                setLoading(false);
                return false;
        }
        
    }


    const handleSelectChange = (e) => {
        dispatch(setRating(e.target.value));
        dispatch(fetchRestaurants())
    }

    return (
        <div>
            <h3 className={style.heading}>Restaurants Near You</h3>
            <div className={style.utilities}>
                <div className={style.searchbar}>
                    <form onSubmit={handleSubmit}>
                        <input type="search" placeholder="search Restaurant" value={search} onInput={handleChange} />
                        <button onClick={handleSubmit}>Search</button>
                    </form>
                </div>

                <select className={style.filter} onChange={handleSelectChange}>
                    <option value='all'>Filter</option>
                    <option value='all'>Default</option>
                    <option value='top'>Top</option>
                    <option value='more than 4'>4+ Rating</option>
                </select>
            </div>

            <InfiniteScroll
                dataLength={dataLength}
                hasMore={hasMore()}
                next={fetchMore}
            >
                <div className={style.restaurantList}>
                    {data.map((item, index) => (<RestaurantModal key={index} item={item} />))}
                </div>

                { loading?<div className={style.Loader}><b>Loading</b><Loading /></div>:'' }
            </InfiniteScroll>
        </div>
    )
}