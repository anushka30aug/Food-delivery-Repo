import { useDispatch, useSelector } from 'react-redux';
import PurchaseItemDesc from '../buy/purchaseItemDesc';
import Style from '../../Styling/UserOrder.module.css';
import { setOrderDetail, setOrderDetailModal } from '../../Redux/Detailing';


export default function UserOrders() {
    const dispatch = useDispatch();
    const orderedItems = useSelector(state => state.orderData.orderedItems)



    const handleClick = (item) => {
        dispatch(setOrderDetail(item));
        dispatch(setOrderDetailModal(true));
    }


    if (orderedItems.length === 0 || orderedItems === null)
        return (
            <div className={Style.image}>
                <img src='https://organickle.com/images/no-order.svg' alt='no order found' />
            </div>
        )


    return (
        <div className={Style.orders}>
            {orderedItems.map((item) => {
                return (
                    <div className={Style.orderDescription} onClick={(e) => { e.preventDefault(); handleClick(item) }}>
                       
                        <div className={Style.date}>
                            Date - {item.date}
                        </div>

                        <PurchaseItemDesc key={item.id} item={item.productDetail} />

                        <div>
                            Delivery Status - <span style={{ color: item.delivery_status === 'processing' ? 'orangered' : 'green' }}>{item.delivery_status}</span>
                        </div>
                    </div>
                )
            })
            }
        </div>
    )
}