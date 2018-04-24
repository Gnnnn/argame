/**
 * Created by Koan on 2017.9.21
 */
'use strict';

var adviceCtrl = require('../controllers/advice'),
	Advice = require('../models/advice'),
	adviceValidator = require('../validators/request/advice'),
	auth = require('../utils/authentication');

module.exports = function (easyRouter) {
	var routeModel = easyRouter.fromModel(Advice);

	easyRouter.route('/api/advice')
		.get(auth.systemResource, routeModel.all.custom({
			needCount: true,
			limit    : 20,
			sort     : '-_id',
			populate : 'visitor handleUser'
		}))
		.post(null,
			adviceValidator.validateCreation,
			[adviceCtrl.adviceCreateTransformer],
			routeModel.create);

	easyRouter.route('/api/advice/:id')
		.put(auth.systemResource,
			adviceValidator.validateUpdate,
			adviceCtrl.adviceUpdateTransformer,
			routeModel.update);

	easyRouter.route('/api/advice/excel')
		.get(adviceCtrl.adviceExport);

	// ===============================================app==============================================
	easyRouter.route('/api/app/advice/me')
		.get(auth.visitorResource, routeModel.all.custom({
			condition: function (req) {
				return {
					visitor    : req.visitor._id,
					messageType: 'user'
				};
			},
			needCount: true,
			limit    : 20,
			sort     : '-_id',
			fields   : {
				_id          : 1,
				uploadTime   : 1,
				message      : 1,
				handleState  : 1,
				handleMessage: 1
			}
		}));

	easyRouter.route('/api/app/advice')
		.post(auth.visitorResource,
			adviceValidator.validateCreation,
			[adviceCtrl.adviceCreateTransformer],
			routeModel.create);
};