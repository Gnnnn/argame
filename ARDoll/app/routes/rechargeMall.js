/**
 * Created by Koan on 2017/12/7.
 */
'use strict';

var rechargeMallCtrl = require('../controllers/rechargeMall'),
	RechargeMall = require('../models/rechargeMall'),
	rechargeMallValidator = require('../validators/request/rechargeMall'),
	auth = require('../utils/authentication');

module.exports = function (easyRouter) {
	var routeModel = easyRouter.fromModel(RechargeMall);

	easyRouter.route('/api/rechargeMalls')
		.get(auth.systemResource, routeModel.all.custom({
			needCount: true,
			limit    : 12,
			sort     : '-_id',
			populate : 'uploadUser lastModifiedUser'
		}))
		.post(auth.systemResource,
			rechargeMallValidator.validateCreation,
			rechargeMallCtrl.rechargeMallCreateTransformer,
			routeModel.create);

	easyRouter.route('/api/rechargeMalls/:id')
		.get(auth.systemResource, routeModel.one.custom({
			populate: 'uploadUser lastModifiedUser'
		}))
		.put(auth.systemResource,
			rechargeMallValidator.validateUpdate,
			rechargeMallCtrl.rechargeMallUpdateTransformer,
			routeModel.update);

	// ===============================================app==============================================
	easyRouter.route('/api/app/rechargeMalls')
		.get(auth.visitorResource, routeModel.all.custom({
			condition: function (req) {
				return {
					validFlg: true
				};
			},
			sort     : '-_id',
			fields   : {
				_id         : 1,
				name        : 1,
				description : 1,
				thumbnail   : 1,
				amount      : 1,
				exchangeCoin: 1,
				presentCoin : 1
			}
		}));

	easyRouter.route('/api/app/rechargeMalls/:id/alipay')
		.post(auth.visitorResource, rechargeMallCtrl.buildAlipayData);

	easyRouter.route('/api/app/rechargeMalls/:id/wechatpay')
		.post(auth.visitorResource, rechargeMallCtrl.buildWechatData);
};