/**
 * Created by admin on 2017/11/20.
 */
'use strict';

import React from 'react';
import Pagination from 'rc-pagination';
import {connect} from 'react-redux';
import {loadDollMachines} from '../../actions/api';
import {openDollMachine} from '../../actions/client';
import {dateHelper, appConfigs} from '../../utils';

const DollMachinePage = React.createClass({
	handleChangePage(page) {
		this.props.loadDollMachines(page);
	},
	handleRowClick(dollMachineId) {
		this.props.openDollMachine(dollMachineId);
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
							<td>{dollMachine.get('thumbnail') ?
							     <span>√</span> :
							     <span>×</span>}
							</td>
							<td>{dollMachine.get('document') ?
							     <span>√</span> :
							     <span>×</span>}
							</td>
							<td>{dollMachine.get('androidDocument') ?
							     <span>√</span> :
							     <span>×</span>}
							</td>
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
				<small>#可点击列表行进行娃娃机的查询和修改，但不能删除；可点击右下角“+”按钮添加新娃娃</small>
				<hr/>
				<table>
					<thead>
					<tr>
						<th width = "150">名称</th>
						<th width = "250">描述</th>
						<th width = "50">图片</th>
						<th width = "50">IOS</th>
						<th width = "50">android</th>
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
						<button className = "button postfix tc-circle"
						        onClick = {this.handleRowClick.bind(null, null)}>+
						</button>
					</div>
				</div>
			</div>
		);
	},
	componentWillReceiveProps(nextProps) {
		if (nextProps.loginUserId && this.props.loginUserId !== nextProps.loginUserId) {
			this.props.loadDollMachines(1);
		}
	},
	render() {
		return (
			<div>
				{this.renderTable()}
			</div>
		);
	},
	componentDidMount() {
		if (this.props.loginUserId) {
			this.props.loadDollMachines(1);
		}
	}
});

function mapStateToProps(state) {
	return {
		loginUserId           : state.getIn(['app', 'loginData', 'loginUserId']),
		users                 : state.getIn(['data', 'users']),
		dollMachines          : state.getIn(['data', 'dollMachines']),
		loadedDollMachines    : state.getIn(['data', 'loadedDollMachines']),
		dollMachineCount      : state.getIn(['data', 'dollMachineCount']),
		dollMachineCurrentPage: state.getIn(['data', 'dollMachineCurrentPage']),
		onSending             : state.getIn(['app', 'appInfo', 'onSending'])
	};
}

export default connect(mapStateToProps, {
	loadDollMachines,
	openDollMachine
})(DollMachinePage);