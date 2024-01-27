import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchData, resetValues } from "../../Redux/dataState";
import { incrementPage } from "../../Redux/dataState";
import { useDispatch, useSelector } from "react-redux";
import ProductCart from './productModal';
import ProductDetail from "./ProductDetail";
import style from '../../Styling/ProductList.module.css';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Footer from '../Footer';
import { Loading } from "../Icon";

export default function ProductList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const dataValue = useSelector((state) => state.data.data || []);
    const totalLength = useSelector((state) => state.data.totalResults);
    const dataLength = useSelector((state) => dataValue.length);
    const city = useSelector(state => state.userCity.city);
    const showdetail = useSelector(state => state.Detail.showdetail);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('token') === null || undefined) {
            return navigate('/login');
        }
        dispatch(resetValues());
        dispatch(fetchData()).then((data) => window.scrollTo({ top: 0, left: 0 }));
        setLoading(true);
        // eslint-disable-next-line
    }, [city]);


    const hasMore = () => {
        if (dataLength < totalLength) {
            if (loading === false)
                setLoading(true);
            return true;
        }
        else {
            // console.log(loading)
            if (loading === true)
                setLoading(false);
            return false;
        }
    }


    const fetchMore = () => {
        dispatch(incrementPage());
        dispatch(fetchData());
    }


    return (
        <div>
            {showdetail && <ProductDetail />}
            <InfiniteScroll
                dataLength={dataLength}
                hasMore={hasMore()}
                next={fetchMore}
            >
                <div className={style.products}>
                    {dataLength === 0 ? (
                        <div className={style.skeleton_Container}>
                            <Skeleton className={style.skeleton} width='320px' count={5} />
                        </div>
                    ) : (
                        dataValue.map((item, index) => (
                            <ProductCart key={index} item={item} />
                        )

                        )
                    )}
                </div>
                {loading ? <div className={style.Loader}><b>Loading</b><Loading /></div> : ''}


            </InfiniteScroll>
            <Footer />
        </div>
    );
}
