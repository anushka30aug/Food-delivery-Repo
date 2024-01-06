import React, { useEffect } from "react";
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

export default function ProductList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const dataValue = useSelector((state) => state.data.data || []);
    const totalLength = useSelector((state) => state.data.totalResults);
    const dataLength = useSelector((state) => dataValue.length);
    const city = useSelector(state => state.userCity.city);
    const showdetail = useSelector(state => state.Detail.showdetail)

    useEffect(() => {
        if (localStorage.getItem('token') === null || undefined) {
            return navigate('/login')
        }
        dispatch(resetValues());
        dispatch(fetchData()).then((data)=>window.scrollTo({top: 0, left: 0}));
        // eslint-disable-next-line
    }, [city]);

    const fetchMore = () => {
        dispatch(incrementPage());
        dispatch(fetchData());
    }

    return (
        <div>
            {showdetail && <ProductDetail />}
            <InfiniteScroll
                dataLength={dataLength}
                hasMore={dataLength < totalLength}
                next={fetchMore}
                inverse={false}>
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
                
            </InfiniteScroll>
            <Footer />
        </div>
    );
}
