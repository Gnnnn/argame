/**
 * Created by Koan on 2017/11/20.
 */
'use strict';

var categoryCtrl = require('../controllers/category'),
	appCtrl = require('../controllers/app'),
	Category = require('../models/category'),
	categoryValidator = require('../validators/request/category'),
	auth = require('../utils/authentication');

module.exports = function (easyRouter) {
	var routeModel = easyRouter.fromModel(Category);

	easyRouter.route('/api/categories')
		.get(auth.systemResource, routeModel.all.custom({
			needCount: true,
			limit    : 12,
			sort     : '-_id',
			populate : 'uploadUser lastModifiedUser'
		}))
		.post(auth.systemResource,
			categoryValidator.validateCreation,
			categoryCtrl.categoryCreateTransformer,
			appCtrl.reRestructPlayInfoAfterUpdate(routeModel.create));

	easyRouter.route('/api/categories/:id')
		.get(auth.systemResource, routeModel.one.custom({
			populate: 'uploadUser lastModifiedUser'
		}))
		.put(auth.systemResource,
			categoryValidator.validateUpdate,
			categoryCtrl.categoryUpdateTransformer,
			appCtrl.reRestructPlayInfoAfterUpdate(routeModel.update));
};