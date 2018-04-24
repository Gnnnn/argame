'use strict';
/**
 * Created by gogoout on 16/12/8.
 */
var Push = require('../models/push'),
	pushCtrl = require('../controllers/push'),
	pushValidator = require('../validators/request/push'),
	auth = require('../utils/authentication');

module.exports = function (easyRouter) {
	var routeModel = easyRouter.fromModel(Push);

	easyRouter.route('/api/push')
		.get(auth.systemResource, routeModel.all.custom({
			needCount: true,
			limit    : 50,
			sort     : '-_id',
			queryPick: [
				'title'
			]
		}))
		.post(auth.systemResource, pushValidator.validateCreation, pushCtrl.transformer, pushCtrl.createPush);

	easyRouter.route('/api/push/:id')
		.put(auth.systemResource, pushValidator.validateModification, pushCtrl.transformer, pushCtrl.updatePush);
};
