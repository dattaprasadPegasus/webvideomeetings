import React , {useState} from 'react'
import './Component.css'
import { Tab,Tabs } from '@material-ui/core';
import UserMessage from './UserMessage'
import MyMessage from './MyMessage'
function ChatBox(props){
    const [select, setSelect] = useState(0)
    return(
        <div className="chatbox-container">
            <div className="chat-title-container">
                <span className="chat">Chat</span>
            </div>
            <div style={{display : 'flex', flexDirection : 'row'}}>
                <button className={select == 0 ? "active-button" : "inactive-button"} onClick={() => setSelect(0)}>
                <span className="button-title">Everyone</span>
                </button>
                <button className={select == 1 ? "active-button" : "inactive-button"} onClick={() => setSelect(1)}>
                <span className="button-title">Private</span>
                </button>
            </div>
            <div className="Rectangle-297"/>
            <div style={{display : 'flex', flexDirection : 'column'}}>
            <UserMessage/>
            <MyMessage/>
            </div>

            <div style={{ flex : 1, backgroundColor : 'green', marginTop : 38, display : 'flex', flexDirection : 'row', borderRadius : 10}}>

            </div> 
            {/* 
           
            
            */}
        </div>
    )
}

export default ChatBox