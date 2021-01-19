import React, { useState } from 'react'
import './Component.css'
function ImageButton(props){
    const [isActive, setActive] = useState(true)
    const [isShow, showView] = useState(false)
    return(
        <>
        {/* {isShow && 
            <div className="hide">
            <span>{props.title}</span>
       </div>
        } */}
         
        <div className="main-div" onMouseEnter={() => showView(true)} onMouseLeave={() => showView(false)}>
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