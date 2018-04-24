/**
 * Created by Koan on 2017/11/20.
 */
'use strict';

var dollCtrl = require('../controllers/doll'),
	appCtrl = require('../controllers/app'),
	Doll = require('../models/doll'),
	dollValidator = require('../validators/request/doll'),
	auth = require('../utils/authentication');

module.exports = function (easyRouter) {
	var routeModel = easyRouter.fromModel(Doll);

	easyRouter.route('/api/dolls')
		.get(auth.systemResource, routeModel.all.custom({
			needCount: true,
			limit    : 12,
			sort     : '-_id',
			populate : 'uploadUser lastModifiedUser'
		}))
		.post(auth.systemResource,
			dollValidator.validateCreation,
			dollCtrl.dollCreateTransformer,
			appCtrl.reRestructPlayInfoAfterUpdate(routeModel.create));

	easyRouter.route('/api/dolls/:id')
		.get(auth.systemResource, routeModel.one.custom({
			populate: 'uploadUser lastModifiedUser'
		}))
		.put(auth.systemResource,
			dollValidator.validateUpdate,
			dollCtrl.dollUpdateTransformer,
			appCtrl.reRestructPlayInfoAfterUpdate(routeModel.update));
};