/**
 * Created by admin on 2017/11/20.
 */
'use strict';

import React from 'react';
import Pagination from 'rc-pagination';
import {connect} from 'react-redux';
import {loadDollMachinePaws} from '../../actions/api';
import {openDollMachinePaw} from '../../actions/client';
import {dateHelper, appConfigs} from '../../utils';

const DollMachinePawPage = React.createClass({
	handleChangePage(page) {
		this.props.loadDollMachinePaws(page);
	},
	handleRowClick(dollMachinePawId) {
		this.props.openDollMachinePaw(dollMachinePawId);
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
							<td>{dollMachinePaw.get('thumbnail') ?
							     <span>√</span> :
							     <span>×</span>}
							</td>
							<td>{dollMachinePaw.get('document') ?
							     <span>√</span> :
							     <span>×</span>}
							</td>
							<td>{dollMachinePaw.get('androidDocument') ?
							     <span>√</span> :
							     <span>×</span>}
							</td>
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
				<small>#可点击列表行进行娃娃机爪子的查询和修改，但不能删除；可点击右下角“+”按钮添加新娃娃</small>
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
						<Pagination onChange = {this.handleChangePage} current = {dollMachinePawCurrentPage}
						            pageSize = {appConfigs.dollMachinePawCountPrePage}
						            total = {dollMachinePawCount}/>
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
			this.props.loadDollMachinePaws(1);
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
			this.props.loadDollMachinePaws(1);
		}
	}
});

function mapStateToProps(state) {
	return {
		loginUserId              : state.getIn(['app', 'loginData', 'loginUserId']),
		users                    : state.getIn(['data', 'users']),
		dollMachinePaws          : state.getIn(['data', 'dollMachinePaws']),
		loadedDollMachinePaws    : state.getIn(['data', 'loadedDollMachinePaws']),
		dollMachinePawCount      : state.getIn(['data', 'dollMachinePawCount']),
		dollMachinePawCurrentPage: state.getIn(['data', 'dollMachinePawCurrentPage']),
		onSending                : state.getIn(['app', 'appInfo', 'onSending'])
	};
}

export default connect(mapStateToProps, {
	loadDollMachinePaws,
	openDollMachinePaw
})(DollMachinePawPage);