/**
 * Created by admin on 2017/11/20.
 */
'use strict';

import React from 'react';
import ReactPureRenderMixin from 'react-addons-pure-render-mixin';
import {Modal} from '../component';
import Pagination from 'rc-pagination';
import {connect} from 'react-redux';
import {loadTags} from '../../actions/api';
import {closeTagSelectModal} from '../../actions/client';
import {constants, dateHelper, appConfigs} from '../../utils';

let customStyles = {
	content: {
		width    : '900px',
		height   : '750px',
		marginTop: '110px'
	}
};

const SelectTagModal = React.createClass({
	displayName: 'SelectTagModal',
	mixins     : [ReactPureRenderMixin],
	afterOpenFn() {
		this.props.loadTags(1);
	},
	handleChangePage(page) {
		this.props.loadTags(page);
	},
	handleRowClick(tagId) {
		if (this.props.rowClick) {
			this.props.rowClick(tagId);
		}
		this.props.closeTagSelectModal();
	},
	handleClose() {
		this.props.closeTagSelectModal();
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
						<tr key = {tag.get('_id')}
						    onClick = {this.handleRowClick.bind(null, tag.get('_id'))}>
							<td><input value = {tag.get('name')} readOnly = "readonly"/></td>
							<td><input value = {tag.get('description')} readOnly = "readonly"/></td>
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
					<div className = "large-10 columns">
						<Pagination onChange = {this.handleChangePage} current = {tagCurrentPage}
						            pageSize = {appConfigs.tagCountPrePage}
						            total = {tagCount}/>
					</div>
					<div className = "large-1 columns">
						<button className = "button postfix tc-circle alert"
						        onClick = {this.handleRowClick.bind(null, '')}>清空
						</button>
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
			<Modal isOpen = {isActive} onAfterOpen = {this.afterOpenFn} modalName = "SelectTagModal"
			       style = {customStyles}>
				{this.renderTable()}
			</Modal>
		);
	}
});

function mapStateToProps(state) {
	return {
		isActive      : state.getIn(['app', 'appInfo', 'modals', constants.MODAL_SELECT_TAG]),
		users         : state.getIn(['data', 'users']),
		tags          : state.getIn(['data', 'tags']),
		loadedTags    : state.getIn(['data', 'loadedTags']),
		tagCount      : state.getIn(['data', 'tagCount']),
		tagCurrentPage: state.getIn(['data', 'tagCurrentPage'])
	};
}

export default connect(mapStateToProps, {
	loadTags,
	closeTagSelectModal
})(SelectTagModal);