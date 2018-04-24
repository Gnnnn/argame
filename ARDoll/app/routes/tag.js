/**
 * Created by Koan on 2017/11/20.
 */
'use strict';

var tagCtrl = require('../controllers/tag'),
	appCtrl = require('../controllers/app'),
	Tag = require('../models/tag'),
	tagValidator = require('../validators/request/tag'),
	auth = require('../utils/authentication');

module.exports = function (easyRouter) {
	var routeModel = easyRouter.fromModel(Tag);

	easyRouter.route('/api/tags')
		.get(auth.systemResource, routeModel.all.custom({
			needCount: true,
			limit    : 12,
			sort     : '-_id',
			populate : 'uploadUser lastModifiedUser'
		}))
		.post(auth.systemResource,
			tagValidator.validateCreation,
			tagCtrl.tagCreateTransformer,
			appCtrl.reRestructPlayInfoAfterUpdate(routeModel.create));

	easyRouter.route('/api/tags/:id')
		.get(auth.systemResource, routeModel.one.custom({
			populate: 'uploadUser lastModifiedUser'
		}))
		.put(auth.systemResource,
			tagValidator.validateUpdate,
			tagCtrl.tagUpdateTransformer,
			appCtrl.reRestructPlayInfoAfterUpdate(routeModel.update));
};