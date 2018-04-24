/**
 * Created by admin on 2017/10/11.
 */
'use strict';

import React from 'react';
import {connect} from 'react-redux';
import Pagination from 'rc-pagination';
import {loadAnnouncements} from '../../actions/api';
import {openAnnouncement, delAnnouncement} from '../../actions/client';
import {dateHelper, appConfigs} from '../../utils';

const AnnouncementPage = React.createClass({
	handleChangePage(page) {
		this.props.loadAnnouncements(page);
	},
	handleRowClick(announcementId) {
		this.props.openAnnouncement(announcementId);
	},
	handleDelClick(announcementId, e) {
		e.preventDefault();
		e.stopPropagation();
		let page = this.props.announcementCurrentPage;
		if (this.props.loadedAnnouncements.size === 1) {
			page = page > 1 ? page - 1 : 1;
		}
		this.props.delAnnouncement(announcementId, page);
	},
	componentWillReceiveProps(nextProps) {
		if (nextProps.loginUserId && this.props.loginUserId !== nextProps.loginUserId) {
			this.props.loadAnnouncements(1);
		}
	},
	renderTable() {
		let {users, announcements, loadedAnnouncements, announcementCount, announcementCurrentPage} = this.props,
			trs = [];
		announcementCurrentPage = announcementCurrentPage || 1;
		if (loadedAnnouncements && loadedAnnouncements.size > 0) {
			trs = loadedAnnouncements.toArray().map((announcementId) => {
				let announcement = announcements.get(announcementId);
				if (announcement) {
					let uploadUserId = announcement.get('uploadUser'),
						lastModifiedUserId = announcement.get('lastModifiedUser'),
						uploadUser,
						lastModifiedUser;
					if (users) {
						uploadUser = users.getIn([uploadUserId, 'name']);
						lastModifiedUser = users.getIn([lastModifiedUserId, 'name']);
					}
					return (
						<tr key = {announcement.get('_id')}
						    onClick = {this.handleRowClick.bind(null, announcement.get('_id'))}>
							<td><input value = {announcement.get('name')} readOnly = "readonly"/></td>
							<td><input value = {announcement.get('tag')} readOnly = "readonly"/></td>
							<td><input value = {uploadUser} readOnly = "readonly"/></td>
							<td><input value = {dateHelper.format(announcement.get('uploadTime'), 'yyyy-MM-dd HH:mm')}
							           readOnly = "readonly"/></td>
							<td><input value = {lastModifiedUser} readOnly = "readonly"/></td>
							<td><input
								value = {dateHelper.format(announcement.get('lastModifiedTime'), 'yyyy-MM-dd HH:mm')}
								readOnly = "readonly"/></td>
							<td>
								<button className = "tiny button alert col-btn"
								        onClick = {this.handleDelClick.bind(null, announcement.get('_id'))}>X
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
						<th width = "100">标签</th>
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
						<Pagination onChange = {this.handleChangePage} current = {announcementCurrentPage}
						            pageSize = {appConfigs.announcementCountPrePage}
						            total = {announcementCount}/>
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
			this.props.loadAnnouncements(1);
		}
	}
});

function mapStateToProps(state) {
	return {
		loginUserId            : state.getIn(['app', 'loginData', 'loginUserId']),
		users                  : state.getIn(['data', 'users']),
		announcements          : state.getIn(['data', 'announcements']),
		loadedAnnouncements    : state.getIn(['data', 'loadedAnnouncements']),
		announcementCount      : state.getIn(['data', 'announcementCount']),
		announcementCurrentPage: state.getIn(['data', 'announcementCurrentPage']),
		onSending              : state.getIn(['app', 'appInfo', 'onSending'])
	};
}

export default connect(mapStateToProps, {
	loadAnnouncements,
	openAnnouncement,
	delAnnouncement
})(AnnouncementPage);