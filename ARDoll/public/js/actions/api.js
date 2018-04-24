'use strict';
/**
 * Created by Koan on 2017.9.25
 */
import {SOURCER_DEF} from '../middlewares/sourcer';
import {arrayOf} from 'normalizr';
import tsResourzes, {schemas} from '../utils/tsResourzes';
import assign from 'lodash/assign';
import {appConfigs} from '../utils';

// ================================ user =================================
export const USER_REQUEST = 'USER_REQUEST';
export const USER_SUCCESS = 'USER_SUCCESS';
export const USER_FAILED = 'USER_FAILED';

export function fetchLoginUser() {
	var promise;
	promise = tsResourzes.User.me();
	return {
		[SOURCER_DEF]: {
			types: [USER_REQUEST, USER_SUCCESS, USER_FAILED],
			promise,
			meta : {
				schema: schemas.user
			}
		}
	};
}

export const USER_CHANGE_REQUEST = 'USER_CHANGE_REQUEST';
export const USER_CHANGE_SUCCESS = 'USER_CHANGE_SUCCESS';
export const USER_CHANGE_FAILED = 'USER_CHANGE_FAILED';

export function updateUser(userInfo) {
	var promise;
	if (userInfo) {
		promise = tsResourzes.User.updateMe(userInfo);
	}
	return {
		[SOURCER_DEF]: {
			types: [USER_CHANGE_REQUEST, USER_CHANGE_SUCCESS, USER_CHANGE_FAILED],
			promise,
			meta : {
				schema: schemas.user
			}
		}
	};
}

export const CREATE_USER_REQUEST = 'CREATE_USER_REQUEST';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_FAILED = 'CREATE_USER_FAILED';

export function createUser(user) {
	var promise;
	if (user) {
		promise = tsResourzes.User.create(user);
	}
	return {
		[SOURCER_DEF]: {
			types: [CREATE_USER_REQUEST, CREATE_USER_SUCCESS, CREATE_USER_FAILED],
			promise,
			meta : {
				schema: schemas.user
			}
		}
	};
}

// ================================ login =================================
export const TOKEN_REQUEST = 'TOKEN_REQUEST';
export const TOKEN_SUCCESS = 'TOKEN_SUCCESS';
export const TOKEN_FAILED = 'TOKEN_FAILED';

function createToken(userInfo) {
	var promise;
	var loginInfo = assign({}, userInfo);
	promise = tsResourzes.Token.create({type: 'user'}, loginInfo);
	return {
		[SOURCER_DEF]: {
			types: [TOKEN_REQUEST, TOKEN_SUCCESS, TOKEN_FAILED],
			promise
		}
	};
}

export function login(userInfo) {
	return (dispatch) => {
		var action = createToken(userInfo);
		dispatch(action);
		return action[SOURCER_DEF].promise
			.then((data) => {
				dispatch(fetchLoginUser());
				return data;
			});
	};
}

export function recoverLogin(token) {
	return (dispatch) => {
		dispatch(recoverToken(token));
		dispatch(fetchLoginUser());
	};
}

function recoverToken(token) {
	return {
		type   : TOKEN_SUCCESS,
		payload: token
	};
}

// ================================ push =================================
export const PUSH_REQUEST = 'PUSH_REQUEST';
export const PUSH_SUCCESS = 'PUSH_SUCCESS';
export const PUSH_FAILED = 'PUSH_FAILED';

export function fetchPush(page) {
	var promise,
		params = {};
	if (page) {
		params.limit = appConfigs.pushCountPrePage || 20;
		params.since = page ? (page - 1) * params.limit : 0;
	}
	promise = tsResourzes.Push.query(params);
	return {
		[SOURCER_DEF]: {
			types: [PUSH_REQUEST, PUSH_SUCCESS, PUSH_FAILED],
			promise,
			meta : {
				args  : {page},
				schema: arrayOf(schemas.push)
			}
		}
	};
}

export function loadPush(page) {
	return (dispatch, getState) => {
		dispatch(fetchPush(page));
	};
}

export const CREATE_PUSH_REQUEST = 'CREATE_PUSH_REQUEST';
export const CREATE_PUSH_SUCCESS = 'CREATE_PUSH_SUCCESS';
export const CREATE_PUSH_FAILED = 'CREATE_PUSH_FAILED';

export function createPush(newPush) {
	var promise;
	promise = tsResourzes.Push.create(null, newPush);
	return {
		[SOURCER_DEF]: {
			types: [CREATE_PUSH_REQUEST, CREATE_PUSH_SUCCESS, CREATE_PUSH_FAILED],
			promise,
			meta : {
				schema: schemas.push
			}
		}
	};
}

export const UPDATE_PUSH_REQUEST = 'UPDATE_PUSH_REQUEST';
export const UPDATE_PUSH_SUCCESS = 'UPDATE_PUSH_SUCCESS';
export const UPDATE_PUSH_FAILED = 'UPDATE_PUSH_FAILED';

export function fetchUpdatePush(id, data) {
	var promise;
	promise = tsResourzes.Push.update({id}, data);
	return {
		[SOURCER_DEF]: {
			types: [UPDATE_PUSH_REQUEST, UPDATE_PUSH_SUCCESS, UPDATE_PUSH_FAILED],
			promise,
			meta : {
				args  : {id},
				schema: schemas.push
			}
		}
	};
}

