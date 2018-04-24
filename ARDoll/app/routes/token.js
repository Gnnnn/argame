'use strict';
/**
 * Created by Koan on 2017.9.21
 */

var tokenCtrl = require('../controllers/token'),
	User = require('../models/user');

module.exports = function (easyRouter) {

	easyRouter.route('/api/token/user')
		.post(null, null, tokenCtrl.allTransformer, tokenCtrl.createTokenFactory(User));
};