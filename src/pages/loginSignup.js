import React from 'react'
import './LoginSignup.css'
import logo from  '../assets/logo.png'
import Input from '../component/Input'
class LoginSignup extends React.Component {
    render(){
        return(
            <div className="mainDiv">
                <div className="container">
                    <img src={logo} className="logo"/>
                    <button className="sign-in">
                       <span className="Sign-In"> Sign In </span>
                        </button>
                    <button className="join-in">
                        <span className="Join-Meeting">Join Meeting</span>
                        </button>
                </div>
            </div>
        )
    }
}

export default LoginSignup