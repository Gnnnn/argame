/**
 * Created by admin on 2017/11/20.
 */
'use strict';

import React from 'react';
import ReactPureRenderMixin from 'react-addons-pure-render-mixin';
import {Modal} from '../component';
import Pagination from 'rc-pagination';
import {connect} from 'react-redux';
import {loadDollMachines} from '../../actions/api';
import {closeDollMachineSelectModal} from '../../actions/client';
import {constants, dateHelper, appConfigs} from '../../utils';

let customStyles = {
	content: {
		width    : '900px',
		height   : '750px',
		marginTop: '110px'
	}
};

const SelectDollMachineModal = React.createClass({
	displayName: 'SelectDollMachineModal',
	mixins     : [ReactPureRenderMixin],
	afterOpenFn() {
		this.props.loadDollMachines(1);
	},
	handleChangePage(page) {
		this.props.loadDollMachines(page);
	},
	handleRowClick(dollMachineId) {
		if (this.props.rowClick) {
			this.props.rowClick(dollMachineId);
		}
		this.props.closeDollMachineSelectModal();
	},
	handleClose() {
		this.props.closeDollMachineSelectModal();
	},
	renderTable() {
		let {users, dollMachines, loadedDollMachines, dollMachineCount, dollMachineCurrentPage} = this.props,
			trs = [];
		dollMachineCurrentPage = dollMachineCurrentPage || 1;
		if (loadedDollMachines && loadedDollMachines.size > 0) {
			trs = loadedDollMachines.toArray().map((dollMachineId) => {
				let dollMachine = dollMachines.get(dollMachineId);
				if (dollMachine) {
					let uploadUserId = dollMachine.get('uploadUser'),
						lastModifiedUserId = dollMachine.get('lastModifiedUser'),
						uploadUser,
						lastModifiedUser;
					if (users) {
						uploadUser = users.getIn([uploadUserId, 'name']);
						lastModifiedUser = users.getIn([lastModifiedUserId, 'name']);
					}
					return (
						<tr key = {dollMachine.get('_id')}
						    onClick = {this.handleRowClick.bind(null, dollMachine.get('_id'))}>
							<td><input value = {dollMachine.get('name')} readOnly = "readonly"/></td>
							<td><input value = {dollMachine.get('description')} readOnly = "readonly"/></td>
							<td><input value = {lastModifiedUser} readOnly = "readonly"/></td>
							<td><input
								value = {dateHelper.format(dollMachine.get('lastModifiedTime'), 'yyyy-MM-dd HH:mm')}
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
						<th width = "350">描述</th>
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
						<Pagination onChange = {this.handleChangePage} current = {dollMachineCurrentPage}
						            pageSize = {appConfigs.dollMachineCountPrePage}
						            total = {dollMachineCount}/>
					</div>
					<div className = "large-1 columns">
						<button className = "button postfix tc-circle" onClick = {this.handleClose}>取消
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
		isActive              : state.getIn(['app', 'appInfo', 'modals', constants.MODAL_SELECT_DOLL_MACHINE]),
		users                 : state.getIn(['data', 'users']),
		dollMachines          : state.getIn(['data', 'dollMachines']),
		loadedDollMachines    : state.getIn(['data', 'loadedDollMachines']),
		dollMachineCount      : state.getIn(['data', 'dollMachineCount']),
		dollMachineCurrentPage: state.getIn(['data', 'dollMachineCurrentPage'])
	};
}

export default connect(mapStateToProps, {
	loadDollMachines,
	closeDollMachineSelectModal
})(SelectDollMachineModal);