export function updatePush(id, data) {
	return (dispatch, getState) => {
		dispatch(fetchUpdatePush(id, data));
	};
}

// ================================ advice =================================
export const ADVICE_REQUEST = 'ADVICE_REQUEST';
export const ADVICE_SUCCESS = 'ADVICE_SUCCESS';
export const ADVICE_FAILED = 'ADVICE_FAILED';

function fetchAdvice(page) {
	var promise,
		params = {};
	if (page) {
		params.limit = appConfigs.adviceCountPrePage || 20;
		params.since = page ? (page - 1) * params.limit : 0;
	}
	promise = tsResourzes.Advice.query(params);
	return {
		[SOURCER_DEF]: {
			types: [ADVICE_REQUEST, ADVICE_SUCCESS, ADVICE_FAILED],
			promise,
			meta : {
				args  : {page},
				schema: arrayOf(schemas.advice)
			}
		}
	};
}

export function loadAdvice(page) {
	return (dispatch, getState) => {
		dispatch(fetchAdvice(page));
	};
}

export const UPDATE_ADVICE_REQUEST = 'UPDATE_ADVICE_REQUEST';
export const UPDATE_ADVICE_SUCCESS = 'UPDATE_ADVICE_SUCCESS';
export const UPDATE_ADVICE_FAILED = 'UPDATE_ADVICE_FAILED';

export function fetchUpdateAdvice(id, data) {
	var promise;
	promise = tsResourzes.Advice.update({id}, data);
	return {
		[SOURCER_DEF]: {
			types: [UPDATE_ADVICE_REQUEST, UPDATE_ADVICE_SUCCESS, UPDATE_ADVICE_FAILED],
			promise,
			meta : {
				args  : {id},
				schema: schemas.advice
			}
		}
	};
}

export function updateAdvice(id, data) {
	return (dispatch, getState) => {
		dispatch(fetchUpdateAdvice(id, data));
	};
}

// ================================ active =================================
export function fetchActive(type, types) {
	var promise;
	promise = tsResourzes.Active.query({type});
	return {
		[SOURCER_DEF]: {
			types: types,
			promise
		}
	};
}

export const DAILY_ACTIVE_REQUEST = 'DAILY_ACTIVE_REQUEST';
export const DAILY_ACTIVE_SUCCESS = 'DAILY_ACTIVE_SUCCESS';
export const DAILY_ACTIVE_FAILED = 'DAILY_ACTIVE_FAILED';

export function loadDailyActive() {
	return (dispatch, getState) => {
		dispatch(fetchActive('daily', [DAILY_ACTIVE_REQUEST, DAILY_ACTIVE_SUCCESS, DAILY_ACTIVE_FAILED]));
	};
}

export const MONTHLY_ACTIVE_REQUEST = 'MONTHLY_ACTIVE_REQUEST';
export const MONTHLY_ACTIVE_SUCCESS = 'MONTHLY_ACTIVE_SUCCESS';
export const MONTHLY_ACTIVE_FAILED = 'MONTHLY_ACTIVE_FAILED';

export function loadMonthlyActive() {
	return (dispatch, getState) => {
		dispatch(fetchActive('monthly', [MONTHLY_ACTIVE_REQUEST, MONTHLY_ACTIVE_SUCCESS, MONTHLY_ACTIVE_FAILED]));
	};
}

export const RETENTION_REQUEST = 'RETENTION_REQUEST';
export const RETENTION_SUCCESS = 'RETENTION_SUCCESS';
export const RETENTION_FAILED = 'RETENTION_FAILED';

export function loadRetention() {
	return (dispatch, getState) => {
		dispatch(fetchActive('retention', [RETENTION_REQUEST, RETENTION_SUCCESS, RETENTION_FAILED]));
	};
}

// ================================ notice =================================
export const NOTICE_REQUEST = 'NOTICE_REQUEST';
export const NOTICE_SUCCESS = 'NOTICE_SUCCESS';
export const NOTICE_FAILED = 'NOTICE_FAILED';

export function fetchNotices(page) {
	var promise,
		params = {};
	if (page) {
		params.limit = appConfigs.noticeCountPrePage || 20;
		params.since = page ? (page - 1) * params.limit : 0;
	}
	promise = tsResourzes.Notice.query(params);
	return {
		[SOURCER_DEF]: {
			types: [NOTICE_REQUEST, NOTICE_SUCCESS, NOTICE_FAILED],
			promise,
			meta : {
				args  : {page},
				schema: arrayOf(schemas.notice)
			}
		}
	};
}

export function loadNotices(page) {
	return (dispatch, getState) => {
		dispatch(fetchNotices(page));
	};
}

export const CREATE_NOTICE_REQUEST = 'CREATE_NOTICE_REQUEST';
export const CREATE_NOTICE_SUCCESS = 'CREATE_NOTICE_SUCCESS';
export const CREATE_NOTICE_FAILED = 'CREATE_NOTICE_FAILED';

