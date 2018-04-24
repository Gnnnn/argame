/**
 * Created by Koan on 2017/11/20.
 */
'use strict';

var dollMachineCtrl = require('../controllers/dollMachine'),
	appCtrl = require('../controllers/app'),
	DollMachine = require('../models/dollMachine'),
	dollMachineValidator = require('../validators/request/dollMachine'),
	auth = require('../utils/authentication');

module.exports = function (easyRouter) {
	var routeModel = easyRouter.fromModel(DollMachine);

	easyRouter.route('/api/dollMachines')
		.get(auth.systemResource, routeModel.all.custom({
			needCount: true,
			limit    : 12,
			sort     : '-_id',
			populate : 'uploadUser lastModifiedUser'
		}))
		.post(auth.systemResource,
			dollMachineValidator.validateCreation,
			dollMachineCtrl.dollMachineCreateTransformer,
			appCtrl.reRestructPlayInfoAfterUpdate(routeModel.create));

	easyRouter.route('/api/dollMachines/:id')
		.get(auth.systemResource, routeModel.one.custom({
			populate: 'uploadUser lastModifiedUser'
		}))
		.put(auth.systemResource,
			dollMachineValidator.validateUpdate,
			dollMachineCtrl.dollMachineUpdateTransformer,
			appCtrl.reRestructPlayInfoAfterUpdate(routeModel.update));
};