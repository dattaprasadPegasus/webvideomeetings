import React, { Component } from 'react'
import Video from './Video'
import Home from './Home'
import LoginSignup from './pages/loginSignup'
import Login from './pages/Login'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

class App extends Component {
	render() {
		return (
			<div>
				<Router>
					<Switch>
						{/* <Route path="/" exact component={Home} /> */}
						<Route path="/:url" component={Video} />
						{/* <Route path="/" exact component={LoginSignup}/> */}
						<Route path="/" exact component={Login}/>
					</Switch>
				</Router>
			</div>
		)
	}
}

export default App;