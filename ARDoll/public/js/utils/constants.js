'use strict';

const constants = {
	USERTOKENID    : 'usertokenid',
	TOKEN_KEY      : 'x-tianshe-dolls-token',
	HEADER_COUNT   : 'x-ar-count',
	ERROR_CODE_FAKE: 'FAKE',

	NETWORK_BROKEN_ERROR: '您的网络已断开，请检查网络',

	REDUX_ACTIONS_INIT: '@@INIT',

	MODAL_NOTICE                 : 'MODAL_NOTICE',
	MODAL_ADVICE                 : 'MODAL_ADVICE',
	MODAL_PUSH                   : 'MODAL_PUSH',
	MODAL_VERSION                : 'MODAL_VERSION',
	MODAL_DOLL                   : 'MODAL_DOLL',
	MODAL_DOLL_MACHINE           : 'MODAL_DOLL_MACHINE',
	MODAL_DOLL_MACHINE_PAW       : 'MODAL_DOLL_MACHINE_PAW',
	MODAL_ROOM                   : 'MODAL_ROOM',
	MODAL_SELECT_DOLL            : 'MODAL_SELECT_DOLL',
	MODAL_SELECT_DOLL_MACHINE    : 'MODAL_SELECT_DOLL_MACHINE',
	MODAL_SELECT_DOLL_MACHINE_PAW: 'MODAL_SELECT_DOLL_MACHINE_PAW',
	MODAL_SELECT_CATEGORY        : 'MODAL_SELECT_CATEGORY',
	MODAL_SELECT_TAG             : 'MODAL_SELECT_TAG',
	MODAL_CATEGORY               : 'MODAL_CATEGORY',
	MODAL_TAG                    : 'MODAL_TAG',
	MODAL_RECHARGEMALL           : 'MODAL_RECHARGEMALL',
	MODAL_POINTMALL              : 'MODAL_POINTMALL',
	MODAL_ANNOUNCEMENT           : 'MODAL_ANNOUNCEMENT',
	MODAL_ORDER                  : 'MODAL_ORDER',

	ADVICE_HANDLESTATE: {
		pending  : '待处理',
		processed: '已处理',
		shelve   : '搁置'
	},

	ADVICE_MSG_TYPE: {
		user  : '用户反馈',
		system: '系统反馈'
	}
};

if (process.browser) {
	constants.COOKIE_DOMAIN = window.location.host.replace(/^www/, '').replace(`:${window.location.port}`, '');
}

export default constants;