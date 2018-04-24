'use strict';
/**
 * Created by Koan on 2017.9.25
 */
import {combineReducers} from 'redux-immutable';
import Immutable, {Map, List} from 'immutable';
import assign from 'lodash/assign';
import startsWith from 'underscore.string/startsWith';
import endsWith from 'underscore.string/endsWith';
import Cookies from 'js-cookie';
import * as clientActionTypes from '../actions/client';
import * as apiActionTypes from '../actions/api';
import {constants, tsResourzes, webHelper} from '../utils';

let appReducers = {};

appReducers.messages = (messages = List(), action) => {
	// api error
	if (endsWith(action.type, '_FAILED')) {
		if (!action.error) {
			return messages;
		}
		const {code, message} = action.error;
		if (messages.size === 0 || messages.get(messages.size - 1).get('message') !== message) {
			messages = messages.push(Map({message, code, type: 'error', id: webHelper.randomString(12)}));
		}
	}
	else {
		switch (action.type) {
			case clientActionTypes.MESSAGE_RESET_ALL:
				messages = List();
				break;
			case clientActionTypes.MESSAGE_POP:
				messages = messages.shift();
				break;
			case clientActionTypes.MESSAGE_NEW:
				if (messages.size === 0 || messages.get(messages.size - 1).get('message') !== action.payload.message) {
					messages = messages.push(Map(assign({
						type: 'info',
						id  : webHelper.randomString(12)
					}, action.payload)));
				}
				break;
		}
	}
	return messages;
};

