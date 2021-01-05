import React from 'react'
import './Login.css'
import logo from  '../assets/logo.png'
import { Checkbox } from '@material-ui/core'
class Login extends React.Component {
    render(){
        return(
            <div className="mainDiv">
                <div className="container">
                    <img src={logo} className="logo"/>
                    <span className="Sign-In"> Sign In </span>

                    <input className="email" placeholder="Email"/>
                    <input className="email" placeholder="Password" type="password">
                        
                        </input>
                    <div className="item-row">
                     <Checkbox/>
                     <span className="Keep-me-signed-in">Keep me signed in</span>
                     <span className="Forgot-Password">Forgot Password?</span>
                    </div>
                    <button className="continue">
                        <span className="Continue">Continue</span>
                        </button> 
                    {/* <button className="sign-in">
                      
                        </button>
                    <button className="join-in">
                        <span className="Join-Meeting">Continue/span>
                        </button> */}
                </div>
            </div>
        )
    }
}

export default Login