'use strict';
/**
 * Created by gogoout on 16/1/18.
 */
import assign from 'lodash/assign';
import isFunction from 'lodash/isFunction';
import {batchActions} from 'redux-batched-actions';
import {constants,webHelper} from '../utils';

const BATCHED_START = 'SOURCER:BATCHED_START';
const BATCHED_END = 'SOURCER:BATCHED_END';
export const SOURCER_DEF = Symbol('SOURCE_DEF');
export const BATCH_SOURCER_DEF = Symbol('BATCH_SOURCER_DEF');

function isResponse(res) {
	return !!(res.config && res.headers);
}

function getCount(res) {
	let count;
	if (isResponse(res)) {
		count = res.headers[constants.HEADER_COUNT];
		if (count) {
			count = parseInt(count, 10);
		}
		return {count};
	}
	return {};
}

function singlePromiseHandler(action, next) {
	const { meta, promise, types } = action;
	const [ REQUEST_TYPE, SUCCESS_TYPE, FAILURE_TYPE ] = types;

	next({type: REQUEST_TYPE, meta});


	return promise.then(
		response => next({
			type   : SUCCESS_TYPE,
			payload: isResponse(response) ? response.data : response,
			meta   : assign(getCount(response), meta)
		}),
		err => {
			let res = err.response;
			let returnError = {
				message: constants.NETWORK_BROKEN_ERROR,
				code   : res.status
			};
			if (!webHelper.isNetworkBroken(err)) {
				returnError.message = res.data && res.data.message || err.message;
			}
			return next({
				type : FAILURE_TYPE,
				error: returnError
			});
		}
	);
}

let batchedActions = [],
	sourcers = [];
function batchedPromiseHandler(actions, store, next) {

	function getRealAction(action) {
		if (action[SOURCER_DEF]) {
			sourcers.push(action[SOURCER_DEF]);
		}
		else if (isFunction(action)) {
			action(getRealAction, store.getState);
		}
		else {
			batchedActions.push(action);
		}
	}

	// syncing action
	actions.payload.forEach(action=>getRealAction(action));
	let promises = sourcers.map(sourcer => singlePromiseHandler(sourcer, getRealAction));

	if (batchedActions.length) {
		next({type: BATCHED_START});
		batchedActions.forEach(action=>next(action));
		next({type: BATCHED_END});
	}
	sourcers = [];
	// syncing end

	Promise.all(promises).then(results=> {
		if (batchedActions.length) {
			next({type: BATCHED_START});
			batchedActions.forEach(action=>next(action));
			next({type: BATCHED_END});
		}
	});
}

export const singleSourcer = store => next => action => {
	const def = action[SOURCER_DEF];
	if (def) {
		return singlePromiseHandler(def, next);
	}
	return next(action);
};

export const batchedSourcer = {};
batchedSourcer.start = store => next => action => {
	const batchedDef = action[BATCH_SOURCER_DEF];
	if (batchedDef) {
		return batchedPromiseHandler(batchedDef, store, next);
	}
	return next(action);
};

let cacheActions = [], isBatching = false;
batchedSourcer.last = store => next => action => {
	if (action.type === BATCHED_START) {
		isBatching = true;
	}
	else if (action.type === BATCHED_END) {
		isBatching = false;
		batchedActions = [];
		next(batchActions(cacheActions));
		cacheActions = [];
	}
	else if (isBatching) {
		cacheActions.push(action);
	}
	else {
		next(action);
	}
};

export function createBatchedActions(actions) {
	return {
		[BATCH_SOURCER_DEF]: {
			payload: actions
		}
	};
}
