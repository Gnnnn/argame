'use strict';
/**
 * Created by Koan on 2017.9.21
 */

var User = require('../models/user'),
	userCtrl = require('../controllers/user'),
	userValidator = require('../validators/request/user'),
	auth = require('../utils/authentication');

module.exports = function (easyRouter) {

	var routeModel = easyRouter.fromModel(User);

	easyRouter.route('/api/users')
		.get(auth.systemResource, routeModel.all.custom({
			queryPick: ['name', 'nameLower', 'role']
		}))
		// auth,vali,transform,handler
		.post(auth.systemResource,
			userValidator.validateCreation,
			[userCtrl.userAllTransformer, userCtrl.userCreateTransformer],
			routeModel.create);

	easyRouter.route('/api/users/me')
		.get(auth.userResource, userCtrl.getMe)
		.put(auth.userResource,
			userValidator.validateModification,
			[userCtrl.userAllTransformer, userCtrl.userSelfUpdateTransformer],
			function (req, callback) {
				userCtrl.userUpdate(req.me._id, req.body, callback);
			});

	easyRouter.route('/api/users/:id')
		.get(auth.userResource, routeModel.one.custom({}))
		.del(auth.systemResource, routeModel.del);
};