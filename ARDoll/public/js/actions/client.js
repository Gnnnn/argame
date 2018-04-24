'use strict';
/**
 * Created by Koan on 2017.9.25
 */
import Cookies from 'js-cookie';
import {SOURCER_DEF} from '../middlewares/sourcer';
import userStaticValidators from '../../../app/validators/user';
import * as apiActions from './api';
import {constants, userValidators} from '../utils';

// ================================ messages =================================
export const MESSAGE_RESET_ALL = 'MESSAGE_RESET_ALL';
export const MESSAGE_POP = 'MESSAGE_POP';
export const MESSAGE_NEW = 'MESSAGE_NEW';

export function resetAllMessage() {
	return {
		type: MESSAGE_RESET_ALL
	};
}

export function popMessage() {
	return {
		type: MESSAGE_POP
	};
}

export function newMessage(message) {
	if (typeof message == 'string') {
		message = {message};
	}
	return {
		type   : MESSAGE_NEW,
		payload: message
	};
}

// ================================ login  =================================
export function login(user, password) {
	return (dispatch, getState) => {
// 		用户名验证
		let error;
		error = userStaticValidators.validateName(user);
		if (error) {
			dispatch(newMessage({type: 'error', message: error}));
			return;
		}
// 		密码验证
		error = userValidators.validatePassword(password);
		if (error) {
			dispatch(newMessage({type: 'error', message: error}));
			return;
		}
		var loginInfo = {
			name    : user,
			password: password
		};
		apiActions.login(loginInfo)(dispatch, getState)
			.then(data => {

			})
			.catch(err => {
				let returnError = '';
				try {
					returnError = err.response.data.message;
				}
				catch (e) {
					returnError = '用户或密码错误，请重新输入';
				}
				dispatch(newMessage({type: 'error', message: returnError}));
			});
	};
}

// ================================ recoverLoginToken =================================
export function recoverLoginToken() {
	return (dispatch) => {
		var tokenId = Cookies.get(constants.USERTOKENID);
		if (tokenId != null && tokenId !== 'undefined') {
			dispatch(apiActions.recoverLogin(tokenId));
		}
		else {
			dispatch(setHasTriedLoginFlag(true));
		}
	};
}

export const SET_TRIED_LOGIN_FLAG = 'SET_TRIED_LOGIN_FLAG';

export function setHasTriedLoginFlag(flag) {
	return {
		type   : SET_TRIED_LOGIN_FLAG,
		payload: flag
	};
}

// ================================ logout =================================
export const LOGOUT = 'LOGOUT';

export function logout() {
	return dispatch => {
		dispatch({
			type: LOGOUT
		});
	};
}

export const CLOSE_PUSH_MODAL = 'CLOSE_PUSH_MODAL';

export function closePushModal() {
	return {
		type: CLOSE_PUSH_MODAL
	};
}

// ================================ push =================================
export function createPush(data) {
	return dispatch => {
		var action = apiActions.createPush(data);
		action[SOURCER_DEF].promise.then(res => {
			dispatch(newMessage('推送提交成功'));
			dispatch(apiActions.fetchPush(1));
		});
		dispatch(action);
	};
}

export const OPEN_PUSH = 'OPEN_PUSH';

export function openPush(pushId) {
	return {
		type   : OPEN_PUSH,
		payload: pushId
	};
}

// ================================ user =================================
export function createUser(name, password, confirmed, callback) {
	return (dispatch, getState) => {
		let error = userValidators.validateUser(name);
		if (error) {
			dispatch(newMessage({type: 'error', message: error}));
			return;
		}

		error = userValidators.validateConfirmedPassword(password, confirmed);
		if (error) {
			dispatch(newMessage({type: 'error', message: error}));
			return;
		}

		var action = apiActions.createUser({name, password});
		action[SOURCER_DEF].promise.then(res => {
			dispatch(newMessage('管理员添加成功'));
			callback();
		});
		dispatch(action);
	};
}

