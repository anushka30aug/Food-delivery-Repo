import { useDispatch, useSelector } from 'react-redux';
import PurchaseItemDesc from '../buy/purchaseItemDesc';
import Style from '../../Styling/UserOrder.module.css';
import { setOrderDetail } from '../../Redux/Detailing';
import { useNavigate } from 'react-router';


export default function UserOrders() {
    const dispatch = useDispatch();
    const navigate  = useNavigate();
    const orderedItems = useSelector(state => state.orderData.orderedItems)
    // console.log("order details "+orderedItems)


    const handleClick = (item) => {
        dispatch(setOrderDetail(item));
        navigate(`/userOrder?id=${item._id}`)
        
    }


    if (orderedItems.length === 0 || orderedItems === null)
        return (
            <div className={Style.image}>
                <img src='https://organickle.com/images/no-order.svg' alt='no order found' />
            </div>
        )


    return (
        <div className={Style.orders}>
            {orderedItems.length>0 && orderedItems.map((item,index) => {
                
                    // console.log(item);
                
                return (
                    <div className={Style.orderDescription} key={index} onClick={(e) => { e.preventDefault(); handleClick(item) }}>
                       

                        <PurchaseItemDesc key={index} item={item.productDetail} />

                        <div className={Style.date}>
                            Ordered On - <span>{item.date.split('T')[0]}</span>
                        </div>
                        <div className={Style.status}>
                            Delivery Status - <span style={{ color: item.delivery_status === 'processing' ? 'orangered' : 'green' }}>{item.delivery_status}</span>
                        </div>
                    </div>
                )
            })
            }
        </div>
    )
}