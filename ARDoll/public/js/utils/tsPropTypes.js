'use strict';
/**
 * Created by Koan on 2017.9.25
 */
import {PropTypes} from 'react';
import ImPropTypes from 'react-immutable-proptypes';

const user = ImPropTypes.contains({
	_id : PropTypes.string.isRequired,
	name: PropTypes.string.isRequired
});

export default {
	user,
	users           : ImPropTypes.mapOf(user)
};