export function updateUser(oldPassword, password, confirmed, callback) {
	return dispatch => {
		if (!oldPassword) {
			dispatch(newMessage({type: 'error', message: '请输入当前密码!'}));
			return;
		}

		let error = userValidators.validatePassword(password);
		if (error) {
			dispatch(newMessage({type: 'error', message: error}));
			return;
		}

		error = userValidators.validateConfirmedPassword(confirmed, password);
		if (error) {
			dispatch(newMessage({type: 'error', message: error}));
			return;
		}

		var action = apiActions.updateUser({oldPassword, password});
		action[SOURCER_DEF].promise.then(res => {
			dispatch(newMessage('密码修改成功，请重新登录'));
			dispatch({type: LOGOUT});
			callback();
		});
		dispatch(action);
	};
}

export const USER_UPDATA_TABLIST = 'USER_UPDATA_TABLIST';

export function userUpdateTablist(isActive) {
	return {
		type   : USER_UPDATA_TABLIST,
		payload: isActive
	};
}

export const ADD_USER_TABLIST = 'ADD_USER_TABLIST';

export function addUserTablist(isActive) {
	return {
		type   : ADD_USER_TABLIST,
		payload: isActive
	};
}

// ================================ advice =================================
export const OPEN_ADVICE = 'OPEN_ADVICE';

export function openAdvice(adviceId) {
	return {
		type   : OPEN_ADVICE,
		payload: adviceId
	};
}

export const CLOSE_ADVICE_MODAL = 'CLOSE_ADVICE_MODAL';

export function closeAdviceModal() {
	return {
		type: CLOSE_ADVICE_MODAL
	};
}

export const EXCEL_EXPORT = 'EXCEL_EXPORT';

export function exportExcel(url) {
	return {
		type   : EXCEL_EXPORT,
		payload: url
	};
}

// ================================ notice =================================
export const OPEN_NOTICE_MODAL = 'OPEN_NOTICE_MODAL';

export function openNotice(noticeId) {
	return {
		type   : OPEN_NOTICE_MODAL,
		payload: noticeId
	};
}

export function createNotice(data) {
	return (dispatch, getState) => {
		var action = apiActions.createNotice(data);
		action[SOURCER_DEF].promise.then(res => {
			dispatch(newMessage('公告发布成功'));
			dispatch(apiActions.fetchNotices(1));
		});
		dispatch(action);
	};
}

export function delNotice(noticeId, page) {
	return (dispatch, getState) => {
		var action = apiActions.delNotice(noticeId);
		action[SOURCER_DEF].promise.then(res => {
			dispatch(newMessage('删除成功'));
			dispatch(apiActions.fetchNotices(page));
		});
		dispatch(action);
	};
}

export const CLOSE_NOTICE_MODAL = 'CLOSE_NOTICE_MODAL';

export function closeNoticeModal() {
	return {
		type: CLOSE_NOTICE_MODAL
	};
}

// ================================ version =================================
export function createVersion(version, updateNews, callback) {
	return dispatch => {
		var action = apiActions.createVersion({version, updateNews});
		action[SOURCER_DEF].promise.then(res => {
			dispatch(newMessage('版本更新成功'));
			dispatch(apiActions.fetchVersions(1));
			callback();
		});
		dispatch(action);
	};
}


export const OPEN_VERSION_MODAL = 'OPEN_VERSION_MODAL';
export const CLOSE_VERSION_MODAL = 'CLOSE_VERSION_MODAL';

export function openVersionModal(id) {
	return {
		type   : OPEN_VERSION_MODAL,
		payload: id
	};
}

export function closeVersionModal() {
	return {
		type: CLOSE_VERSION_MODAL
	};
}

// ================================ doll =================================
export const OPEN_DOLL_MODAL = 'OPEN_DOLL_MODAL';

