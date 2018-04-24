/**
 * Created by Koan on 2017/9/29.
 */
'use strict';

var Visitor = require('../models/visitor'),
	visitorCtrl = require('../controllers/visitor'),
	visitorValidator = require('../validators/request/visitor'),
	auth = require('../utils/authentication');

// var Daily = require('../models/dailyActive'),
// 	Monthly = require('../models/monthlyActive');

module.exports = function (easyRouter) {
	var routeModel = easyRouter.fromModel(Visitor);

	easyRouter.route('/api/active/retention')
		.get(auth.systemResource, visitorCtrl.getRetention);

	easyRouter.route('/api/active/daily')
		.get(auth.systemResource, visitorCtrl.getDailyActive);

	easyRouter.route('/api/active/daily/excel')
		.get(visitorCtrl.exportDailyActive);

	easyRouter.route('/api/active/monthly')
		.get(auth.systemResource, visitorCtrl.getMonthlyActive);

	easyRouter.route('/api/active/monthly/excel')
		.get(visitorCtrl.exportMonthlyActive);

	easyRouter.route('/api/visitors/me')
		.get(auth.visitorResource, visitorCtrl.getMe);

    easyRouter.route('/api/visitors/visitorsInfo')
        .get(auth.visitorResource, visitorCtrl,getVisitorInfoById);
	// ===============================================app==============================================
	easyRouter.route('/api/app/visitors/me')
		.get(auth.visitorResource, visitorCtrl.getMe)
		.put(auth.visitorResource,
			visitorValidator.validateUpdate,
			visitorCtrl.visitorSelfUpdateTransformer,
			visitorCtrl.updateMe);

	easyRouter.route('/api/app/visitors/me/inviteCode')
		.put(auth.visitorResource,
			visitorValidator.validateInviteCode,
			visitorCtrl.setInviteCode);

// 	var dailyModel = easyRouter.fromModel(Daily);
// 	easyRouter.route('/api/daily')
// 		.post(dailyModel.create);
//
// 	var monthlyModel = easyRouter.fromModel(Monthly);
// 	easyRouter.route('/api/monthly')
// 		.post(monthlyModel.create);
};