/**
 * Created by Koan on 2017/11/20.
 */
'use strict';

var dollMachinePawCtrl = require('../controllers/dollMachinePaw'),
	appCtrl = require('../controllers/app'),
	DollMachinePaw = require('../models/dollMachinePaw'),
	dollMachinePawValidator = require('../validators/request/dollMachinePaw'),
	auth = require('../utils/authentication');

module.exports = function (easyRouter) {
	var routeModel = easyRouter.fromModel(DollMachinePaw);

	easyRouter.route('/api/dollMachinePaws')
		.get(auth.systemResource, routeModel.all.custom({
			needCount: true,
			limit    : 12,
			sort     : '-_id',
			populate : 'uploadUser lastModifiedUser'
		}))
		.post(auth.systemResource,
			dollMachinePawValidator.validateCreation,
			dollMachinePawCtrl.dollMachinePawCreateTransformer,
			appCtrl.reRestructPlayInfoAfterUpdate(routeModel.create));

	easyRouter.route('/api/dollMachinePaws/:id')
		.get(auth.systemResource, routeModel.one.custom({
			populate: 'uploadUser lastModifiedUser'
		}))
		.put(auth.systemResource,
			dollMachinePawValidator.validateUpdate,
			dollMachinePawCtrl.dollMachinePawUpdateTransformer,
			appCtrl.reRestructPlayInfoAfterUpdate(routeModel.update));
};