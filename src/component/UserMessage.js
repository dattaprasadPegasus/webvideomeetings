import React from 'react'
import './Component.css'
import receiver from '../assets/images/receiver.png'
function UserMessage(props){
    return(
        <div style={{display : 'flex', flexDirection : 'column', margin : 10}}>
           <div style={{display : 'flex', flexDirection : 'row', justifyContent : 'space-between', padding : 5}}>
            <span className="user-name">John Doe</span>
            <span className="message-time">02.44PM</span>
           </div>
           <span className="receiver-message">Let’s continue this topic tomorrow.sd fa sdagasdgsf as asdfadsf a asf asdf dasf asdf gsd gdsgS GASDG   ADSG ADS</span>
        </div>
    )
}
export default UserMessage