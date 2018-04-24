'use strict';
/**
 * Created by Koan on 17/9/27.
 */
var auth = require('../utils/authentication'),
	imageValidator = require('../validators/request/image'),
	imageCtrl = require('../controllers/image'),
	upload = require('../middlewares/upload');

module.exports = function (easyRouter) {

	easyRouter.route('/api/images')
		.use(upload.array('file', 1))
		.post(auth.systemResource,
			imageValidator.validateSingleUpload,
			imageCtrl.imageUpload);

	easyRouter.route('/api/images/:id')
		.get(function (req, res, next) {
			res.redirect(301, `/images/${req.params.id}`);
		})
		.del(auth.systemResource, imageCtrl.removeImage);

	easyRouter.route('/images/:id')
		.get(imageCtrl.getImage);
};
