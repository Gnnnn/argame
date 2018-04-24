/**
 * Created by admin on 2017/11/20.
 */
'use strict';

import React from 'react';
import ReactPureRenderMixin from 'react-addons-pure-render-mixin';
import {Modal} from '../component';
import Pagination from 'rc-pagination';
import {connect} from 'react-redux';
import {loadCategories} from '../../actions/api';
import {closeCategorySelectModal} from '../../actions/client';
import {constants, dateHelper, appConfigs} from '../../utils';

let customStyles = {
	content: {
		width    : '900px',
		height   : '750px',
		marginTop: '110px'
	}
};

const SelectCategoryModal = React.createClass({
	displayName: 'SelectCategoryModal',
	mixins     : [ReactPureRenderMixin],
	afterOpenFn() {
		this.props.loadCategories(1);
	},
	handleChangePage(page) {
		this.props.loadCategories(page);
	},
	handleRowClick(categoryId) {
		if (this.props.rowClick) {
			this.props.rowClick(categoryId);
		}
		this.props.closeCategorySelectModal();
	},
	handleClose() {
		this.props.closeCategorySelectModal();
	},
	renderTable() {
		let {users, categories, loadedCategories, categoryCount, categoryCurrentPage} = this.props,
			trs = [];
		categoryCurrentPage = categoryCurrentPage || 1;
		if (loadedCategories && loadedCategories.size > 0) {
			trs = loadedCategories.toArray().map((categoryId) => {
				let category = categories.get(categoryId);
				if (category) {
					let uploadUserId = category.get('uploadUser'),
						lastModifiedUserId = category.get('lastModifiedUser'),
						uploadUser,
						lastModifiedUser;
					if (users) {
						uploadUser = users.getIn([uploadUserId, 'name']);
						lastModifiedUser = users.getIn([lastModifiedUserId, 'name']);
					}
					return (
						<tr key = {category.get('_id')}
						    onClick = {this.handleRowClick.bind(null, category.get('_id'))}>
							<td><input value = {category.get('name')} readOnly = "readonly"/></td>
							<td><input value = {category.get('description')} readOnly = "readonly"/></td>
							<td><input value = {lastModifiedUser} readOnly = "readonly"/></td>
							<td><input
								value = {dateHelper.format(category.get('lastModifiedTime'), 'yyyy-MM-dd HH:mm')}
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
						<Pagination onChange = {this.handleChangePage} current = {categoryCurrentPage}
						            pageSize = {appConfigs.categoryCountPrePage}
						            total = {categoryCount}/>
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
			<Modal isOpen = {isActive} onAfterOpen = {this.afterOpenFn} modalName = "SelectCategoryModal"
			       style = {customStyles}>
				{this.renderTable()}
			</Modal>
		);
	}
});

function mapStateToProps(state) {
	return {
		isActive           : state.getIn(['app', 'appInfo', 'modals', constants.MODAL_SELECT_CATEGORY]),
		users              : state.getIn(['data', 'users']),
		categories         : state.getIn(['data', 'categories']),
		loadedCategories   : state.getIn(['data', 'loadedCategories']),
		categoryCount      : state.getIn(['data', 'categoryCount']),
		categoryCurrentPage: state.getIn(['data', 'categoryCurrentPage'])
	};
}

export default connect(mapStateToProps, {
	loadCategories,
	closeCategorySelectModal
})(SelectCategoryModal);