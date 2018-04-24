/**
 * Created by Koan on 2017/9/28.
 */
'use strict';

var noticeCtrl = require('../controllers/notice'),
	Notice = require('../models/notice'),
	noticeValidator = require('../validators/request/notice'),
	auth = require('../utils/authentication');

module.exports = function (easyRouter) {
	var routeModel = easyRouter.fromModel(Notice);

	easyRouter.route('/api/notices')
		.get(auth.systemResource, routeModel.all.custom({
			needCount: true,
			limit    : 20,
			sort     : '-_id',
			populate : 'uploadUser lastModifiedUser'
		}))
		.post(auth.systemResource,
			noticeValidator.validateCreation,
			noticeCtrl.noticeCreateTransformer,
			routeModel.create);

	easyRouter.route('/api/notices/:id')
		.get(auth.systemResource, routeModel.one.custom({
			populate: 'uploadUser lastModifiedUser'
		}))
		.put(auth.systemResource,
			noticeValidator.validateUpdate,
			noticeCtrl.noticeUpdateTransformer,
			routeModel.update)
		.del(auth.systemResource, routeModel.del);

	// ===============================================app==============================================
	easyRouter.route('/api/app/notices')
		.get(routeModel.all.custom({
			fields  : {
				_id             : 1,
				title           : 1,
				content         : 1,
				lastModifiedUser: 1,
				lastModifiedTime: 1
			},
			sort    : '-_id',
			populate: ['lastModifiedUser', 'name']
		}));

	easyRouter.route('/api/app/notices/:id')
		.get(routeModel.one.custom({
			fields  : {
				_id             : 1,
				title           : 1,
				content         : 1,
				lastModifiedUser: 1,
				lastModifiedTime: 1
			},
			populate: ['lastModifiedUser', 'name']
		}));
};