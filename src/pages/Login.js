import React from 'react'
import './Login.css'
import logo from  '../assets/logo.png'
import { Checkbox } from '@material-ui/core'
class Login extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            isLoggedIn : false,
            email : '',
            password : '',
            meeting_name : ''
        }
    }

    login = () => {
        setTimeout(() => {
            this.setState({
                isLoggedIn : true
            })
        },2000) 
    }

    start_meeting = () => {
        if (this.state.meeting_name !== "") {
			var url = this.state.meeting_name.split("/")
			window.location.href = `/${url[url.length-1]}`
		} else {
			var url = Math.random().toString(36).substring(2, 7)
			window.location.href = `/${url}`
		}
    }

    render(){
        const {isLoggedIn} = this.state
        return(
            <div className="mainDiv">
                <div className="container">
                    {!isLoggedIn ? <> 
                        <img src={logo} className="logo"/>
                    <span className="Sign-In"> Sign In </span>

                    <input className="email" 
                    placeholder="Email" 
                    onChange={(event) => this.setState({email : event.target.value })}
                    value={this.state.email}
                    />
                    <input className="email"
                     placeholder="Password"
                      type="password"
                      onChange={(event) => this.setState({password : event.target.value })}
                    value={this.state.password}
                      >
                        
                        </input>
                    <div className="item-row">
                     <Checkbox/>
                     <span className="Keep-me-signed-in">Keep me signed in</span>
                     <span className="Forgot-Password">Forgot Password?</span>
                    </div>
                    <button className="continue" onClick={this.login}>
                        <span className="Continue">Continue</span>
                        </button> 
                    </> :
                    <>
                         <input className="email"
                     placeholder="Meeting Name"
                      onChange={(event) => this.setState({meeting_name : event.target.value })}
                    value={this.state.meeting_name}
                      ></input>
                         <button className="continue" onClick={this.start_meeting}>
                        <span className="Continue">Start Meeting</span>
                        </button> 

                     </>
                    }
                    
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