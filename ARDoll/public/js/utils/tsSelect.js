'use strict';
import {createSelector} from 'reselect';

const app = state => state.get('app'),
	data = state => state.get('data');

const route = state => state.get('route');
route.toJS = createSelector(
	route,
	route => route.toJS()
);
export default{
	app,
	data,
	route
};