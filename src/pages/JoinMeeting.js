import React from 'react'
import './JoinMeeting.css'
import logo from  '../assets/logo.png'
import { Checkbox } from '@material-ui/core'
class JoinMeeting extends React.Component {
    render(){
        return(
            <div className="mainDiv">
                <div className="container">
                    <img src={logo} className="logo"/>
                    <span className="Join-Meeting"> Join Meeting </span>

                    <input className="Meeting-Id" placeholder="Meeting ID or meeting link"/>
                    <input className="Meeting-Id" placeholder="My display name">
                        
                        </input>
                    
                    <button className="continue">
                        <span className="Continue">Join as Attendee</span>
                        </button> 
                        <button className="join-in">
                        <span className="Join-as-Interpreter">Join as Interpreter</span>
                        </button>
                   
                </div>
            </div>
        )
    }
}

export default JoinMeeting