/**
 * Created by Koan on 2017/9/27.
 */
'use strict';
var auth = require('../utils/authentication'),
	fileValidator = require('../validators/request/file'),
	fileCtrl = require('../controllers/file'),
	upload = require('../middlewares/upload');

module.exports = function (easyRouter) {

	easyRouter.route('/api/files')
		.use(upload.array('file', 1))
		.post(auth.systemResource,
			fileValidator.validateSingleUpload,
			fileCtrl.fileUpload);

	easyRouter.route('/api/files/:id')
		.get(function (req, res, next) {
			res.redirect(301, `/files/${req.params.id}`);
		})
		.del(auth.systemResource, fileCtrl.removeFile);

	easyRouter.route('/files/:id')
		.get(fileCtrl.getFile);
};