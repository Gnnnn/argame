/**
 * Created by admin on 2017/11/20.
 */
'use strict';

import React from 'react';
import Pagination from 'rc-pagination';
import {connect} from 'react-redux';
import {loadPointMalls, updatePointMall} from '../../actions/api';
import {openPointMall} from '../../actions/client';
import {dateHelper, appConfigs} from '../../utils';

const PointMallPage = React.createClass({
	handleChangePage(page) {
		this.props.loadPointMalls(page);
	},
	handleRowClick(pointMallId) {
		this.props.openPointMall(pointMallId);
	},
	handleValidClick(id, e) {
		e.preventDefault();
		e.stopPropagation();
		let text = e.target.textContent,
			validFlg;
		if (text === '未上架') {
			validFlg = true;
		}
		else {
			validFlg = false;
		}
		this.props.updatePointMall(id, {validFlg});
	},
	renderTable() {
		let {users, pointMalls, loadedPointMalls, pointMallCount, pointMallCurrentPage} = this.props,
			trs = [];
		pointMallCurrentPage = pointMallCurrentPage || 1;
		if (loadedPointMalls && loadedPointMalls.size > 0) {
			trs = loadedPointMalls.toArray().map((pointMallId) => {
				let pointMall = pointMalls.get(pointMallId);
				if (pointMall) {
					let uploadUserId = pointMall.get('uploadUser'),
						lastModifiedUserId = pointMall.get('lastModifiedUser'),
						uploadUser,
						lastModifiedUser;
					if (users) {
						uploadUser = users.getIn([uploadUserId, 'name']);
						lastModifiedUser = users.getIn([lastModifiedUserId, 'name']);
					}
					return (
						<tr key = {pointMall.get('_id')}
						    onClick = {this.handleRowClick.bind(null, pointMall.get('_id'))}>
							<td><input value = {pointMall.get('name')} readOnly = "readonly"/></td>
							<td><input value = {pointMall.get('description')} readOnly = "readonly"/></td>
							<td>
								<a onClick = {this.handleValidClick.bind(null, pointMall.get('_id'))}
								   className = "tiny secondary col-btn">{pointMall.get('validFlg') ?
								                                         <span>上架</span> :
								                                         <span>未上架</span>}
								</a>
							</td>
							<td><input value = {lastModifiedUser} readOnly = "readonly"/></td>
							<td><input
								value = {dateHelper.format(pointMall.get('lastModifiedTime'), 'yyyy-MM-dd HH:mm')}
								readOnly = "readonly"/>
							</td>
							<td><input value = {pointMall.get('consumePoint')} readOnly = "readonly"/></td>
							<td><input value = {pointMall.get('price')} readOnly = "readonly"/></td>
						</tr>
					);
				}
			});
		}
		return (
			<div>
				<small>#可点击列表行进行积分商城商品的查询和修改，但不能删除；可点击右下角“+”按钮添加新商品</small>
				<hr/>
				<table>
					<thead>
					<tr>
						<th width = "100">名称</th>
						<th width = "250">描述</th>
						<th width = "80">状态</th>
						<th width = "80">修改人</th>
						<th width = "150">修改时间</th>
						<th width = "100">消费积分</th>
						<th width = "100">原价</th>
					</tr>
					</thead>
					<tbody>
					{trs}
					</tbody>
				</table>
				<div className = "rows">
					<div className = "large-11 columns">
						<Pagination onChange = {this.handleChangePage} current = {pointMallCurrentPage}
						            pageSize = {appConfigs.pointMallCountPrePage}
						            total = {pointMallCount}/>
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
			this.props.loadPointMalls(1);
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
			this.props.loadPointMalls(1);
		}
	}
});

function mapStateToProps(state) {
	return {
		loginUserId         : state.getIn(['app', 'loginData', 'loginUserId']),
		users               : state.getIn(['data', 'users']),
		pointMalls          : state.getIn(['data', 'pointMalls']),
		loadedPointMalls    : state.getIn(['data', 'loadedPointMalls']),
		pointMallCount      : state.getIn(['data', 'pointMallCount']),
		pointMallCurrentPage: state.getIn(['data', 'pointMallCurrentPage']),
		onSending           : state.getIn(['app', 'appInfo', 'onSending'])
	};
}

export default connect(mapStateToProps, {
	loadPointMalls,
	updatePointMall,
	openPointMall
})(PointMallPage);