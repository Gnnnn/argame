/**
 * Created by Koan on 2017/9/28.
 */
'use strict';

var announcementCtrl = require('../controllers/announcement'),
	appCtrl = require('../controllers/app'),
	Announcement = require('../models/announcement'),
	announcementValidator = require('../validators/request/announcement'),
	auth = require('../utils/authentication');

module.exports = function (easyRouter) {
	var routeModel = easyRouter.fromModel(Announcement);

	easyRouter.route('/api/announcements')
		.get(auth.systemResource, routeModel.all.custom({
			needCount: true,
			limit    : 20,
			sort     : '-_id',
			populate : 'uploadUser lastModifiedUser'
		}))
		.post(auth.systemResource,
			announcementValidator.validateCreation,
			announcementCtrl.announcementCreateTransformer,
			appCtrl.reRestructPlayInfoAfterUpdate(routeModel.create));

	easyRouter.route('/api/announcements/:id')
		.get(auth.systemResource, routeModel.one.custom({
			populate: 'uploadUser lastModifiedUser'
		}))
		.put(auth.systemResource,
			announcementValidator.validateUpdate,
			announcementCtrl.announcementUpdateTransformer,
			appCtrl.reRestructPlayInfoAfterUpdate(routeModel.update))
		.del(auth.systemResource, appCtrl.reRestructPlayInfoAfterUpdate(routeModel.del));

	// ===============================================app==============================================
	easyRouter.route('/api/app/announcements')
		.get(routeModel.all.custom({
			fields  : {
				_id             : 1,
				title           : 1,
				tag             : 1,
				lastModifiedUser: 1,
				lastModifiedTime: 1,
				thumbnail       : 1,
				image           : 1
			},
			sort    : '-_id',
			populate: ['lastModifiedUser', 'name']
		}));

	easyRouter.route('/api/app/announcements/:id')
		.get(routeModel.one.custom({
			fields  : {
				_id             : 1,
				title           : 1,
				tag             : 1,
				lastModifiedUser: 1,
				lastModifiedTime: 1,
				thumbnail       : 1,
				image           : 1
			},
			populate: ['lastModifiedUser', 'name']
		}));
};