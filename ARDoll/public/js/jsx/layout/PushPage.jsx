/**
 * Created by admin on 2017/10/16.
 */
'use strict';

import React from 'react';
import {connect} from 'react-redux';
import Pagination from 'rc-pagination';
import {loadPush} from '../../actions/api';
import {openPush} from '../../actions/client';
import {dateHelper, appConfigs} from '../../utils';

const PUSH_TYPES = {
	SYSTEM_UPDATA: '系统更新',
	ACTIVITY     : '活动',
	NEW_DOLL     : '新增娃娃'
};

const PushPage = React.createClass({
	handleRowClick(pushId) {
		this.props.openPush(pushId);
	},
	handleCreate(e) {
		var newPush = {
			type       : this.refs.type.value,
			title      : this.refs.title.value,
			description: this.refs.description.value,
			expiry     : this.refs.expiry.value,
			schedule   : this.state.schedule
		};
		this.props.createPush(newPush, this.clearRefsValues);
	},
	handleChangePage(page) {
		this.props.loadPush(page);
	},
	componentWillReceiveProps(nextProps) {
		if (nextProps.loginUserId && this.props.loginUserId !== nextProps.loginUserId) {
			this.props.loadPush(1);
		}
	},
	renderTable() {
		let {users, pushes, loadedPushes, pushCount, pushCurrentPage} = this.props,
			trs = [];
		pushCurrentPage = pushCurrentPage || 1;
		if (loadedPushes && loadedPushes.size > 0) {
			trs = loadedPushes.toArray().map((pushId) => {
				let push = pushes.get(pushId);
				if (push) {
					let userId = push.get('user'),
						userName;
					if (users) {
						userName = users.getIn([userId, 'name']);
					}
					return (
						<tr key = {push.get('_id')} onClick = {this.handleRowClick.bind(null, push.get('_id'))}>
							<td><input value = {PUSH_TYPES[push.get('type')] || ''} readOnly = "readonly"/></td>
							<td><input value = {push.get('title') || ''} readOnly = "readonly"/></td>
							<td><input value = {push.get('description') || ''} readOnly = "readonly"/></td>
							<td><input value = {dateHelper.format(push.get('schedule'), 'yyyy-MM-dd HH:mm')}
							           readOnly = "readonly"/></td>
							<td><input value = {push.get('expiry') || 0} readOnly = "readonly"/></td>
							<td><input value = {userName || ''} readOnly = "readonly"/></td>
							<td><input value = {dateHelper.format(push.get('updateTime'), 'yyyy-MM-dd HH:mm')}
							           readOnly = "readonly"/></td>
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
						<th width = "80">类型</th>
						<th width = "100">标题</th>
						<th width = "250">描述</th>
						<th width = "150">推送时间</th>
						<th width = "50">超时时间</th>
						<th width = "80">发布人</th>
						<th width = "150">发布时间</th>
					</tr>
					</thead>
					<tbody>
					{trs}
					</tbody>
				</table>
				<div className = "rows">
					<div className = "large-11 columns">
						<Pagination onChange = {this.handleChangePage} current = {pushCurrentPage}
						            pageSize = {appConfigs.pushCountPrePage}
						            total = {pushCount}/>
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
	render() {
		return (
			<div>
				<small>#可点击列表行进行未发送推送的修改；点击右下角“+”按钮发布新推送</small>
				<hr/>
				{this.renderTable()}
			</div>
		);
	},
	componentDidMount() {
		if (this.props.loginUserId) {
			this.props.loadPush(1);
		}
	}
});

function mapStateToProps(state) {
	return {
		loginUserId    : state.getIn(['app', 'loginData', 'loginUserId']),
		users          : state.getIn(['data', 'users']),
		pushes         : state.getIn(['data', 'push']),
		loadedPushes   : state.getIn(['data', 'loadedPushes']),
		pushCount      : state.getIn(['data', 'pushCount']),
		pushCurrentPage: state.getIn(['data', 'pushCurrentPage']),
		onSending      : state.getIn(['app', 'appInfo', 'onSending'])
	};
}

export default connect(mapStateToProps, {
	loadPush,
	openPush
})(PushPage);