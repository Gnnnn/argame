'use strict';
/**
 * Created by gogoout on 16/4/17.
 */
import Resourzes,{schemas} from '../utils/tsResourzes';
import assign from 'lodash/assign';
import omit from 'lodash/omit';

export default store => next => action => {
	const schema = action.meta && action.meta.schema;
	if (schema) {
		action = assign({}, omit(action, 'meta'), {meta: omit(action.meta, 'schema')});
	}
	next(action);
};