appReducers.appInfo = (appInfo = Immutable.fromJS({onSending: false, modals: Map()}), action) => {
	switch (action.type) {
		case apiActionTypes.TOKEN_REQUEST:
		case apiActionTypes.USER_REQUEST:
		case apiActionTypes.VERSION_REQUEST:
		case apiActionTypes.PUSH_REQUEST:
			appInfo = appInfo.set('onSending', true);
			break;
		case apiActionTypes.TOKEN_SUCCESS:
		case apiActionTypes.TOKEN_FAILED:
		case apiActionTypes.USER_SUCCESS:
		case apiActionTypes.USER_FAILED:
		case apiActionTypes.PUSH_SUCCESS:
		case apiActionTypes.PUSH_FAILED:
		case apiActionTypes.VERSION_SUCCESS:
		case apiActionTypes.VERSION_FAILED:
			appInfo = appInfo.set('onSending', false);
			break;
		case clientActionTypes.OPEN_PUSH:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_PUSH], isActive => true);
			appInfo = appInfo.set('openPushId', action.payload);
			break;
		case clientActionTypes.CLOSE_PUSH_MODAL:
		case apiActionTypes.CREATE_PUSH_SUCCESS:
		case apiActionTypes.UPDATE_PUSH_SUCCESS:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_PUSH], isActive => false);
			appInfo = appInfo.set('openPushId', '');
			break;
		case clientActionTypes.OPEN_ADVICE:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_ADVICE], isActive => true);
			appInfo = appInfo.set('openAdviceId', action.payload);
			break;
		case clientActionTypes.CLOSE_ADVICE_MODAL:
		case apiActionTypes.UPDATE_ADVICE_SUCCESS:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_ADVICE], isActive => false);
			appInfo = appInfo.set('openAdviceId', '');
			break;
		case clientActionTypes.OPEN_NOTICE_MODAL:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_NOTICE], isActive => true);
			appInfo = appInfo.set('openNoticeId', action.payload);
			break;
		case clientActionTypes.CLOSE_NOTICE_MODAL:
		case apiActionTypes.CREATE_NOTICE_SUCCESS:
		case apiActionTypes.UPDATE_NOTICE_SUCCESS:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_NOTICE], isActive => false);
			appInfo = appInfo.set('openNoticeId', '');
			break;
		case clientActionTypes.OPEN_VERSION_MODAL:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_VERSION], isActive => true);
			appInfo = appInfo.set('openVersionId', action.payload);
			break;
		case clientActionTypes.CLOSE_VERSION_MODAL:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_VERSION], isActive => false);
			appInfo = appInfo.set('openVersionId', '');
			break;
		case clientActionTypes.OPEN_DOLL_MODAL:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_DOLL], isActive => true);
			appInfo = appInfo.set('openDollId', action.payload);
			break;
		case clientActionTypes.CLOSE_DOLL_MODAL:
		case apiActionTypes.CREATE_DOLL_SUCCESS:
		case apiActionTypes.UPDATE_DOLL_SUCCESS:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_DOLL], isActive => false);
			appInfo = appInfo.set('openDollId', '');
			break;
		case clientActionTypes.OPEN_DOLL_MACHINE_MODAL:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_DOLL_MACHINE], isActive => true);
			appInfo = appInfo.set('openDollMachineId', action.payload);
			break;
		case clientActionTypes.CLOSE_DOLL_MACHINE_MODAL:
		case apiActionTypes.CREATE_DOLL_MACHINE_SUCCESS:
		case apiActionTypes.UPDATE_DOLL_MACHINE_SUCCESS:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_DOLL_MACHINE], isActive => false);
			appInfo = appInfo.set('openDollMachineId', '');
			break;
		case clientActionTypes.OPEN_DOLL_MACHINE_PAW_MODAL:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_DOLL_MACHINE_PAW], isActive => true);
			appInfo = appInfo.set('openDollMachinePawId', action.payload);
			break;
		case clientActionTypes.CLOSE_DOLL_MACHINE_PAW_MODAL:
		case apiActionTypes.CREATE_DOLL_MACHINE_PAW_SUCCESS:
		case apiActionTypes.UPDATE_DOLL_MACHINE_PAW_SUCCESS:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_DOLL_MACHINE_PAW], isActive => false);
			appInfo = appInfo.set('openDollMachinePawId', '');
			break;
		case clientActionTypes.OPEN_ROOM_MODAL:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_ROOM], isActive => true);
			appInfo = appInfo.set('openRoomId', action.payload);
			break;
		case clientActionTypes.CLOSE_ROOM_MODAL:
		case apiActionTypes.CREATE_ROOM_SUCCESS:
		case apiActionTypes.UPDATE_ROOM_SUCCESS:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_ROOM], isActive => false);
			appInfo = appInfo.set('openRoomId', '');
			break;
		case clientActionTypes.OPEN_CATEGORY_MODAL:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_CATEGORY], isActive => true);
			appInfo = appInfo.set('openCategoryId', action.payload);
			break;
		case clientActionTypes.CLOSE_CATEGORY_MODAL:
		case apiActionTypes.CREATE_CATEGORY_SUCCESS:
		case apiActionTypes.UPDATE_CATEGORY_SUCCESS:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_CATEGORY], isActive => false);
			appInfo = appInfo.set('openCategoryId', '');
			break;
		case clientActionTypes.OPEN_TAG_MODAL:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_TAG], isActive => true);
			appInfo = appInfo.set('openTagId', action.payload);
			break;
		case clientActionTypes.CLOSE_TAG_MODAL:
		case apiActionTypes.CREATE_TAG_SUCCESS:
		case apiActionTypes.UPDATE_TAG_SUCCESS:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_TAG], isActive => false);
			appInfo = appInfo.set('openTagId', '');
			break;
		case clientActionTypes.OPEN_RECHARGEMALL_MODAL:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_RECHARGEMALL], isActive => true);
			appInfo = appInfo.set('openRechargeMallId', action.payload);
			break;
		case clientActionTypes.CLOSE_RECHARGEMALL_MODAL:
		case apiActionTypes.CREATE_RECHARGEMALL_SUCCESS:
		case apiActionTypes.UPDATE_RECHARGEMALL_SUCCESS:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_RECHARGEMALL], isActive => false);
			appInfo = appInfo.set('openRechargeMallId', '');
			break;
		case clientActionTypes.OPEN_POINTMALL_MODAL:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_POINTMALL], isActive => true);
			appInfo = appInfo.set('openPointMallId', action.payload);
			break;
		case clientActionTypes.CLOSE_POINTMALL_MODAL:
		case apiActionTypes.CREATE_POINTMALL_SUCCESS:
		case apiActionTypes.UPDATE_POINTMALL_SUCCESS:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_POINTMALL], isActive => false);
			appInfo = appInfo.set('openPointMallId', '');
			break;
		case clientActionTypes.OPEN_ANNOUNCEMENT_MODAL:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_ANNOUNCEMENT], isActive => true);
			appInfo = appInfo.set('openAnnouncementId', action.payload);
			break;
		case clientActionTypes.CLOSE_ANNOUNCEMENT_MODAL:
		case apiActionTypes.CREATE_ANNOUNCEMENT_SUCCESS:
		case apiActionTypes.UPDATE_ANNOUNCEMENT_SUCCESS:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_ANNOUNCEMENT], isActive => false);
			appInfo = appInfo.set('openAnnouncementId', '');
			break;
		case clientActionTypes.OPEN_ORDER:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_ORDER], isActive => true);
			appInfo = appInfo.set('openOrderId', action.payload);
			break;
		case clientActionTypes.CLOSE_ORDER_MODAL:
		case apiActionTypes.UPDATE_ORDER_SUCCESS:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_ORDER], isActive => false);
			appInfo = appInfo.set('openOrderId', '');
			break;
		case clientActionTypes.OPEN_DOLL_SELECT_MODAL:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_SELECT_DOLL], isActive => true);
			break;
		case clientActionTypes.CLOSE_DOLL_SELECT_MODAL:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_SELECT_DOLL], isActive => false);
			break;
		case clientActionTypes.OPEN_DOLL_MACHINE_SELECT_MODAL:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_SELECT_DOLL_MACHINE], isActive => true);
			break;
		case clientActionTypes.CLOSE_DOLL_MACHINE_SELECT_MODAL:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_SELECT_DOLL_MACHINE], isActive => false);
			break;
		case clientActionTypes.OPEN_DOLL_MACHINE_PAW_SELECT_MODAL:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_SELECT_DOLL_MACHINE_PAW], isActive => true);
			break;
		case clientActionTypes.CLOSE_DOLL_MACHINE_PAW_SELECT_MODAL:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_SELECT_DOLL_MACHINE_PAW], isActive => false);
			break;
		case clientActionTypes.OPEN_CATEGORY_SELECT_MODAL:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_SELECT_CATEGORY], isActive => true);
			break;
		case clientActionTypes.CLOSE_CATEGORY_SELECT_MODAL:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_SELECT_CATEGORY], isActive => false);
			break;
		case clientActionTypes.OPEN_TAG_SELECT_MODAL:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_SELECT_TAG], isActive => true);
			break;
		case clientActionTypes.CLOSE_TAG_SELECT_MODAL:
			appInfo = appInfo.updateIn(['modals', constants.MODAL_SELECT_TAG], isActive => false);
			break;
		case clientActionTypes.EXCEL_EXPORT:
			appInfo = appInfo.set('exportUrl', action.payload);
			break;
	}
	return appInfo;
};