export function createNotice(data) {
	var promise;
	promise = tsResourzes.Notice.create(data);
	return {
		[SOURCER_DEF]: {
			types: [CREATE_NOTICE_REQUEST, CREATE_NOTICE_SUCCESS, CREATE_NOTICE_FAILED],
			promise,
			meta : {
				schema: schemas.notice
			}
		}
	};
}

export const UPDATE_NOTICE_REQUEST = 'UPDATE_NOTICE_REQUEST';
export const UPDATE_NOTICE_SUCCESS = 'UPDATE_NOTICE_SUCCESS';
export const UPDATE_NOTICE_FAILED = 'UPDATE_NOTICE_FAILED';

export function fetchUpdateNotice(id, data) {
	var promise;
	promise = tsResourzes.Notice.update({id}, data);
	return {
		[SOURCER_DEF]: {
			types: [UPDATE_NOTICE_REQUEST, UPDATE_NOTICE_SUCCESS, UPDATE_NOTICE_FAILED],
			promise,
			meta : {
				args  : {id},
				schema: schemas.notice
			}
		}
	};
}

export function updateNotice(id, data) {
	return (dispatch, getState) => {
		dispatch(fetchUpdateNotice(id, data));
	};
}

export const DELETE_NOTICE_REQUEST = 'DELETE_NOTICE_REQUEST';
export const DELETE_NOTICE_SUCCESS = 'DELETE_NOTICE_SUCCESS';
export const DELETE_NOTICE_FAILED = 'DELETE_NOTICE_FAILED';

export function delNotice(id) {
	var promise;
	promise = tsResourzes.Notice.delete({id});
	return {
		[SOURCER_DEF]: {
			types: [DELETE_NOTICE_REQUEST, DELETE_NOTICE_SUCCESS, DELETE_NOTICE_FAILED],
			promise
		}
	};
}

// ================================ version =================================
export const VERSION_REQUEST = 'VERSION_REQUEST';
export const VERSION_SUCCESS = 'VERSION_SUCCESS';
export const VERSION_FAILED = 'VERSION_FAILED';

export function fetchVersions(page) {
	var promise,
		params = {};
	if (page) {
		params.limit = appConfigs.versionCountPrePage || 20;
		params.since = page ? (page - 1) * params.limit : 0;
	}
	promise = tsResourzes.Version.query(params);
	return {
		[SOURCER_DEF]: {
			types: [VERSION_REQUEST, VERSION_SUCCESS, VERSION_FAILED],
			promise,
			meta : {
				args  : {page},
				schema: arrayOf(schemas.version)
			}
		}
	};
}

export function loadVersions(page) {
	return (dispatch, getState) => {
		dispatch(fetchVersions(page));
	};
}

export const CREATE_VERSION_REQUEST = 'CREATE_VERSION_REQUEST';
export const CREATE_VERSION_SUCCESS = 'CREATE_VERSION_SUCCESS';
export const CREATE_VERSION_FAILED = 'CREATE_VERSION_FAILED';

export function createVersion(newVersion) {
	var promise;
	promise = tsResourzes.Version.create(null, newVersion);
	return {
		[SOURCER_DEF]: {
			types: [CREATE_VERSION_REQUEST, CREATE_VERSION_SUCCESS, CREATE_VERSION_FAILED],
			promise,
			meta : {
				schema: schemas.version
			}
		}
	};
}

// ================================ doll =================================
export const DOLL_REQUEST = 'DOLL_REQUEST';
export const DOLL_SUCCESS = 'DOLL_SUCCESS';
export const DOLL_FAILED = 'DOLL_FAILED';

export function fetchDolls(page) {
	var promise,
		params = {};
	if (page) {
		params.limit = appConfigs.dollCountPrePage || 20;
		params.since = page ? (page - 1) * params.limit : 0;
	}
	promise = tsResourzes.Doll.query(params);
	return {
		[SOURCER_DEF]: {
			types: [DOLL_REQUEST, DOLL_SUCCESS, DOLL_FAILED],
			promise,
			meta : {
				args  : {page},
				schema: arrayOf(schemas.doll)
			}
		}
	};
}

export function loadDolls(page) {
	return (dispatch, getState) => {
		dispatch(fetchDolls(page));
	};
}

export const CREATE_DOLL_REQUEST = 'CREATE_DOLL_REQUEST';
export const CREATE_DOLL_SUCCESS = 'CREATE_DOLL_SUCCESS';
export const CREATE_DOLL_FAILED = 'CREATE_DOLL_FAILED';

export function createDoll(data) {
	var promise;
	promise = tsResourzes.Doll.create(data);
	return {
		[SOURCER_DEF]: {
			types: [CREATE_DOLL_REQUEST, CREATE_DOLL_SUCCESS, CREATE_DOLL_FAILED],
			promise,
			meta : {
				schema: schemas.doll
			}
		}
	};
}

export const UPDATE_DOLL_REQUEST = 'UPDATE_DOLL_REQUEST';
export const UPDATE_DOLL_SUCCESS = 'UPDATE_DOLL_SUCCESS';
export const UPDATE_DOLL_FAILED = 'UPDATE_DOLL_FAILED';

