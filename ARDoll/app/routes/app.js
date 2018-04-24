/**
 * Created by Koan on 2017/11/28.
 */
'use strict';

var appCtrl = require('../controllers/app'),
	auth = require('../utils/authentication');

module.exports = function (easyRouter) {

	// ===============================================app==============================================
	easyRouter.route('/api/app/brief')
		.get(appCtrl.getAllBriefs);

	easyRouter.route('/api/app/detail')
		.get(appCtrl.getAllDetails);

	easyRouter.route('/api/app/play/:roomId/coin')
		.post(auth.visitorResource, appCtrl.playRoomByCoin);

	easyRouter.route('/api/app/play/:roomId/discount')
		.post(auth.visitorResource, appCtrl.playRoomByCoinDiscount);

	easyRouter.route('/api/app/play/:roomId/free')
		.post(auth.visitorResource, appCtrl.playRoomByFreeCoupons);

	easyRouter.route('/api/app/playFreeRoom/:roomId')
		.post(auth.visitorResource, appCtrl.playFreeRoom);

// 	easyRouter.route('/api/app/dailyTask/:type')
// 		.post(auth.visitorResource, appCtrl.fulfillDailyTasks);
};