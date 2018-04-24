'use strict';
/**
 * Created by gogoout on 16/2/14.
 */
import Immutable, {Map, List} from 'immutable';
import {LOCATION_CHANGE} from 'react-router-redux';

/**
 * This reducer will update the state with the most recent location history
 * has transitioned to. This may not be in sync with the router, particularly
 * if you have asynchronously-loaded routes, so reading from and relying on
 * this state it is discouraged.
 */
export default function routerReducer(state = Map({
	locationBeforeTransitions: null,
	locationHistory          : List()
}), { type, payload }) {
	if (type === LOCATION_CHANGE) {
		state = state.merge({locationBeforeTransitions: payload});
		state = state.update('locationHistory', locationHistory => locationHistory.unshift(Immutable.fromJS(payload)));
	}
	return state;
}