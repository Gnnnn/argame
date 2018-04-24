/**
 * Created by admin on 2017/11/20.
 */
'use strict';

import React from 'react';
import Pagination from 'rc-pagination';
import {connect} from 'react-redux';
import {loadCategories} from '../../actions/api';
import {openCategory} from '../../actions/client';
import {dateHelper, appConfigs} from '../../utils';

const CategoryPage = React.createClass({
	handleChangePage(page) {
		this.props.loadCategories(page);
	},
	handleRowClick(dollId) {
		this.props.openCategory(dollId);
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
						<tr key = {category.get('_id')} onClick = {this.handleRowClick.bind(null, category.get('_id'))}>
							<td><input value = {category.get('name')} readOnly = "readonly"/></td>
							<td><input value = {category.get('description')} readOnly = "readonly"/></td>
							<td>{category.get('thumbnail') ?
							     <span>√</span> :
							     <span>×</span>}
							</td>
							<td>{category.get('document') ?
							     <span>√</span> :
							     <span>×</span>}
							</td>
							<td><input value = {lastModifiedUser} readOnly = "readonly"/></td>
							<td><input
								value = {dateHelper.format(category.get('lastModifiedTime'), 'yyyy-MM-dd HH:mm')}
								readOnly = "readonly"/>
							</td>
							<td><input value = {category.get('sortIndex')} readOnly = "readonly"/></td>
						</tr>
					);
				}
			});
		}
		return (
			<div>
				<small>#可点击列表行进行分类的查询和修改，但不能删除；可点击右下角“+”按钮添加新娃娃</small>
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
						<th width = "50">排序</th>
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
			this.props.loadCategories(1);
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
			this.props.loadCategories(1);
		}
	}
});

function mapStateToProps(state) {
	return {
		loginUserId        : state.getIn(['app', 'loginData', 'loginUserId']),
		users              : state.getIn(['data', 'users']),
		categories         : state.getIn(['data', 'categories']),
		loadedCategories   : state.getIn(['data', 'loadedCategories']),
		categoryCount      : state.getIn(['data', 'categoryCount']),
		categoryCurrentPage: state.getIn(['data', 'categoryCurrentPage']),
		onSending          : state.getIn(['app', 'appInfo', 'onSending'])
	};
}

export default connect(mapStateToProps, {
	loadCategories,
	openCategory
})(CategoryPage);