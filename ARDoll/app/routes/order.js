/**
 * Created by Koan on 2017/12/13.
 */
'use strict';

var orderCtrl = require('../controllers/order'),
	Order = require('../models/order'),
	orderValidator = require('../validators/request/order'),
	auth = require('../utils/authentication');

module.exports = function (easyRouter) {
	var routeModel = easyRouter.fromModel(Order);

	easyRouter.route('/api/orders')
		.get(routeModel.all.custom({
			needCount: true,
			limit    : 20,
			sort     : '-_id',
			populate : [
				{
					path: 'visitor'
				},
				{
					path: 'handleUser'
				},
				{
					path    : 'playRecord',
					populate: [
						{
							path: 'room'
						}
					]
				},
				{
					path: 'pointMall',
				}
			]
		}));

	easyRouter.route('/api/orders/:id')
		.put(auth.systemResource,
			orderValidator.validateUpdate,
			orderCtrl.orderUpdateTransformer,
			routeModel.update);

	// ===============================================app==============================================
	easyRouter.route('/api/app/orders/me')
		.get(auth.visitorResource, routeModel.all.custom({
			condition: function (req) {
				return {
					visitor: req.visitor._id
				};
			},
			needCount: true,
			limit    : 20,
			sort     : '-_id',
			fields   : {
				_id           : 1,
				time          : 1,
				playRecord    : 1,
				pointMall     : 1,
				consumePoint  : 1,
				address       : 1,
				cellPhone     : 1,
				consignee     : 1,
				state         : 1,
				expressCompany: 1,
				expressNo     : 1
			},
			populate : [
				{
					path    : 'playRecord',
					select  : 'room',
					populate: [
						{
							path  : 'room',
							select: 'name'
						}
					]
				},
				{
					path  : 'pointMall',
					select: 'name'
				}
			]
		}));


	easyRouter.route('/api/app/orders/:id')
		.put(auth.visitorResource,
			orderValidator.validateCreation,
			[orderCtrl.orderCreateTransformer],
			orderCtrl.orderVisitorUpdate);

	easyRouter.route('/api/app/orders/pointMall/:id')
		.post(auth.visitorResource,
			orderValidator.validateCreation,
			[orderCtrl.orderCreateTransformer],
			orderCtrl.orderPointMallCreate);

	easyRouter.route('/api/app/orders/pointMall/me')
		.get(auth.visitorResource,
			routeModel.all.custom({
				condition: function (req) {
					return {
						visitor     : req.visitor._id,
						consumePoint: {$gt: 0},
					};
				},
				needCount: true,
				limit    : 20,
				sort     : '-_id',
				fields   : {
					_id         : 1,
					time        : 1,
					pointMall   : 1,
					consumePoint: 1
				},
				populate : [
					{
						path  : 'pointMall',
						select: 'name'
					}
				]
			}));
};