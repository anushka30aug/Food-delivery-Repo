import React from "react";
import { useSelector } from "react-redux";
import { RWebShare } from "react-web-share";
import { Share } from "../Icon";

export default function ShareProduct() {
    const detail = useSelector(state => state.Detail.productDetail);
    const style={
        backgroundColor:"transparent",
        border:"none",
        padding:"0",
        minWidth:"30px",
        minHeight:"30px"
    }
    return (
        <div>
            <RWebShare
                data={{
                    text: `Web Share - ${detail.name} `,
                    url:window.location.href ,
                    title: "Trofi",
                }}
                onClick={() =>
                    console.log("shared successfully!")
                }
            >
                <button style={style}><Share/></button>
            </RWebShare>
        </div>
    );
}