export function fetchUpdateDoll(id, data) {
	var promise;
	promise = tsResourzes.Doll.update({id}, data);
	return {
		[SOURCER_DEF]: {
			types: [UPDATE_DOLL_REQUEST, UPDATE_DOLL_SUCCESS, UPDATE_DOLL_FAILED],
			promise,
			meta : {
				args  : {id},
				schema: schemas.doll
			}
		}
	};
}

export function updateDoll(id, data) {
	return (dispatch, getState) => {
		dispatch(fetchUpdateDoll(id, data));
	};
}

// ================================ dollMachine =================================
export const DOLL_MACHINE_REQUEST = 'DOLL_MACHINE_REQUEST';
export const DOLL_MACHINE_SUCCESS = 'DOLL_MACHINE_SUCCESS';
export const DOLL_MACHINE_FAILED = 'DOLL_MACHINE_FAILED';

export function fetchDollMachines(page) {
	var promise,
		params = {};
	if (page) {
		params.limit = appConfigs.dollMachineCountPrePage || 20;
		params.since = page ? (page - 1) * params.limit : 0;
	}
	promise = tsResourzes.DollMachine.query(params);
	return {
		[SOURCER_DEF]: {
			types: [DOLL_MACHINE_REQUEST, DOLL_MACHINE_SUCCESS, DOLL_MACHINE_FAILED],
			promise,
			meta : {
				args  : {page},
				schema: arrayOf(schemas.dollMachine)
			}
		}
	};
}

export function loadDollMachines(page) {
	return (dispatch, getState) => {
		dispatch(fetchDollMachines(page));
	};
}

export const CREATE_DOLL_MACHINE_REQUEST = 'CREATE_DOLL_MACHINE_REQUEST';
export const CREATE_DOLL_MACHINE_SUCCESS = 'CREATE_DOLL_MACHINE_SUCCESS';
export const CREATE_DOLL_MACHINE_FAILED = 'CREATE_DOLL_MACHINE_FAILED';

export function createDollMachine(data) {
	var promise;
	promise = tsResourzes.DollMachine.create(data);
	return {
		[SOURCER_DEF]: {
			types: [CREATE_DOLL_MACHINE_REQUEST, CREATE_DOLL_MACHINE_SUCCESS, CREATE_DOLL_MACHINE_FAILED],
			promise,
			meta : {
				schema: schemas.dollMachine
			}
		}
	};
}

export const UPDATE_DOLL_MACHINE_REQUEST = 'UPDATE_DOLL_MACHINE_REQUEST';
export const UPDATE_DOLL_MACHINE_SUCCESS = 'UPDATE_DOLL_MACHINE_SUCCESS';
export const UPDATE_DOLL_MACHINE_FAILED = 'UPDATE_DOLL_MACHINE_FAILED';

export function fetchUpdateDollMachine(id, data) {
	var promise;
	promise = tsResourzes.DollMachine.update({id}, data);
	return {
		[SOURCER_DEF]: {
			types: [UPDATE_DOLL_MACHINE_REQUEST, UPDATE_DOLL_MACHINE_SUCCESS, UPDATE_DOLL_MACHINE_FAILED],
			promise,
			meta : {
				args  : {id},
				schema: schemas.dollMachine
			}
		}
	};
}

export function updateDollMachine(id, data) {
	return (dispatch, getState) => {
		dispatch(fetchUpdateDollMachine(id, data));
	};
}

// ================================ dollMachinePaw =================================
export const DOLL_MACHINE_PAW_REQUEST = 'DOLL_MACHINE_PAW_REQUEST';
export const DOLL_MACHINE_PAW_SUCCESS = 'DOLL_MACHINE_PAW_SUCCESS';
export const DOLL_MACHINE_PAW_FAILED = 'DOLL_MACHINE_PAW_FAILED';

export function fetchDollMachinePaws(page) {
	var promise,
		params = {};
	if (page) {
		params.limit = appConfigs.dollMachinePawCountPrePage || 20;
		params.since = page ? (page - 1) * params.limit : 0;
	}
	promise = tsResourzes.DollMachinePaw.query(params);
	return {
		[SOURCER_DEF]: {
			types: [DOLL_MACHINE_PAW_REQUEST, DOLL_MACHINE_PAW_SUCCESS, DOLL_MACHINE_PAW_FAILED],
			promise,
			meta : {
				args  : {page},
				schema: arrayOf(schemas.dollMachinePaw)
			}
		}
	};
}

export function loadDollMachinePaws(page) {
	return (dispatch, getState) => {
		dispatch(fetchDollMachinePaws(page));
	};
}

export const CREATE_DOLL_MACHINE_PAW_REQUEST = 'CREATE_DOLL_MACHINE_PAW_REQUEST';
export const CREATE_DOLL_MACHINE_PAW_SUCCESS = 'CREATE_DOLL_MACHINE_PAW_SUCCESS';
export const CREATE_DOLL_MACHINE_PAW_FAILED = 'CREATE_DOLL_MACHINE_PAW_FAILED';

export function createDollMachinePaw(data) {
	var promise;
	promise = tsResourzes.DollMachinePaw.create(data);
	return {
		[SOURCER_DEF]: {
			types: [CREATE_DOLL_MACHINE_PAW_REQUEST, CREATE_DOLL_MACHINE_PAW_SUCCESS, CREATE_DOLL_MACHINE_PAW_FAILED],
			promise,
			meta : {
				schema: schemas.dollMachinePaw
			}
		}
	};
}

