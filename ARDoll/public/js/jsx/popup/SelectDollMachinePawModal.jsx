/**
 * Created by admin on 2017/11/20.
 */
'use strict';

import React from 'react';
import ReactPureRenderMixin from 'react-addons-pure-render-mixin';
import {Modal} from '../component';
import Pagination from 'rc-pagination';
import {connect} from 'react-redux';
import {loadDollMachinePaws} from '../../actions/api';
import {closeDollMachinePawSelectModal} from '../../actions/client';
import {constants, dateHelper, appConfigs} from '../../utils';

let customStyles = {
	content: {
		width    : '900px',
		height   : '750px',
		marginTop: '110px'
	}
};

const SelectDollMachinePawModal = React.createClass({
	displayName: 'SelectDollMachinePawModal',
	mixins     : [ReactPureRenderMixin],
	afterOpenFn() {
		this.props.loadDollMachinePaws(1);
	},
	handleChangePage(page) {
		this.props.loadDollMachinePaws(page);
	},
	handleRowClick(dollMachinePawId) {
		if (this.props.rowClick) {
			this.props.rowClick(dollMachinePawId);
		}
		this.props.closeDollMachinePawSelectModal();
	},
	handleClose() {
		this.props.closeDollMachinePawSelectModal();
	},
	renderTable() {
		let {users, dollMachinePaws, loadedDollMachinePaws, dollMachinePawCount, dollMachinePawCurrentPage} = this.props,
			trs = [];
		dollMachinePawCurrentPage = dollMachinePawCurrentPage || 1;
		if (loadedDollMachinePaws && loadedDollMachinePaws.size > 0) {
			trs = loadedDollMachinePaws.toArray().map((dollMachinePawId) => {
				let dollMachinePaw = dollMachinePaws.get(dollMachinePawId);
				if (dollMachinePaw) {
					let uploadUserId = dollMachinePaw.get('uploadUser'),
						lastModifiedUserId = dollMachinePaw.get('lastModifiedUser'),
						uploadUser,
						lastModifiedUser;
					if (users) {
						uploadUser = users.getIn([uploadUserId, 'name']);
						lastModifiedUser = users.getIn([lastModifiedUserId, 'name']);
					}
					return (
						<tr key = {dollMachinePaw.get('_id')}
						    onClick = {this.handleRowClick.bind(null, dollMachinePaw.get('_id'))}>
							<td><input value = {dollMachinePaw.get('name')} readOnly = "readonly"/></td>
							<td><input value = {dollMachinePaw.get('description')} readOnly = "readonly"/></td>
							<td><input value = {lastModifiedUser} readOnly = "readonly"/></td>
							<td><input
								value = {dateHelper.format(dollMachinePaw.get('lastModifiedTime'), 'yyyy-MM-dd HH:mm')}
								readOnly = "readonly"/>
							</td>
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
						<th width = "250">描述</th>
						<th width = "100">修改人</th>
						<th width = "150">修改时间</th>
					</tr>
					</thead>
					<tbody>
					{trs}
					</tbody>
				</table>
				<div className = "rows">
					<div className = "large-11 columns">
						<Pagination onChange = {this.handleChangePage} current = {dollMachinePawCurrentPage}
						            pageSize = {appConfigs.dollMachinePawCountPrePage}
						            total = {dollMachinePawCount}/>
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
			<Modal isOpen = {isActive} onAfterOpen = {this.afterOpenFn} modalName = "SelectDollMachineModal"
			       style = {customStyles}>
				{this.renderTable()}
			</Modal>
		);
	}
});

function mapStateToProps(state) {
	return {
		isActive                 : state.getIn(['app', 'appInfo', 'modals', constants.MODAL_SELECT_DOLL_MACHINE_PAW]),
		users                    : state.getIn(['data', 'users']),
		dollMachinePaws          : state.getIn(['data', 'dollMachinePaws']),
		loadedDollMachinePaws    : state.getIn(['data', 'loadedDollMachinePaws']),
		dollMachinePawCount      : state.getIn(['data', 'dollMachinePawCount']),
		dollMachinePawCurrentPage: state.getIn(['data', 'dollMachinePawCurrentPage'])
	};
}

export default connect(mapStateToProps, {
	loadDollMachinePaws,
	closeDollMachinePawSelectModal
})(SelectDollMachinePawModal);