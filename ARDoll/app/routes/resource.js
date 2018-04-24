/**
 * Created by Koan on 2018/1/11.
 */
'use strict';

var resourceCtrl = require('../controllers/resource');

module.exports = function (easyRouter) {
	easyRouter.route('/resources/:name')
		.get(resourceCtrl.getResource);
};