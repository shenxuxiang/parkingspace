import React, { Component } from 'react'
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import pureRenderMixin from 'react-addons-pure-render-mixin'

import Home from './pages/home'
import ToPay from './pages/topay'
import Detail from './pages/detail'
import ParkingSpace from './pages/parkingspace'
export default
class RouteMap extends Component {
    constructor () {
        super()
        this.state = {}
        this.shouldComponentUpdate = pureRenderMixin.shouldComponentUpdate.bind(this)
    }
	render () {
		return (
			<Router>
				<div className="contain-box">
					<Route path="/home" component={Home} />
					<Route path="/topay" component={ToPay} />
					<Route path="/detail" component={Detail} />
                    <Route path="/parkingspace" component={ParkingSpace} />
					<Switch>
						<Redirect exact from="/" to="/home"/>
					</Switch>
				</div>
			</Router>
		)
	}
}
