/**
 * Created by admin on 2017/10/11.
 */
'use strict';

import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Pagination from 'rc-pagination';
import {loadNotices} from '../../actions/api';
import {openNotice, delNotice} from '../../actions/client';
import {dateHelper, appConfigs} from '../../utils';

const NoticePage = React.createClass({
	handleChangePage(page) {
		this.props.loadNotices(page);
	},
	handleRowClick(noticeId) {
		this.props.openNotice(noticeId);
	},
	handleDelClick(noticeId, e) {
		e.preventDefault();
		e.stopPropagation();
		let page = this.props.noticeCurrentPage;
		if (this.props.loadedNotices.size === 1) {
			page = page > 1 ? page - 1 : 1;
		}
		this.props.delNotice(noticeId, page);
	},
	componentWillReceiveProps(nextProps) {
		if (nextProps.loginUserId && this.props.loginUserId !== nextProps.loginUserId) {
			this.props.loadNotices(1);
		}
	},
	renderTable() {
		let {users, notices, loadedNotices, noticeCount, noticeCurrentPage} = this.props,
			trs = [];
		noticeCurrentPage = noticeCurrentPage || 1;
		if (loadedNotices && loadedNotices.size > 0) {
			trs = loadedNotices.toArray().map((noticeId) => {
				let notice = notices.get(noticeId);
				if (notice) {
					let uploadUserId = notice.get('uploadUser'),
						lastModifiedUserId = notice.get('lastModifiedUser'),
						uploadUser,
						lastModifiedUser;
					if (users) {
						uploadUser = users.getIn([uploadUserId, 'name']);
						lastModifiedUser = users.getIn([lastModifiedUserId, 'name']);
					}
					return (
						<tr key = {notice.get('_id')} onClick = {this.handleRowClick.bind(null, notice.get('_id'))}>
							<td><input value = {notice.get('title')} readOnly = "readonly"/></td>
							<td><input value = {uploadUser} readOnly = "readonly"/></td>
							<td><input value = {dateHelper.format(notice.get('uploadTime'), 'yyyy-MM-dd HH:mm')}
							           readOnly = "readonly"/></td>
							<td><input value = {lastModifiedUser} readOnly = "readonly"/></td>
							<td><input
								value = {dateHelper.format(notice.get('lastModifiedTime'), 'yyyy-MM-dd HH:mm')}
								readOnly = "readonly"/></td>
							<td>
								<button className = "tiny button alert col-btn"
								        onClick = {this.handleDelClick.bind(null, notice.get('_id'))}>X
								</button>
							</td>
						</tr>
					);
				}
			});
		}
		return (
			<div>
				<small>#可点击列表行进行公告的查询和修改；点击右下角“+”按钮发布新公告</small>
				<hr/>
				<table>
					<thead>
					<tr>
						<th width = "250">标题</th>
						<th width = "100">发布人</th>
						<th width = "150">发布时间</th>
						<th width = "100">最后修改人</th>
						<th width = "150">最后修改时间</th>
						<th width = "50">删除</th>
					</tr>
					</thead>
					<tbody>
					{trs}
					</tbody>
				</table>
				<div className = "rows">
					<div className = "large-11 columns">
						<Pagination onChange = {this.handleChangePage} current = {noticeCurrentPage}
						            pageSize = {appConfigs.noticeCountPrePage}
						            total = {noticeCount}/>
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
				{this.renderTable()}
			</div>
		);
	},
	componentDidMount() {
		if (this.props.loginUserId) {
			this.props.loadNotices(1);
		}
	}
});

function mapStateToProps(state) {
	return {
		loginUserId      : state.getIn(['app', 'loginData', 'loginUserId']),
		users            : state.getIn(['data', 'users']),
		notices          : state.getIn(['data', 'notices']),
		loadedNotices    : state.getIn(['data', 'loadedNotices']),
		noticeCount      : state.getIn(['data', 'noticeCount']),
		noticeCurrentPage: state.getIn(['data', 'noticeCurrentPage']),
		onSending        : state.getIn(['app', 'appInfo', 'onSending'])
	};
}

export default connect(mapStateToProps, {
	loadNotices,
	openNotice,
	delNotice
})(NoticePage);