export const UPDATE_DOLL_MACHINE_PAW_REQUEST = 'UPDATE_DOLL_MACHINE_PAW_REQUEST';
export const UPDATE_DOLL_MACHINE_PAW_SUCCESS = 'UPDATE_DOLL_MACHINE_PAW_SUCCESS';
export const UPDATE_DOLL_MACHINE_PAW_FAILED = 'UPDATE_DOLL_MACHINE_PAW_FAILED';

export function fetchUpdateDollMachinePaw(id, data) {
	var promise;
	promise = tsResourzes.DollMachinePaw.update({id}, data);
	return {
		[SOURCER_DEF]: {
			types: [UPDATE_DOLL_MACHINE_PAW_REQUEST, UPDATE_DOLL_MACHINE_PAW_SUCCESS, UPDATE_DOLL_MACHINE_PAW_FAILED],
			promise,
			meta : {
				args  : {id},
				schema: schemas.dollMachinePaw
			}
		}
	};
}

export function updateDollMachinePaw(id, data) {
	return (dispatch, getState) => {
		dispatch(fetchUpdateDollMachinePaw(id, data));
	};
}

// ================================ room =================================
export const ROOM_REQUEST = 'ROOM_REQUEST';
export const ROOM_SUCCESS = 'ROOM_SUCCESS';
export const ROOM_FAILED = 'ROOM_FAILED';

export function fetchRooms(page) {
	var promise,
		params = {};
	if (page) {
		params.limit = appConfigs.roomCountPrePage || 20;
		params.since = page ? (page - 1) * params.limit : 0;
	}
	promise = tsResourzes.Room.query(params);
	return {
		[SOURCER_DEF]: {
			types: [ROOM_REQUEST, ROOM_SUCCESS, ROOM_FAILED],
			promise,
			meta : {
				args  : {page},
				schema: arrayOf(schemas.room)
			}
		}
	};
}

export function loadRooms(page) {
	return (dispatch, getState) => {
		dispatch(fetchRooms(page));
	};
}

export const CREATE_ROOM_REQUEST = 'CREATE_ROOM_REQUEST';
export const CREATE_ROOM_SUCCESS = 'CREATE_ROOM_SUCCESS';
export const CREATE_ROOM_FAILED = 'CREATE_ROOM_FAILED';

export function createRoom(data) {
	var promise;
	promise = tsResourzes.Room.create(data);
	return {
		[SOURCER_DEF]: {
			types: [CREATE_ROOM_REQUEST, CREATE_ROOM_SUCCESS, CREATE_ROOM_FAILED],
			promise,
			meta : {
				schema: schemas.room
			}
		}
	};
}

export const UPDATE_ROOM_REQUEST = 'UPDATE_ROOM_REQUEST';
export const UPDATE_ROOM_SUCCESS = 'UPDATE_ROOM_SUCCESS';
export const UPDATE_ROOM_FAILED = 'UPDATE_ROOM_FAILED';

export function fetchUpdateRoom(id, data) {
	var promise;
	promise = tsResourzes.Room.update({id}, data);
	return {
		[SOURCER_DEF]: {
			types: [UPDATE_ROOM_REQUEST, UPDATE_ROOM_SUCCESS, UPDATE_ROOM_FAILED],
			promise,
			meta : {
				args  : {id},
				schema: schemas.room
			}
		}
	};
}

export function updateRoom(id, data) {
	return (dispatch, getState) => {
		dispatch(fetchUpdateRoom(id, data));
	};
}

// ================================ category =================================
export const CATEGORY_REQUEST = 'CATEGORY_REQUEST';
export const CATEGORY_SUCCESS = 'CATEGORY_SUCCESS';
export const CATEGORY_FAILED = 'CATEGORY_FAILED';

export function fetchCategories(page) {
	var promise,
		params = {};
	if (page) {
		params.limit = appConfigs.categoryCountPrePage || 20;
		params.since = page ? (page - 1) * params.limit : 0;
	}
	promise = tsResourzes.Category.query(params);
	return {
		[SOURCER_DEF]: {
			types: [CATEGORY_REQUEST, CATEGORY_SUCCESS, CATEGORY_FAILED],
			promise,
			meta : {
				args  : {page},
				schema: arrayOf(schemas.category)
			}
		}
	};
}

export function loadCategories(page) {
	return (dispatch, getState) => {
		dispatch(fetchCategories(page));
	};
}

export const CREATE_CATEGORY_REQUEST = 'CREATE_CATEGORY_REQUEST';
export const CREATE_CATEGORY_SUCCESS = 'CREATE_CATEGORY_SUCCESS';
export const CREATE_CATEGORY_FAILED = 'CREATE_CATEGORY_FAILED';

export function createCategory(data) {
	var promise;
	promise = tsResourzes.Category.create(data);
	return {
		[SOURCER_DEF]: {
			types: [CREATE_CATEGORY_REQUEST, CREATE_CATEGORY_SUCCESS, CREATE_CATEGORY_FAILED],
			promise,
			meta : {
				schema: schemas.category
			}
		}
	};
}

