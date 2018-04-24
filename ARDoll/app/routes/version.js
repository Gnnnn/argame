/**
 * Created by Koan on 2017/9/21.
 */
'use strict';

var versionCtrl = require('../controllers/version'),
	Version = require('../models/version'),
	versionValidator = require('../validators/request/version'),
	auth = require('../utils/authentication');

module.exports = function (easyRouter) {
	var routeModel = easyRouter.fromModel(Version);

	easyRouter.route('/api/versions')
		.get(auth.systemResource, routeModel.all.custom({
			needCount: true,
			limit    : 20,
			sort     : '-_id',
			populate : ['user', 'name']
		}))
		.post(auth.systemResource,
			versionValidator.validateCreation,
			versionCtrl.versionCreateTransformer,
			versionCtrl.createNewVersion);

	easyRouter.route('/api/versions/lastest')
		.get(auth.systemResource, routeModel.one.custom({
			condition: {},
			sort     : '-_id',
			populate : ['user', 'name']
		}));

	// ===============================================app==============================================
// 	easyRouter.route('/api/app/versions')
// 		.get(routeModel.all.custom({
// 			needCount: true,
// 			limit    : 20,
// 			sort     : '-_id',
// 			populate : ['user', 'name']
// 		}));

	easyRouter.route('/api/app/versions/lastest')
		.get(versionCtrl.getLastestVersion);
};