export function openDoll(dollId) {
	return {
		type   : OPEN_DOLL_MODAL,
		payload: dollId
	};
}

export function createDoll(data) {
	return (dispatch, getState) => {
		var action = apiActions.createDoll(data);
		action[SOURCER_DEF].promise.then(res => {
			dispatch(newMessage('新建娃娃成功'));
			dispatch(apiActions.fetchDolls(1));
		});
		dispatch(action);
	};
}

export const CLOSE_DOLL_MODAL = 'CLOSE_DOLL_MODAL';

export function closeDollModal() {
	return {
		type: CLOSE_DOLL_MODAL
	};
}

// ================================ dollMachine =================================
export const OPEN_DOLL_MACHINE_MODAL = 'OPEN_DOLL_MACHINE_MODAL';

export function openDollMachine(dollMachineId) {
	return {
		type   : OPEN_DOLL_MACHINE_MODAL,
		payload: dollMachineId
	};
}

export function createDollMachine(data) {
	return (dispatch, getState) => {
		var action = apiActions.createDollMachine(data);
		action[SOURCER_DEF].promise.then(res => {
			dispatch(newMessage('新建娃娃机成功'));
			dispatch(apiActions.fetchDollMachines(1));
		});
		dispatch(action);
	};
}

export const CLOSE_DOLL_MACHINE_MODAL = 'CLOSE_DOLL_MACHINE_MODAL';

export function closeDollMachineModal() {
	return {
		type: CLOSE_DOLL_MACHINE_MODAL
	};
}

// ================================ dollMachinePaw =================================
export const OPEN_DOLL_MACHINE_PAW_MODAL = 'OPEN_DOLL_MACHINE_PAW_MODAL';

export function openDollMachinePaw(dollMachinePawId) {
	return {
		type   : OPEN_DOLL_MACHINE_PAW_MODAL,
		payload: dollMachinePawId
	};
}

export function createDollMachinePaw(data) {
	return (dispatch, getState) => {
		var action = apiActions.createDollMachinePaw(data);
		action[SOURCER_DEF].promise.then(res => {
			dispatch(newMessage('新建娃娃机爪子成功'));
			dispatch(apiActions.fetchDollMachinePaws(1));
		});
		dispatch(action);
	};
}

export const CLOSE_DOLL_MACHINE_PAW_MODAL = 'CLOSE_DOLL_MACHINE_PAW_MODAL';

export function closeDollMachinePawModal() {
	return {
		type: CLOSE_DOLL_MACHINE_PAW_MODAL
	};
}

// ================================ room =================================
export const OPEN_ROOM_MODAL = 'OPEN_ROOM_MODAL';

export function openRoom(roomId) {
	return {
		type   : OPEN_ROOM_MODAL,
		payload: roomId
	};
}

export function createRoom(data) {
	return (dispatch, getState) => {
		var action = apiActions.createRoom(data);
		action[SOURCER_DEF].promise.then(res => {
			dispatch(newMessage('新建房间成功'));
			dispatch(apiActions.fetchRooms(1));
		});
		dispatch(action);
	};
}

export const CLOSE_ROOM_MODAL = 'CLOSE_ROOM_MODAL';

export function closeRoomModal() {
	return {
		type: CLOSE_ROOM_MODAL
	};
}

// ================================ category =================================
export const OPEN_CATEGORY_MODAL = 'OPEN_CATEGORY_MODAL';

export function openCategory(categoryId) {
	return {
		type   : OPEN_CATEGORY_MODAL,
		payload: categoryId
	};
}

export function createCategory(data) {
	return (dispatch, getState) => {
		var action = apiActions.createCategory(data);
		action[SOURCER_DEF].promise.then(res => {
			dispatch(newMessage('新建分类成功'));
			dispatch(apiActions.fetchCategories(1));
		});
		dispatch(action);
	};
}

export const CLOSE_CATEGORY_MODAL = 'CLOSE_CATEGORY_MODAL';