export const UPDATE_CATEGORY_REQUEST = 'UPDATE_CATEGORY_REQUEST';
export const UPDATE_CATEGORY_SUCCESS = 'UPDATE_CATEGORY_SUCCESS';
export const UPDATE_CATEGORY_FAILED = 'UPDATE_CATEGORY_FAILED';

export function fetchUpdateCategory(id, data) {
	var promise;
	promise = tsResourzes.Category.update({id}, data);
	return {
		[SOURCER_DEF]: {
			types: [UPDATE_CATEGORY_REQUEST, UPDATE_CATEGORY_SUCCESS, UPDATE_CATEGORY_FAILED],
			promise,
			meta : {
				args  : {id},
				schema: schemas.category
			}
		}
	};
}

export function updateCategory(id, data) {
	return (dispatch, getState) => {
		dispatch(fetchUpdateCategory(id, data));
	};
}

// ================================ tag =================================
export const TAG_REQUEST = 'TAG_REQUEST';
export const TAG_SUCCESS = 'TAG_SUCCESS';
export const TAG_FAILED = 'TAG_FAILED';

export function fetchTags(page) {
	var promise,
		params = {};
	if (page) {
		params.limit = appConfigs.tagCountPrePage || 20;
		params.since = page ? (page - 1) * params.limit : 0;
	}
	promise = tsResourzes.Tag.query(params);
	return {
		[SOURCER_DEF]: {
			types: [TAG_REQUEST, TAG_SUCCESS, TAG_FAILED],
			promise,
			meta : {
				args  : {page},
				schema: arrayOf(schemas.tag)
			}
		}
	};
}

export function loadTags(page) {
	return (dispatch, getState) => {
		dispatch(fetchTags(page));
	};
}

export const CREATE_TAG_REQUEST = 'CREATE_TAG_REQUEST';
export const CREATE_TAG_SUCCESS = 'CREATE_TAG_SUCCESS';
export const CREATE_TAG_FAILED = 'CREATE_TAG_FAILED';

export function createTag(data) {
	var promise;
	promise = tsResourzes.Tag.create(data);
	return {
		[SOURCER_DEF]: {
			types: [CREATE_TAG_REQUEST, CREATE_TAG_SUCCESS, CREATE_TAG_FAILED],
			promise,
			meta : {
				schema: schemas.tag
			}
		}
	};
}

export const UPDATE_TAG_REQUEST = 'UPDATE_TAG_REQUEST';
export const UPDATE_TAG_SUCCESS = 'UPDATE_TAG_SUCCESS';
export const UPDATE_TAG_FAILED = 'UPDATE_TAG_FAILED';

export function fetchUpdateTag(id, data) {
	var promise;
	promise = tsResourzes.Tag.update({id}, data);
	return {
		[SOURCER_DEF]: {
			types: [UPDATE_TAG_REQUEST, UPDATE_TAG_SUCCESS, UPDATE_TAG_FAILED],
			promise,
			meta : {
				args  : {id},
				schema: schemas.tag
			}
		}
	};
}

export function updateTag(id, data) {
	return (dispatch, getState) => {
		dispatch(fetchUpdateTag(id, data));
	};
}

// ================================ rechargeMall =================================
export const RECHARGEMALL_REQUEST = 'RECHARGEMALL_REQUEST';
export const RECHARGEMALL_SUCCESS = 'RECHARGEMALL_SUCCESS';
export const RECHARGEMALL_FAILED = 'RECHARGEMALL_FAILED';

export function fetchRechargeMalls(page) {
	var promise,
		params = {};
	if (page) {
		params.limit = appConfigs.rechargeMallCountPrePage || 20;
		params.since = page ? (page - 1) * params.limit : 0;
	}
	promise = tsResourzes.RechargeMall.query(params);
	return {
		[SOURCER_DEF]: {
			types: [RECHARGEMALL_REQUEST, RECHARGEMALL_SUCCESS, RECHARGEMALL_FAILED],
			promise,
			meta : {
				args  : {page},
				schema: arrayOf(schemas.rechargeMall)
			}
		}
	};
}

export function loadRechargeMalls(page) {
	return (dispatch, getState) => {
		dispatch(fetchRechargeMalls(page));
	};
}

export const CREATE_RECHARGEMALL_REQUEST = 'CREATE_RECHARGEMALL_REQUEST';
export const CREATE_RECHARGEMALL_SUCCESS = 'CREATE_RECHARGEMALL_SUCCESS';
export const CREATE_RECHARGEMALL_FAILED = 'CREATE_RECHARGEMALL_FAILED';

export function createRechargeMall(data) {
	var promise;
	promise = tsResourzes.RechargeMall.create(data);
	return {
		[SOURCER_DEF]: {
			types: [CREATE_RECHARGEMALL_REQUEST, CREATE_RECHARGEMALL_SUCCESS, CREATE_RECHARGEMALL_FAILED],
			promise,
			meta : {
				schema: schemas.rechargeMall
			}
		}
	};
}

