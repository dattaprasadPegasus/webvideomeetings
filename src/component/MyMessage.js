import React from 'react'
import './Component.css'
function MyMessage(props){
    return(
        <div style={{display : 'flex', flexDirection : 'column', margin : 10}}>
           <div style={{display : 'flex', flexDirection : 'row', justifyContent : 'flex-end', alignItems : 'center', padding : 5}}>
            <span className="my-name">Me</span>
            <span className="message-time">02.44PM</span>
           </div>
           <span className="sender-message">Let’s continue this topic tomorrow.sd fa sdagasdgsf as asdfadsf a asf asdf dasf asdf gsd gdsgS GASDG   ADSG ADS</span>
        </div>
    )
}
export default MyMessage