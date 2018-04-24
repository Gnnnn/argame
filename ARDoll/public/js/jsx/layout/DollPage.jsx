/**
 * Created by admin on 2017/11/20.
 */
'use strict';

import React from 'react';
import Pagination from 'rc-pagination';
import {connect} from 'react-redux';
import {loadDolls} from '../../actions/api';
import {openDoll} from '../../actions/client';
import {dateHelper, appConfigs} from '../../utils';

const DollPage = React.createClass({
	handleChangePage(page) {
		this.props.loadDolls(page);
	},
	handleRowClick(dollId) {
		this.props.openDoll(dollId);
	},
	renderTable() {
		let {users, dolls, loadedDolls, dollCount, dollCurrentPage} = this.props,
			trs = [];
		dollCurrentPage = dollCurrentPage || 1;
		if (loadedDolls && loadedDolls.size > 0) {
			trs = loadedDolls.toArray().map((dollId) => {
				let doll = dolls.get(dollId);
				if (doll) {
					let uploadUserId = doll.get('uploadUser'),
						lastModifiedUserId = doll.get('lastModifiedUser'),
						uploadUser,
						lastModifiedUser;
					if (users) {
						uploadUser = users.getIn([uploadUserId, 'name']);
						lastModifiedUser = users.getIn([lastModifiedUserId, 'name']);
					}
					return (
						<tr key = {doll.get('_id')} onClick = {this.handleRowClick.bind(null, doll.get('_id'))}>
							<td><input value = {doll.get('name')} readOnly = "readonly"/></td>
							<td><input value = {doll.get('description')} readOnly = "readonly"/></td>
							<td>{doll.get('thumbnail') ?
							     <span>√</span> :
							     <span>×</span>}
							</td>
							<td>{doll.get('document') ?
							     <span>√</span> :
							     <span>×</span>}
							</td>
							<td>{doll.get('androidDocument') ?
							     <span>√</span> :
							     <span>×</span>}
							</td>
							<td><input value = {lastModifiedUser} readOnly = "readonly"/></td>
							<td><input
								value = {dateHelper.format(doll.get('lastModifiedTime'), 'yyyy-MM-dd HH:mm')}
								readOnly = "readonly"/>
							</td>
							<td><input value = {doll.get('cost')} readOnly = "readonly"/></td>
						</tr>
					);
				}
			});
		}
		return (
			<div>
				<small>#可点击列表行进行娃娃的查询和修改，但不能删除；可点击右下角“+”按钮添加新娃娃</small>
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
						<th width = "60">成本</th>
					</tr>
					</thead>
					<tbody>
					{trs}
					</tbody>
				</table>
				<div className = "rows">
					<div className = "large-11 columns">
						<Pagination onChange = {this.handleChangePage} current = {dollCurrentPage}
						            pageSize = {appConfigs.dollCountPrePage}
						            total = {dollCount}/>
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
			this.props.loadDolls(1);
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
			this.props.loadDolls(1);
		}
	}
});

function mapStateToProps(state) {
	return {
		loginUserId    : state.getIn(['app', 'loginData', 'loginUserId']),
		users          : state.getIn(['data', 'users']),
		dolls          : state.getIn(['data', 'dolls']),
		loadedDolls    : state.getIn(['data', 'loadedDolls']),
		dollCount      : state.getIn(['data', 'dollCount']),
		dollCurrentPage: state.getIn(['data', 'dollCurrentPage']),
		onSending      : state.getIn(['app', 'appInfo', 'onSending'])
	};
}

export default connect(mapStateToProps, {
	loadDolls,
	openDoll
})(DollPage);