export function closeCategoryModal() {
	return {
		type: CLOSE_CATEGORY_MODAL
	};
}

// ================================ tag =================================
export const OPEN_TAG_MODAL = 'OPEN_TAG_MODAL';

export function openTag(tagId) {
	return {
		type   : OPEN_TAG_MODAL,
		payload: tagId
	};
}

export function createTag(data) {
	return (dispatch, getState) => {
		var action = apiActions.createTag(data);
		action[SOURCER_DEF].promise.then(res => {
			dispatch(newMessage('新建标签成功'));
			dispatch(apiActions.fetchTags(1));
		});
		dispatch(action);
	};
}

export const CLOSE_TAG_MODAL = 'CLOSE_TAG_MODAL';

export function closeTagModal() {
	return {
		type: CLOSE_TAG_MODAL
	};
}

// ================================ dollSelect =================================
export const OPEN_DOLL_SELECT_MODAL = 'OPEN_DOLL_SELECT_MODAL';

export function openDollSelectModal() {
	return {
		type: OPEN_DOLL_SELECT_MODAL
	};
}

export const CLOSE_DOLL_SELECT_MODAL = 'CLOSE_DOLL_SELECT_MODAL';

export function closeDollSelectModal() {
	return {
		type: CLOSE_DOLL_SELECT_MODAL
	};
}

// ================================ dollMachineSelect =================================
export const OPEN_DOLL_MACHINE_SELECT_MODAL = 'OPEN_DOLL_MACHINE_SELECT_MODAL';

export function openDollMachineSelectModal() {
	return {
		type: OPEN_DOLL_MACHINE_SELECT_MODAL
	};
}

export const CLOSE_DOLL_MACHINE_SELECT_MODAL = 'CLOSE_DOLL_MACHINE_SELECT_MODAL';

export function closeDollMachineSelectModal() {
	return {
		type: CLOSE_DOLL_MACHINE_SELECT_MODAL
	};
}

// ================================ dollMachinePawSelect =================================
export const OPEN_DOLL_MACHINE_PAW_SELECT_MODAL = 'OPEN_DOLL_MACHINE_PAW_SELECT_MODAL';

export function openDollMachinePawSelectModal() {
	return {
		type: OPEN_DOLL_MACHINE_PAW_SELECT_MODAL
	};
}

export const CLOSE_DOLL_MACHINE_PAW_SELECT_MODAL = 'CLOSE_DOLL_MACHINE_PAW_SELECT_MODAL';

export function closeDollMachinePawSelectModal() {
	return {
		type: CLOSE_DOLL_MACHINE_PAW_SELECT_MODAL
	};
}

// ================================ categorySelect =================================
export const OPEN_CATEGORY_SELECT_MODAL = 'OPEN_CATEGORY_SELECT_MODAL';

export function openCategorySelectModal() {
	return {
		type: OPEN_CATEGORY_SELECT_MODAL
	};
}

export const CLOSE_CATEGORY_SELECT_MODAL = 'CLOSE_CATEGORY_SELECT_MODAL';

export function closeCategorySelectModal() {
	return {
		type: CLOSE_CATEGORY_SELECT_MODAL
	};
}

// ================================ tagSelect =================================
export const OPEN_TAG_SELECT_MODAL = 'OPEN_TAG_SELECT_MODAL';

export function openTagSelectModal() {
	return {
		type: OPEN_TAG_SELECT_MODAL
	};
}

export const CLOSE_TAG_SELECT_MODAL = 'CLOSE_TAG_SELECT_MODAL';

export function closeTagSelectModal() {
	return {
		type: CLOSE_TAG_SELECT_MODAL
	};
}

// ================================ rechargeMall =================================
export const OPEN_RECHARGEMALL_MODAL = 'OPEN_RECHARGEMALL_MODAL';

export function openRechargeMall(rechargeMallId) {
	return {
		type   : OPEN_RECHARGEMALL_MODAL,
		payload: rechargeMallId
	};
}

