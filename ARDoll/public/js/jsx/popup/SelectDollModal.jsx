/**
 * Created by admin on 2017/11/20.
 */
'use strict';

import React from 'react';
import ReactPureRenderMixin from 'react-addons-pure-render-mixin';
import {Modal} from '../component';
import Pagination from 'rc-pagination';
import {connect} from 'react-redux';
import {loadDolls} from '../../actions/api';
import {closeDollSelectModal} from '../../actions/client';
import {constants, dateHelper, appConfigs} from '../../utils';

let customStyles = {
	content: {
		width    : '900px',
		height   : '750px',
		marginTop: '110px'
	}
};

const SelectDollModal = React.createClass({
	displayName: 'SelectDollModal',
	mixins     : [ReactPureRenderMixin],
	afterOpenFn() {
		this.props.loadDolls(1);
	},
	handleChangePage(page) {
		this.props.loadDolls(page);
	},
	handleRowClick(dollId) {
		if (this.props.rowClick) {
			this.props.rowClick(dollId);
		}
		this.props.closeDollSelectModal();
	},
	handleClose() {
		this.props.closeDollSelectModal();
	},
	renderTable() {
		let {users, dolls, loadedDolls, dollCount, dollCurrentPage} = this.props,
			trs = [];
		dollCurrentPage = dollCurrentPage || 1;
		if (loadedDolls && loadedDolls.size > 0) {
			trs = loadedDolls.toArray().map((dollId) => {
				let doll = dolls.get(dollId);
				if (doll) {
					let uploadUserId = doll.get('uploadUser'),
						lastModifiedUserId = doll.get('lastModifiedUser'),
						uploadUser,
						lastModifiedUser;
					if (users) {
						uploadUser = users.getIn([uploadUserId, 'name']);
						lastModifiedUser = users.getIn([lastModifiedUserId, 'name']);
					}
					return (
						<tr key = {doll.get('_id')} onClick = {this.handleRowClick.bind(null, doll.get('_id'))}>
							<td><input value = {doll.get('name')} readOnly = "readonly"/></td>
							<td><input value = {doll.get('description')} readOnly = "readonly"/></td>
							<td><input value = {lastModifiedUser} readOnly = "readonly"/></td>
							<td><input
								value = {dateHelper.format(doll.get('lastModifiedTime'), 'yyyy-MM-dd HH:mm')}
								readOnly = "readonly"/>
							</td>
							<td><input value = {doll.get('cost')} readOnly = "readonly"/></td>
						</tr>
					);
				}
			});
		}
		return (
			<div>
				<table>
					<thead>
					<tr>
						<th width = "150">名称</th>
						<th width = "350">描述</th>
						<th width = "100">修改人</th>
						<th width = "150">修改时间</th>
						<th width = "60">成本</th>
					</tr>
					</thead>
					<tbody>
					{trs}
					</tbody>
				</table>
				<div className = "rows">
					<div className = "large-11 columns">
						<Pagination onChange = {this.handleChangePage} current = {dollCurrentPage}
						            pageSize = {appConfigs.dollCountPrePage}
						            total = {dollCount}/>
					</div>
					<div className = "large-1 columns">
						<button className = "button postfix tc-circle"
						        onClick = {this.handleClose}>取消
						</button>
					</div>
				</div>
			</div>
		);
	},
	render() {
		let isActive = this.props.isActive;
		return (
			<Modal isOpen = {isActive} onAfterOpen = {this.afterOpenFn} modalName = "SelectDollModal"
			       style = {customStyles}>
				{this.renderTable()}
			</Modal>
		);
	}
});

function mapStateToProps(state) {
	return {
		isActive       : state.getIn(['app', 'appInfo', 'modals', constants.MODAL_SELECT_DOLL]),
		users          : state.getIn(['data', 'users']),
		dolls          : state.getIn(['data', 'dolls']),
		loadedDolls    : state.getIn(['data', 'loadedDolls']),
		dollCount      : state.getIn(['data', 'dollCount']),
		dollCurrentPage: state.getIn(['data', 'dollCurrentPage'])
	};
}

export default connect(mapStateToProps, {
	loadDolls,
	closeDollSelectModal
})(SelectDollModal);