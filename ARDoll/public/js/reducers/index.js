'use strict';
import {combineReducers} from 'redux-immutable';
import data from './data';
import app from './app';
import route from './route';

export default combineReducers({
	route,
	data,
	app
});