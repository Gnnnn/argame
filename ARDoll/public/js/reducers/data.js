'use strict';
/**
 * Created by Koan on 2017.9.25
 */
import {combineReducers} from 'redux-immutable';
import Immutable, {Map, List} from 'immutable';
import forEach from 'lodash/forEach';
import endsWith from 'underscore.string/endsWith';
import * as actionTypes from '../actions/api';
import * as clientActionTypes from '../actions/client';

let dataReducers = {};

const NORMAL_ACTIONS = ['users',
                        'advice',
                        'notices',
                        'versions',
                        'push',
                        'dolls',
                        'dollMachines',
                        'dollMachinePaws',
                        'rooms',
                        'categories',
                        'tags',
                        'visitors',
                        'rechargeMalls',
                        'pointMalls',
                        'announcements',
                        'orders',
                        'playRecords'];

function mergeData(data, key, entity) {
	return data.mergeDeep({[key]: entity});
}

function commonMerge(data, action) {
	const {result, entities} = action.payload;
	if (!entities) {
		return data;
	}
	NORMAL_ACTIONS.forEach(name => {
		var entity = entities[name];
		if (entity) {
			data = mergeData(data, name, entity);
		}
	});
	if (action.type === actionTypes.PUSH_SUCCESS) {
		data = data.update('loadedPushes', loadedNotices => List(result));
		data = data.update('pushCount', noticeCount => action.meta.count);
		data = data.update('pushCurrentPage', noticeCurrentPage => action.meta.args.page);
	}
	else if (action.type === actionTypes.ADVICE_SUCCESS) {
		data = data.update('loadedAdvice', loadedAdvice => List(result));
		data = data.update('adviceCount', adviceCount => action.meta.count);
		data = data.update('adviceCurrentPage', adviceCurrentPage => action.meta.args.page);
	}
	else if (action.type === actionTypes.VERSION_SUCCESS) {
		data = data.update('loadedVersions', loadedVersions => List(result));
		data = data.update('versionCount', versionCount => action.meta.count);
		data = data.update('versionCurrentPage', versionCurrentPage => action.meta.args.page);
	}
	else if (action.type === actionTypes.NOTICE_SUCCESS) {
		data = data.update('loadedNotices', loadedNotices => List(result));
		data = data.update('noticeCount', noticeCount => action.meta.count);
		data = data.update('noticeCurrentPage', noticeCurrentPage => action.meta.args.page);
	}
	else if (action.type === actionTypes.DOLL_SUCCESS) {
		data = data.update('loadedDolls', loadedDolls => List(result));
		data = data.update('dollCount', dollCount => action.meta.count);
		data = data.update('dollCurrentPage', dollCurrentPage => action.meta.args.page);
	}
	else if (action.type === actionTypes.DOLL_MACHINE_SUCCESS) {
		data = data.update('loadedDollMachines', loadedDollMachines => List(result));
		data = data.update('dollMachineCount', dollMachineCount => action.meta.count);
		data = data.update('dollMachineCurrentPage', dollMachineCurrentPage => action.meta.args.page);
	}
	else if (action.type === actionTypes.DOLL_MACHINE_PAW_SUCCESS) {
		data = data.update('loadedDollMachinePaws', loadedDollMachinePaws => List(result));
		data = data.update('dollMachinePawCount', dollMachinePawCount => action.meta.count);
		data = data.update('dollMachinePawCurrentPage', dollMachinePawCurrentPage => action.meta.args.page);
	}
	else if (action.type === actionTypes.ROOM_SUCCESS) {
		data = data.update('loadedRooms', loadedRooms => List(result));
		data = data.update('roomCount', roomCount => action.meta.count);
		data = data.update('roomCurrentPage', roomCurrentPage => action.meta.args.page);
	}
	else if (action.type === actionTypes.CATEGORY_SUCCESS) {
		data = data.update('loadedCategories', loadedCategories => List(result));
		data = data.update('categoryCount', categoryCount => action.meta.count);
		data = data.update('categoryCurrentPage', categoryCurrentPage => action.meta.args.page);
	}
	else if (action.type === actionTypes.TAG_SUCCESS) {
		data = data.update('loadedTags', loadedTags => List(result));
		data = data.update('tagCount', tagCount => action.meta.count);
		data = data.update('tagCurrentPage', tagCurrentPage => action.meta.args.page);
	}
	else if (action.type === actionTypes.RECHARGEMALL_SUCCESS) {
		data = data.update('loadedRechargeMalls', loadedRechargeMalls => List(result));
		data = data.update('rechargeMallCount', rechargeMallCount => action.meta.count);
		data = data.update('rechargeMallCurrentPage', rechargeMallCurrentPage => action.meta.args.page);
	}
	else if (action.type === actionTypes.POINTMALL_SUCCESS) {
		data = data.update('loadedPointMalls', loadedPointMalls => List(result));
		data = data.update('pointMallCount', pointMallCount => action.meta.count);
		data = data.update('pointMallCurrentPage', pointMallCurrentPage => action.meta.args.page);
	}
	else if (action.type === actionTypes.ANNOUNCEMENT_SUCCESS) {
		data = data.update('loadedAnnouncements', loadedAnnouncements => List(result));
		data = data.update('announcementCount', announcementCount => action.meta.count);
		data = data.update('announcementCurrentPage', announcementCurrentPage => action.meta.args.page);
	}
	else if (action.type === actionTypes.ORDER_SUCCESS) {
		data = data.update('loadedOrders', loadedOrders => List(result));
		data = data.update('orderCount', orderCount => action.meta.count);
		data = data.update('orderCurrentPage', orderCurrentPage => action.meta.args.page);
	}
	return data;
}

export default function dataReducer(data = Immutable.fromJS({}), action) {
	if (endsWith(action.type, '_SUCCESS')) {
		if (action.payload) {
			data = commonMerge(data, action);
		}
	}
	forEach(dataReducers, (subReducer, key) => {
		data = data.update(key, subData => subReducer(subData, action));
	});
	return data;
};