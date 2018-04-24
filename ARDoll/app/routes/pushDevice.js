'use strict';
/**
 * Created by gogoout on 16/12/7.
 */
var pushDeviceCtrl = require('../controllers/pushDevice'),
	pushDeviceValidator = require('../validators/request/pushDevices'),
	auth = require('../utils/authentication');


module.exports = function (easyRouter) {

	easyRouter.route('/api/pushDevices')
		.post(null, pushDeviceValidator.validateCreation, pushDeviceCtrl.pushDeviceTransformer, pushDeviceCtrl.pushDeviceCreate);

	easyRouter.route('/api/pushDevices/:deviceId/user')
		.post(auth.userResource, pushDeviceCtrl.pushDeviceUserUpdate)
		.del(auth.userResource, pushDeviceCtrl.pushDeviceUserDelete);

	// ===============================================app==============================================
	easyRouter.route('/api/app/pushDevices')
		.post(null, pushDeviceValidator.validateCreation, pushDeviceCtrl.pushDeviceTransformer, pushDeviceCtrl.pushDeviceCreate);
};