export function createRechargeMall(data) {
	return (dispatch, getState) => {
		var action = apiActions.createRechargeMall(data);
		action[SOURCER_DEF].promise.then(res => {
			dispatch(newMessage('新建充值商城商品成功'));
			dispatch(apiActions.fetchRechargeMalls(1));
		});
		dispatch(action);
	};
}

export const CLOSE_RECHARGEMALL_MODAL = 'CLOSE_RECHARGEMALL_MODAL';

export function closeRechargeMallModal() {
	return {
		type: CLOSE_RECHARGEMALL_MODAL
	};
}

// ================================ pointMall =================================
export const OPEN_POINTMALL_MODAL = 'OPEN_POINTMALL_MODAL';

export function openPointMall(pointMallId) {
	return {
		type   : OPEN_POINTMALL_MODAL,
		payload: pointMallId
	};
}

export function createPointMall(data) {
	return (dispatch, getState) => {
		var action = apiActions.createPointMall(data);
		action[SOURCER_DEF].promise.then(res => {
			dispatch(newMessage('新建积分商城商品成功'));
			dispatch(apiActions.fetchPointMalls(1));
		});
		dispatch(action);
	};
}

export const CLOSE_POINTMALL_MODAL = 'CLOSE_POINTMALL_MODAL';

export function closePointMallModal() {
	return {
		type: CLOSE_POINTMALL_MODAL
	};
}

// ================================ announcement =================================
export const OPEN_ANNOUNCEMENT_MODAL = 'OPEN_ANNOUNCEMENT_MODAL';

export function openAnnouncement(announcementId) {
	return {
		type   : OPEN_ANNOUNCEMENT_MODAL,
		payload: announcementId
	};
}

export function createAnnouncement(data) {
	return (dispatch, getState) => {
		var action = apiActions.createAnnouncement(data);
		action[SOURCER_DEF].promise.then(res => {
			dispatch(newMessage('公告发布成功'));
			dispatch(apiActions.fetchAnnouncements(1));
		});
		dispatch(action);
	};
}

export function delAnnouncement(announcementId, page) {
	return (dispatch, getState) => {
		var action = apiActions.delAnnouncement(announcementId);
		action[SOURCER_DEF].promise.then(res => {
			dispatch(newMessage('删除成功'));
			dispatch(apiActions.fetchAnnouncements(page));
		});
		dispatch(action);
	};
}

export const CLOSE_ANNOUNCEMENT_MODAL = 'CLOSE_ANNOUNCEMENT_MODAL';

export function closeAnnouncementModal() {
	return {
		type: CLOSE_ANNOUNCEMENT_MODAL
	};
}

// ================================ order =================================
export const OPEN_ORDER = 'OPEN_ORDER';

export function openOrder(orderId) {
	return {
		type   : OPEN_ORDER,
		payload: orderId
	};
}

export const CLOSE_ORDER_MODAL = 'CLOSE_ORDER_MODAL';

export function closeOrderModal() {
	return {
		type: CLOSE_ORDER_MODAL
	};
}



// ================================ visitor =================================
// export function createVersion(version, updateNews, callback) {
//     return dispatch => {
//         var action = apiActions.createVersion({version, updateNews});
//         action[SOURCER_DEF].promise.then(res => {
//             dispatch(newMessage('版本更新成功'));
//             dispatch(apiActions.fetchVersions(1));
//             callback();
//         });
//         dispatch(action);
//     };
// }


export const OPEN_VISITOR_MODAL = 'OPEN_VISITOR_MODAL';
export const CLOSE_VISITOR_MODAL = 'CLOSE_VISITOR_MODAL';

export function openVisitorModal(id) {
    return {
        type   : OPEN_VISITOR_MODAL,
        payload: id
    };
}

export function closeVisitorModal() {
    return {
        type: CLOSE_VISITOR_MODAL
    };
}