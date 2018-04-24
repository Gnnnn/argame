'use strict';
/**
 * Created by Koan on 2017.9.25
 */
import createHistory from 'history/lib/createBrowserHistory';

let history;
if (process.browser) {
	history = createHistory();
}

export default history;