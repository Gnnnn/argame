/**
 * Created by Koan on 2017/12/1.
 */
'use strict';

var playRecordCtrl = require('../controllers/playRecord'),
	PlayRecord = require('../models/playRecord'),
	auth = require('../utils/authentication');

module.exports = function (easyRouter) {
	var routeModel = easyRouter.fromModel(PlayRecord);

	// ===============================================app==============================================
	easyRouter.route('/api/app/playRecords/me')
		.get(auth.visitorResource, routeModel.all.custom({
			condition: function (req) {
				return {
					visitor: req.visitor._id
				};
			},
			fields   : {
				_id       : 1,
				room      : 1,
				time      : 1,
				cost      : 1,
				succeedFlg: 1
			},
			needCount: true,
			limit    : 20,
			sort     : '-_id',
			populate : [
				{
					path  : 'room',
					select: 'name'
				}
			]
		}));

	easyRouter.route('/api/app/pointRecords/me')
		.get(auth.visitorResource, routeModel.all.custom({
			condition: function (req) {
				return {
					visitor: req.visitor._id,
					point  : {$gt: 0}
				};
			},
			fields   : {
				_id  : 1,
				room : 1,
				time : 1,
				point: 1
			},
			needCount: true,
			limit    : 20,
			sort     : '-_id',
			populate : [
				{
					path  : 'room',
					select: 'name'
				}
			]
		}));

	easyRouter.route('/api/app/playRecords/:id/share')
		.post(auth.visitorResource, playRecordCtrl.share);

	easyRouter.route('/api/app/playRecords/me/success')
		.get(auth.visitorResource, routeModel.all.custom({
			condition: function (req) {
				return {
					visitor   : req.visitor._id,
					succeedFlg: true
				};
			},
			fields   : {
				_id : 1,
				room: 1,
				time: 1
			},
			needCount: true,
			limit    : 20,
			sort     : '-_id',
			populate : [
				{
					path  : 'room',
					select: 'name'
				}
			]
		}));

	easyRouter.route('/api/app/playRecords/:id/confirm')
		.put(auth.visitorResource, playRecordCtrl.confirm);

	easyRouter.route('/api/app/playRecords/all/success')
		.get(auth.visitorResource, playRecordCtrl.getAllSuccess(routeModel.all.custom({
			condition: function (req) {
				return {
					succeedFlg: true
				};
			},
			fields   : {
				_id    : 1,
				room   : 1,
				time   : 1,
				visitor: 1
			},
			needCount: true,
			limit    : 10,
			sort     : '-_id',
			populate : [
				{
					path  : 'room',
					select: 'name'
				},
				{
					path  : 'visitor',
					select: 'name'
				}
			]
		})));
};