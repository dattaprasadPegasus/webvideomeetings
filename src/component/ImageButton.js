import React, { useState } from 'react'
import './Component.css'
function ImageButton(props){
    const [isActive, setActive] = useState(true)
    return(
        <div style={{display : 'flex', flexDirection : 'column', justifyContent : 'center', alignItems : 'center'}}>
            <img src={isActive ? props?.active : props?.inactive} onClick={() => {
                if(props?.isChangeble){
                    setActive(!isActive)
                }
                props.onClick(isActive)
                }}
                className="image-button"
                />
            <span  className="image-button-title">{props?.title}</span>
        </div>
    )
}
export default ImageButton