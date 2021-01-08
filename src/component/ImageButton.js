import React, { useState } from 'react'
import './Component.css'
function ImageButton(props){
    const [isActive, setActive] = useState(true)
    return(
        <>
         <div className="hide">
        </div>
        <div className="main-div">
            <img src={isActive ? props?.active : props?.inactive} onClick={() => {
                if(props?.isChangeble){
                    setActive(!isActive)
                }
                props.onClickButton("test")
                }}
                className="image-button"
                />
            <span  className="image-button-title">{props?.title}</span>
            
        </div>
       
        </>
    )
}
export default ImageButton