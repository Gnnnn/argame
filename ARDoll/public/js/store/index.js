/* eslint-disable camelcase*/
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom';
/* eslint-enable camelcase*/
import { createStore, applyMiddleware, compose } from 'redux';
import Immutable from 'immutable';
import thunk from 'redux-thunk';
import normalizr from 'redux-normalizr-middleware';
import {routerMiddleware} from 'react-router-redux';
import {enableBatching} from 'redux-batched-actions';
import { batchedSubscribe } from 'redux-batched-subscribe';
import history from '../history';
import {batchedSourcer,singleSourcer} from '../middlewares/sourcer';
import rootReducer from '../reducers';


const enhancer = compose(
	applyMiddleware(batchedSourcer.start, thunk, singleSourcer, normalizr(), routerMiddleware(history), batchedSourcer.last),
	batchedSubscribe(batchedUpdates)
);

export default function configureStore(initialState) {
	return createStore(enableBatching(rootReducer), Immutable.fromJS(initialState || {}), enhancer);
};
