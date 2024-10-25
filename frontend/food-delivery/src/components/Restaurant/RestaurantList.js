import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { incrementPage, fetchRestaurants, setName, setRating } from "../../Redux/restaurantDtataState";
import { useEffect, useState } from "react";
import RestaurantModal from "./RestaurantModal";
import style from '../../Styling/RestaurantList.module.css';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Search } from "../Icon";

export default function RestaurantList() {
    const dispatch = useDispatch();
    const data = useSelector(state => state.restaurantData.data);
    const totalLength = useSelector(state => state.restaurantData.totalResults);
    const city = useSelector(state => state.userCity.city)
    const dataLength = data.length;
    const rating  = useSelector(state=>state.restaurantData.rating);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(
        () => {
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
                    <form className={style.search_form} onSubmit={handleSubmit}>
                        <Search/>
                        <input type="search" placeholder="Search Restaurant" value={search} onInput={handleChange} required />
                        <input type="submit" hidden/>
                    </form>
                </div>

                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="demo-select-small-label">Rating</InputLabel>
                    <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={rating}
                        label="Rating"
                        onChange={handleSelectChange}
                    >
                        <MenuItem value="all">
                            <em>Default</em>
                        </MenuItem>
                        <MenuItem value={'top'}>Top</MenuItem>
                        <MenuItem value={'more than 4'}>4+ Rating</MenuItem>
                    </Select>
                </FormControl>

            </div>
            {/* {
                dataLength===0?
            } */}
            <InfiniteScroll
                dataLength={dataLength}
                hasMore={hasMore()}
                next={fetchMore}
            >
                <div className={style.restaurantList}>
                    {dataLength === 0 ? (
                        Array.from({ length: 8 }).map((_, index) => {
                            return <Skeleton variant="rectangular" key={index} height={200} style={{
                                maxWidth: "300px",
                                margin: "1em",
                                height: "400px"
                            }} />
                        })
                    ) : (
                        data.map((item, index) => (<RestaurantModal key={index} item={item} />))
                    )
                    }
                </div>
                <br/>
                {loading ? <div className={style.Loader}><CircularProgress style={{ color: 'green' }} /></div> : ''}

            </InfiniteScroll>
        </div>
    )
}