appReducers.loginData = (loginData = Immutable.fromJS({hasTriedLogin: false}), action) => {
	const cookieOption = (constants.COOKIE_DOMAIN === 'localhost' ? {} : {domain: constants.COOKIE_DOMAIN});
	switch (action.type) {
		case clientActionTypes.LOGOUT:
		case apiActionTypes.TOKEN_FAILED:
		case apiActionTypes.USER_FAILED:
			tsResourzes.headers(constants.TOKEN_KEY, undefined);
			Cookies.remove(constants.USERTOKENID, cookieOption);
			loginData = Immutable.fromJS({hasTriedLogin: true});
			break;
		case apiActionTypes.TOKEN_SUCCESS:
			tsResourzes.headers(constants.TOKEN_KEY, action.payload);
			Cookies.set(constants.USERTOKENID, action.payload, cookieOption);
			break;
		case apiActionTypes.USER_SUCCESS:
			loginData = loginData.set('loginUserId', action.payload.result);
			loginData = loginData.set('hasTriedLogin', true);
			break;
		case clientActionTypes.SET_TRIED_LOGIN_FLAG:
			loginData = loginData.set('hasTriedLogin', action.payload);
			break;
	}
	return loginData;
};

appReducers.actives = (actives = Immutable.fromJS({
	daily       : List(),
	monthly     : List(),
	retention   : List(),
	totalVisitor: 1
}), action) => {
	switch (action.type) {
		case apiActionTypes.DAILY_ACTIVE_SUCCESS:
			actives = actives.set('daily', action.payload);
			break;
		case apiActionTypes.MONTHLY_ACTIVE_SUCCESS:
			actives = actives.set('monthly', action.payload);
			break;
		case apiActionTypes.RETENTION_SUCCESS:
			actives = actives.set('retention', action.payload);
			actives = actives.set('totalVisitor', action.meta.count);
	}
	return actives;
};

appReducers.accordion = (data = Map(), action) => {
	switch (action.type) {
		case clientActionTypes.USER_UPDATA_TABLIST:
			data = data.set('userUpdate', !action.payload);
			break;
		case clientActionTypes.ADD_USER_TABLIST:
			data = data.set('addUser', !action.payload);
			break;
		case apiActionTypes.USER_CHANGE_SUCCESS:
			data = data.set('userUpdate', false);
			break;
	}
	return data;
};

export default combineReducers(appReducers);