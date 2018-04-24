/**
 * Created by Koan on 2017/12/11.
 */
'use strict';

var rechargeRecordCtrl = require('../controllers/rechargeRecord'),
	RechargeRecord = require('../models/rechargeRecord'),
	auth = require('../utils/authentication');

module.exports = function (easyRouter) {
	var routeModel = easyRouter.fromModel(RechargeRecord);

	// ===============================================app==============================================
	easyRouter.route('/api/app/rechargeRecords/me')
		.get(auth.visitorResource, routeModel.all.custom({
			condition: function (req) {
				return {
					visitor: req.visitor._id,
					state  : 'FINISH'
				};
			},
			needCount: true,
			limit    : 20,
			sort     : '-_id',
			fields   : {
				_id     : 1,
				recharge: 1,
				type    : 1,
				time    : 1,
				cash    : 1,
				coin    : 1
			},
			populate : [
				{
					path  : 'recharge',
					select: 'amount'
				}
			]
		}));

	easyRouter.route('/api/app/rechargeRecords/:id/alipay')
		.get(auth.visitorResource, rechargeRecordCtrl.getAlipayResult);

	easyRouter.route('/api/app/rechargeRecords/:id/wechatpay')
		.get(auth.visitorResource, rechargeRecordCtrl.getWechatResult);

	// ==========callback=================
	easyRouter.route('/api/app/pay/wechat/callback')
		.post(rechargeRecordCtrl.wechatpayCallback);

	easyRouter.route('/api/app/pay/alipay/callback')
		.post(rechargeRecordCtrl.alipayCallback);

	easyRouter.route('/api/app/pay/iospay/verify')
		.post(auth.visitorResource, rechargeRecordCtrl.verifyIOSPayment);
};