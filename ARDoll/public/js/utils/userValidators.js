'use strict';

import validator from '../../../app/validators/user';

const validators = {
	validateUser(value) {
		var error = validator.validateName(value);
		if (error) {
			return error;
		}
	},
	validatePassword(value) {
		return validator.validatePassword(value);
	},
	validateConfirmedPassword(value, firstPass) {
		if (value !== firstPass) {
			return '与首次输入密码不一致';
		}
		return null;
	}
};
export default validators;