export const UPDATE_RECHARGEMALL_REQUEST = 'UPDATE_RECHARGEMALL_REQUEST';
export const UPDATE_RECHARGEMALL_SUCCESS = 'UPDATE_RECHARGEMALL_SUCCESS';
export const UPDATE_RECHARGEMALL_FAILED = 'UPDATE_RECHARGEMALL_FAILED';

export function fetchUpdateRechargeMall(id, data) {
	var promise;
	promise = tsResourzes.RechargeMall.update({id}, data);
	return {
		[SOURCER_DEF]: {
			types: [UPDATE_RECHARGEMALL_REQUEST, UPDATE_RECHARGEMALL_SUCCESS, UPDATE_RECHARGEMALL_FAILED],
			promise,
			meta : {
				args  : {id},
				schema: schemas.rechargeMall
			}
		}
	};
}

export function updateRechargeMall(id, data) {
	return (dispatch, getState) => {
		dispatch(fetchUpdateRechargeMall(id, data));
	};
}

// ================================ pointMall =================================
export const POINTMALL_REQUEST = 'POINTMALL_REQUEST';
export const POINTMALL_SUCCESS = 'POINTMALL_SUCCESS';
export const POINTMALL_FAILED = 'POINTMALL_FAILED';

export function fetchPointMalls(page) {
	var promise,
		params = {};
	if (page) {
		params.limit = appConfigs.pointMallCountPrePage || 20;
		params.since = page ? (page - 1) * params.limit : 0;
	}
	promise = tsResourzes.PointMall.query(params);
	return {
		[SOURCER_DEF]: {
			types: [POINTMALL_REQUEST, POINTMALL_SUCCESS, POINTMALL_FAILED],
			promise,
			meta : {
				args  : {page},
				schema: arrayOf(schemas.pointMall)
			}
		}
	};
}

export function loadPointMalls(page) {
	return (dispatch, getState) => {
		dispatch(fetchPointMalls(page));
	};
}

export const CREATE_POINTMALL_REQUEST = 'CREATE_POINTMALL_REQUEST';
export const CREATE_POINTMALL_SUCCESS = 'CREATE_POINTMALL_SUCCESS';
export const CREATE_POINTMALL_FAILED = 'CREATE_POINTMALL_FAILED';

export function createPointMall(data) {
	var promise;
	promise = tsResourzes.PointMall.create(data);
	return {
		[SOURCER_DEF]: {
			types: [CREATE_POINTMALL_REQUEST, CREATE_POINTMALL_SUCCESS, CREATE_POINTMALL_FAILED],
			promise,
			meta : {
				schema: schemas.pointMall
			}
		}
	};
}

export const UPDATE_POINTMALL_REQUEST = 'UPDATE_POINTMALL_REQUEST';
export const UPDATE_POINTMALL_SUCCESS = 'UPDATE_POINTMALL_SUCCESS';
export const UPDATE_POINTMALL_FAILED = 'UPDATE_POINTMALL_FAILED';

export function fetchUpdatePointMall(id, data) {
	var promise;
	promise = tsResourzes.PointMall.update({id}, data);
	return {
		[SOURCER_DEF]: {
			types: [UPDATE_POINTMALL_REQUEST, UPDATE_POINTMALL_SUCCESS, UPDATE_POINTMALL_FAILED],
			promise,
			meta : {
				args  : {id},
				schema: schemas.pointMall
			}
		}
	};
}

export function updatePointMall(id, data) {
	return (dispatch, getState) => {
		dispatch(fetchUpdatePointMall(id, data));
	};
}

// ================================ announcement =================================
export const ANNOUNCEMENT_REQUEST = 'ANNOUNCEMENT_REQUEST';
export const ANNOUNCEMENT_SUCCESS = 'ANNOUNCEMENT_SUCCESS';
export const ANNOUNCEMENT_FAILED = 'ANNOUNCEMENT_FAILED';

export function fetchAnnouncements(page) {
	var promise,
		params = {};
	if (page) {
		params.limit = appConfigs.announcementCountPrePage || 20;
		params.since = page ? (page - 1) * params.limit : 0;
	}
	promise = tsResourzes.Announcement.query(params);
	return {
		[SOURCER_DEF]: {
			types: [ANNOUNCEMENT_REQUEST, ANNOUNCEMENT_SUCCESS, ANNOUNCEMENT_FAILED],
			promise,
			meta : {
				args  : {page},
				schema: arrayOf(schemas.announcement)
			}
		}
	};
}

export function loadAnnouncements(page) {
	return (dispatch, getState) => {
		dispatch(fetchAnnouncements(page));
	};
}

export const CREATE_ANNOUNCEMENT_REQUEST = 'CREATE_ANNOUNCEMENT_REQUEST';
export const CREATE_ANNOUNCEMENT_SUCCESS = 'CREATE_ANNOUNCEMENT_SUCCESS';
export const CREATE_ANNOUNCEMENT_FAILED = 'CREATE_ANNOUNCEMENT_FAILED';

export function createAnnouncement(data) {
	var promise;
	promise = tsResourzes.Announcement.create(data);
	return {
		[SOURCER_DEF]: {
			types: [CREATE_ANNOUNCEMENT_REQUEST, CREATE_ANNOUNCEMENT_SUCCESS, CREATE_ANNOUNCEMENT_FAILED],
			promise,
			meta : {
				schema: schemas.announcement
			}
		}
	};
}

