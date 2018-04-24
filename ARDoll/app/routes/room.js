/**
 * Created by Koan on 2017/11/20.
 */
'use strict';

var roomCtrl = require('../controllers/room'),
	appCtrl = require('../controllers/app'),
	Room = require('../models/room'),
	roomValidator = require('../validators/request/room'),
	auth = require('../utils/authentication');

module.exports = function (easyRouter) {
	var routeModel = easyRouter.fromModel(Room);

	easyRouter.route('/api/rooms')
		.get(auth.systemResource, routeModel.all.custom({
			needCount: true,
			limit    : 12,
			sort     : '-_id',
			populate : 'uploadUser lastModifiedUser doll dollMachine dollMachinePaw category tag'
		}))
		.post(auth.systemResource,
			roomValidator.validateCreation,
			roomCtrl.roomCreateTransformer,
			appCtrl.reRestructPlayInfoAfterUpdate(routeModel.create));

	easyRouter.route('/api/rooms/:id')
		.get(auth.systemResource, routeModel.one.custom({
			populate: 'uploadUser lastModifiedUser doll dollMachine dollMachinePaw category tag'
		}))
		.put(auth.systemResource,
			roomValidator.validateUpdate,
			roomCtrl.roomUpdateTransformer,
			appCtrl.reRestructPlayInfoAfterUpdate(routeModel.update));
};