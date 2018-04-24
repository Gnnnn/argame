/**
 * Created by Koan on 2017/12/7.
 */
'use strict';

var pointMallCtrl = require('../controllers/pointMall'),
	PointMall = require('../models/pointMall'),
	pointMallValidator = require('../validators/request/pointMall'),
	auth = require('../utils/authentication');

module.exports = function (easyRouter) {
	var routeModel = easyRouter.fromModel(PointMall);

	easyRouter.route('/api/pointMalls')
		.get(auth.systemResource, routeModel.all.custom({
			needCount: true,
			limit    : 12,
			sort     : '-_id',
			populate : 'uploadUser lastModifiedUser category tag'
		}))
		.post(auth.systemResource,
			pointMallValidator.validateCreation,
			pointMallCtrl.pointMallCreateTransformer,
			routeModel.create);

	easyRouter.route('/api/pointMalls/:id')
		.get(auth.systemResource, routeModel.one.custom({
			populate: 'uploadUser lastModifiedUser category tag'
		}))
		.put(auth.systemResource,
			pointMallValidator.validateUpdate,
			pointMallCtrl.pointMallUpdateTransformer,
			routeModel.update);

	// ===============================================app==============================================
	easyRouter.route('/api/app/pointMalls')
		.get(pointMallCtrl.getPointMallDetail);
};