export const UPDATE_ANNOUNCEMENT_REQUEST = 'UPDATE_ANNOUNCEMENT_REQUEST';
export const UPDATE_ANNOUNCEMENT_SUCCESS = 'UPDATE_ANNOUNCEMENT_SUCCESS';
export const UPDATE_ANNOUNCEMENT_FAILED = 'UPDATE_ANNOUNCEMENT_FAILED';

export function fetchUpdateAnnouncement(id, data) {
	var promise;
	promise = tsResourzes.Announcement.update({id}, data);
	return {
		[SOURCER_DEF]: {
			types: [UPDATE_ANNOUNCEMENT_REQUEST, UPDATE_ANNOUNCEMENT_SUCCESS, UPDATE_ANNOUNCEMENT_FAILED],
			promise,
			meta : {
				args  : {id},
				schema: schemas.announcement
			}
		}
	};
}

export function updateAnnouncement(id, data) {
	return (dispatch, getState) => {
		dispatch(fetchUpdateAnnouncement(id, data));
	};
}

export const DELETE_ANNOUNCEMENT_REQUEST = 'DELETE_ANNOUNCEMENT_REQUEST';
export const DELETE_ANNOUNCEMENT_SUCCESS = 'DELETE_ANNOUNCEMENT_SUCCESS';
export const DELETE_ANNOUNCEMENT_FAILED = 'DELETE_ANNOUNCEMENT_FAILED';

export function delAnnouncement(id) {
	var promise;
	promise = tsResourzes.Announcement.delete({id});
	return {
		[SOURCER_DEF]: {
			types: [DELETE_ANNOUNCEMENT_REQUEST, DELETE_ANNOUNCEMENT_SUCCESS, DELETE_ANNOUNCEMENT_FAILED],
			promise
		}
	};
}

// ================================ order =================================
export const ORDER_REQUEST = 'ORDER_REQUEST';
export const ORDER_SUCCESS = 'ORDER_SUCCESS';
export const ORDER_FAILED = 'ORDER_FAILED';

function fetchOrders(page) {
	var promise,
		params = {};
	if (page) {
		params.limit = appConfigs.orderCountPrePage || 20;
		params.since = page ? (page - 1) * params.limit : 0;
	}
	promise = tsResourzes.Order.query(params);
	return {
		[SOURCER_DEF]: {
			types: [ORDER_REQUEST, ORDER_SUCCESS, ORDER_FAILED],
			promise,
			meta : {
				args  : {page},
				schema: arrayOf(schemas.order)
			}
		}
	};
}

export function loadOrders(page) {
	return (dispatch, getState) => {
		dispatch(fetchOrders(page));
	};
}

export const UPDATE_ORDER_REQUEST = 'UPDATE_ORDER_REQUEST';
export const UPDATE_ORDER_SUCCESS = 'UPDATE_ORDER_SUCCESS';
export const UPDATE_ORDER_FAILED = 'UPDATE_ORDER_FAILED';

export function fetchUpdateOrder(id, data) {
	var promise;
	promise = tsResourzes.Order.update({id}, data);
	return {
		[SOURCER_DEF]: {
			types: [UPDATE_ORDER_REQUEST, UPDATE_ORDER_SUCCESS, UPDATE_ORDER_FAILED],
			promise,
			meta : {
				args  : {id},
				schema: schemas.order
			}
		}
	};
}

export function updateOrder(id, data) {
	return (dispatch, getState) => {
		dispatch(fetchUpdateOrder(id, data));
	};
}



// ================================ visitor =================================
// VISITOR Visitor Visitors visitor visitors
export const VISITOR_REQUEST = 'VISITOR_REQUEST';
export const VISITOR_SUCCESS = 'VISITOR_SUCCESS';
export const VISITOR_FAILED = 'VISITOR_FAILED';

export function fetchVisitors(page) {
    var promise,
        params = {};
    if (page) {
        params.limit = appConfigs.visitorCountPrePage || 20;
        params.since = page ? (page - 1) * params.limit : 0;
    }
    promise = tsResourzes.Visitor.query(params);
    return {
        [SOURCER_DEF]: {
            types: [VISITOR_REQUEST, VISITOR_SUCCESS, VISITOR_FAILED],
            promise,
            meta : {
                args  : {page},
                schema: arrayOf(schemas.visitor)
            }
        }
    };
}

export function loadVisitors(page) {
    return (dispatch, getState) => {
        dispatch(fetchVisitors(page));
    };
}

export const CREATE_VISITOR_REQUEST = 'CREATE_VISITOR_REQUEST';
export const CREATE_VISITOR_SUCCESS = 'CREATE_VISITOR_SUCCESS';
export const CREATE_VVISITOR_FAILED = 'CREATE_VISITOR_FAILED';

export function createVisitor(newVisitor) {
    var promise;
    promise = tsResourzes.Visitor.create(null, newVisitor);
    return {
        [SOURCER_DEF]: {
            types: [CREATE_VISITOR_REQUEST, CREATE_VISITOR_SUCCESS, CREATE_VISITOR_FAILED],
            promise,
            meta : {
                schema: schemas.visitor
            }
        }
    };
}
