/**
 * Created by Koan on 2017/9/25.
 */
'use strict';
import React, { Component, PropTypes } from 'react';
import {Provider} from 'react-redux';
import { Router } from 'react-router';
import Routes from './Routes';

export default class Root extends Component {
	render() {
		const { store, history } = this.props;
		return (
			<Provider store = {store}>
				<Router history = {history}>
					{Routes}
				</Router>
			</Provider>
		);
	}
}


Root.propTypes = {
	store  : PropTypes.object.isRequired,
	history: PropTypes.object.isRequired
};