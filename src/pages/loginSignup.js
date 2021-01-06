import React from 'react'

import logo from  '../assets/logo.png'
import {
    Link
} from "react-router-dom";
import './LoginSignup.css'
class LoginSignup extends React.Component {
    render(){
        return(
            <div className="mainDiv">
                <div className="container">
                    <img src={logo} className="logo"/>
                    <button className="sign-in">
                    <Link className="Sign-In-Button-Text" to="/signin">Sign In</Link>
                        </button>
                    <button className="join-in">
                    <Link className="Join-Meeting-Button-Text" to="/joinmeeting">Join Meeting</Link>
                        </button>
                </div>
            </div>
        )
    }
}

export default LoginSignup