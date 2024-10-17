import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { editUserProfile, fetchuser, setProfile } from "../../Redux/UserProfile";
import 'react-sliding-side-panel/lib/index.css';
import style from '../../Styling/EditProfile.module.css';
import { Cross } from '../Icon';
import { uploadProfilePicture } from '../../Redux/UserProfile';
import img from '../Helper/profile-pic.jpg';
import toast from 'react-hot-toast';


export default function EditProfile() {
    const dispatch = useDispatch();
    const inputref = useRef(null);
    const userContact = useSelector(state => state.deliveryData.contact);
    const userName = useSelector(state => state.deliveryData.name);
    const image = useSelector(state=>state.deliveryData.profilePicture);
    const [number, setNumber] = useState(userContact);
    const [name, setName] = useState(userName);
    console.log(image)
    const handleImageClick = (e) => {
        inputref.current.click();
    }
    const handleImageChange = async(e) => {
        const file = e.target.files[0];
        console.log(file);
        var load = toast.loading("uploading...")
        const data = await dispatch(uploadProfilePicture({ photo: file }));
        if(data.payload.result)
        {
            toast.dismiss(load)
            dispatch(fetchuser())
        }
        toast.dismiss(load)
    }

    const changeNumber = (e) => {
        if(e.target.value){
            if(e.target.value.length<10){
                setNumber(e.target.value)
            }
        }
    }
    const changeUserName = (e) => {
        setName(e.target.value)
    }

    const handleClick = async (e) => {
        e.preventDefault();
        if (number === userContact && name === userName) {
            //do nothing if user changes nothing
        }
        else {
            var load = toast.loading("updating...")
            const data = await dispatch(editUserProfile({ name, number }));
            if (data.payload.updated) {
                toast.dismiss(load)
                dispatch(fetchuser())
            }
            toast.dismiss(load)
        }
        dispatch(setProfile(false))
    }

    const removeProfileSection = (e) => {
        e.preventDefault();
        dispatch(setProfile(false))
    }

    return (

        <div className={style.panel_container}>
            <div onClick={removeProfileSection}><Cross /></div>
            <main className={style.mainContent_container}>

                <div className={style.profile} onClick={handleImageClick}>
                    <img src={image === '' || image === null ? img : image} alt='' />
                    <input type='file' ref={inputref} accept="image/png, image/jpeg" style={{ display: 'none' }} onChange={handleImageChange} />
                </div>
                <div className={style.userName_container}>
                    <h4>User Name</h4>
                    <input type="text" value={name} onChange={changeUserName} />
                </div>
                <div className={style.number_container}>
                    <h4>Contact Number</h4>
                    <input type="number" placeholder="--" value={number} onChange={changeNumber} />
                </div>
                <button onClick={handleClick}>Done</button>
            </main>
        </div>


    )
}