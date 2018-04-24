/**
 * Created by admin on 2017/11/20.
 */
'use strict';

import React from 'react';
import Pagination from 'rc-pagination';
import {connect} from 'react-redux';
import {loadTags} from '../../actions/api';
import {openTag} from '../../actions/client';
import {dateHelper, appConfigs} from '../../utils';

const TagPage = React.createClass({
	handleChangePage(page) {
		this.props.loadTags(page);
	},
	handleRowClick(tagId) {
		this.props.openTag(tagId);
	},
	renderTable() {
		let {users, tags, loadedTags, tagCount, tagCurrentPage} = this.props,
			trs = [];
		tagCurrentPage = tagCurrentPage || 1;
		if (loadedTags && loadedTags.size > 0) {
			trs = loadedTags.toArray().map((tagId) => {
				let tag = tags.get(tagId);
				if (tag) {
					let uploadUserId = tag.get('uploadUser'),
						lastModifiedUserId = tag.get('lastModifiedUser'),
						uploadUser,
						lastModifiedUser;
					if (users) {
						uploadUser = users.getIn([uploadUserId, 'name']);
						lastModifiedUser = users.getIn([lastModifiedUserId, 'name']);
					}
					return (
						<tr key = {tag.get('_id')} onClick = {this.handleRowClick.bind(null, tag.get('_id'))}>
							<td><input value = {tag.get('name')} readOnly = "readonly"/></td>
							<td><input value = {tag.get('description')} readOnly = "readonly"/></td>
							<td>{tag.get('thumbnail') ?
							     <span>√</span> :
							     <span>×</span>}
							</td>
							<td>{tag.get('document') ?
							     <span>√</span> :
							     <span>×</span>}
							</td>
							<td><input value = {lastModifiedUser} readOnly = "readonly"/></td>
							<td><input
								value = {dateHelper.format(tag.get('lastModifiedTime'), 'yyyy-MM-dd HH:mm')}
								readOnly = "readonly"/>
							</td>
						</tr>
					);
				}
			});
		}
		return (
			<div>
				<small>#可点击列表行进行标签的查询和修改，但不能删除；可点击右下角“+”按钮添加新娃娃</small>
				<hr/>
				<table>
					<thead>
					<tr>
						<th width = "150">名称</th>
						<th width = "350">描述</th>
						<th width = "50">图片</th>
						<th width = "50">文件</th>
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
						<Pagination onChange = {this.handleChangePage} current = {tagCurrentPage}
						            pageSize = {appConfigs.tagCountPrePage}
						            total = {tagCount}/>
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
			this.props.loadTags(1);
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
			this.props.loadTags(1);
		}
	}
});

function mapStateToProps(state) {
	return {
		loginUserId   : state.getIn(['app', 'loginData', 'loginUserId']),
		users         : state.getIn(['data', 'users']),
		tags          : state.getIn(['data', 'tags']),
		loadedTags    : state.getIn(['data', 'loadedTags']),
		tagCount      : state.getIn(['data', 'tagCount']),
		tagCurrentPage: state.getIn(['data', 'tagCurrentPage']),
		onSending     : state.getIn(['app', 'appInfo', 'onSending'])
	};
}

export default connect(mapStateToProps, {
	loadTags,
	openTag
})(TagPage);