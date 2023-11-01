import { useState } from "react";
import { setSubCategory , fetchData } from "../Redux/dataState";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

export default function Search()
{   const dispatch=useDispatch();
    const navigate = useNavigate()
    const [ input , setInput]=useState('');
    const handleChange=(e)=>{
        setInput(e.target.value)
    }
    
    const handleSubmit=(e)=>{
       e.preventDefault();
       dispatch(setSubCategory(input));
       dispatch(fetchData()).then(data=> navigate('/productList'))
    }
  return(
    <div>
        <form>
            <input type="search" value={input} onChange={handleChange}></input>
            <button onClick={handleSubmit}>Search</button>
        </form>
    </div>
  )
}