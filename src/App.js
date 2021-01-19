import React, { Component } from 'react'
import Video from './Video'
import Home from './Home'
import LoginSignup from './pages/LoginSignup'
import Login from './pages/Login'
import JoinMeeting from './pages/JoinMeeting'
import Dashboard from './pages/Dashboard'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

class App extends Component {
	render() {
		console.log("App page render")
		return (
			<div>
				<Router>
					<Switch>
						{/* <Route path="/" exact component={Home} /> */}
						
						<Route path="/" exact component={LoginSignup}/>
						 <Route path="/signin" exact component={Login}/>
						<Route path="/joinmeeting" exact component={JoinMeeting}/>
						<Route path="/:url" exact component={Dashboard}/> 
						{/* <Route path="/:url" component={Video} /> */}
						
					</Switch>
				</Router>
			</div>
		)
	}
}

export default App;