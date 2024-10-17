import style from '../../Styling/purchaseItemDesc.module.css'

export default function purchaseItemDesc({ item, isDifferentCity }) {
    return (
        <div className={` ${isDifferentCity ? style.differentCityItems : style.sameCityItems}`}>
            <div className={style.item}  >
                <div className={style.itemImage}>
                    <img src={item.image} alt="food" />
                </div>
                <div className={style.itemDescription}>
                    <h3>{item.name}</h3>
                    <div> <b>₹{item.price}</b>/-</div>
                    <div> Quantity - {item.productQuantity}</div>
                </div>
            </div>
            <h4>{isDifferentCity ? 'out of Delivery range' : ''}</h4>
        </div>
    )
}