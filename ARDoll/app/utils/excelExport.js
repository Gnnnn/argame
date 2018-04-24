/**
 * Created by Koan on 2017/10/20.
 */
'use strict';

var _ = require('lodash'),
	nodeExcel = require('excel-export'),
	path = require('path');

function ExcelExport() {

}

ExcelExport.prototype = {};
ExcelExport.prototype.constructor = ExcelExport;

_.extend(ExcelExport.prototype, {
	exportExcel: function (sheetName, cols, rows) {
		var conf = {},
			styleFilePath = path.resolve(__dirname, '../config/excelStyles.xml');
		conf.stylesXmlFile = styleFilePath;
		conf.name = sheetName || 'Sheet1';
		conf.cols = cols || [];
		conf.rows = rows || [];
		return nodeExcel.execute(conf);
	}
});

module.exports = ExcelExport;