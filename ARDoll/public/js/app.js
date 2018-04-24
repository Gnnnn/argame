'use strict';
import React from 'react';
import {render} from 'react-dom';
import Root from './jsx/Root';
import configureStore from './store';
import history from './history';
import {syncHistoryWithStore} from 'react-router-redux';
import {tsSelect} from './utils';

require('../css/index.scss');

const initialState = window.__INITIAL_STATE__;
const store = configureStore(initialState);
let syncHistory = syncHistoryWithStore(history, store, {selectLocationState: state=>tsSelect.route.toJS(state)});
render(<Root store = {store} history = {syncHistory}/>, document.getElementById('root'));