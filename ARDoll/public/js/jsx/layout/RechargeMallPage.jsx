/**
 * Created by admin on 2017/11/20.
 */
'use strict';

import React from 'react';
import Pagination from 'rc-pagination';
import {connect} from 'react-redux';
import {loadRechargeMalls, updateRechargeMall} from '../../actions/api';
import {openRechargeMall} from '../../actions/client';
import {dateHelper, appConfigs} from '../../utils';

const RechargeMallPage = React.createClass({
	handleChangePage(page) {
		this.props.loadRechargeMalls(page);
	},
	handleRowClick(mallId) {
		this.props.openRechargeMall(mallId);
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
		this.props.updateRechargeMall(id, {validFlg});
	},
	renderTable() {
		let {users, rechargeMalls, loadedRechargeMalls, rechargeMallCount, rechargeMallCurrentPage} = this.props,
			trs = [];
		rechargeMallCurrentPage = rechargeMallCurrentPage || 1;
		if (loadedRechargeMalls && loadedRechargeMalls.size > 0) {
			trs = loadedRechargeMalls.toArray().map((rechargeMallId) => {
				let rechargeMall = rechargeMalls.get(rechargeMallId);
				if (rechargeMall) {
					let uploadUserId = rechargeMall.get('uploadUser'),
						lastModifiedUserId = rechargeMall.get('lastModifiedUser'),
						uploadUser,
						lastModifiedUser;
					if (users) {
						uploadUser = users.getIn([uploadUserId, 'name']);
						lastModifiedUser = users.getIn([lastModifiedUserId, 'name']);
					}
					return (
						<tr key = {rechargeMall.get('_id')}
						    onClick = {this.handleRowClick.bind(null, rechargeMall.get('_id'))}>
							<td><input value = {rechargeMall.get('name')} readOnly = "readonly"/></td>
							<td><input value = {rechargeMall.get('description')} readOnly = "readonly"/></td>
							<td>{rechargeMall.get('thumbnail') ?
							     <span>√</span> :
							     <span>×</span>}
							</td>
							<td>
								<a onClick = {this.handleValidClick.bind(null, rechargeMall.get('_id'))}
								   className = "tiny secondary col-btn">{rechargeMall.get('validFlg') ?
								                                         <span>上架</span> :
								                                         <span>未上架</span>}
								</a>
							</td>
							<td><input value = {lastModifiedUser} readOnly = "readonly"/></td>
							<td><input
								value = {dateHelper.format(rechargeMall.get('lastModifiedTime'), 'yyyy-MM-dd HH:mm')}
								readOnly = "readonly"/>
							</td>
							<td><input value = {rechargeMall.get('amount')} readOnly = "readonly"/></td>
							<td><input value = {rechargeMall.get('exchangeCoin')} readOnly = "readonly"/></td>
							<td><input value = {rechargeMall.get('presentCoin')} readOnly = "readonly"/></td>
							<td><input value = {rechargeMall.get('productId')} readOnly = "readonly"/></td>
						</tr>
					);
				}
			});
		}
		return (
			<div>
				<small>#可点击列表行进行充值商城商品的查询和修改，但不能删除；可点击右下角“+”按钮添加新商品</small>
				<hr/>
				<table>
					<thead>
					<tr>
						<th width = "100">名称</th>
						<th width = "200">描述</th>
						<th width = "50">图片</th>
						<th width = "80">状态</th>
						<th width = "80">修改人</th>
						<th width = "120">修改时间</th>
						<th width = "100">充值金额</th>
						<th width = "100">充值兑换代币</th>
						<th width = "100">额外兑换代币</th>
						<th width = "100">苹果商城ID</th>
					</tr>
					</thead>
					<tbody>
					{trs}
					</tbody>
				</table>
				<div className = "rows">
					<div className = "large-11 columns">
						<Pagination onChange = {this.handleChangePage} current = {rechargeMallCurrentPage}
						            pageSize = {appConfigs.rechargeMallCountPrePage}
						            total = {rechargeMallCount}/>
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
			this.props.loadRechargeMalls(1);
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
			this.props.loadRechargeMalls(1);
		}
	}
});

function mapStateToProps(state) {
	return {
		loginUserId            : state.getIn(['app', 'loginData', 'loginUserId']),
		users                  : state.getIn(['data', 'users']),
		rechargeMalls          : state.getIn(['data', 'rechargeMalls']),
		loadedRechargeMalls    : state.getIn(['data', 'loadedRechargeMalls']),
		rechargeMallCount      : state.getIn(['data', 'rechargeMallCount']),
		rechargeMallCurrentPage: state.getIn(['data', 'rechargeMallCurrentPage']),
		onSending              : state.getIn(['app', 'appInfo', 'onSending'])
	};
}

export default connect(mapStateToProps, {
	loadRechargeMalls,
	updateRechargeMall,
	openRechargeMall
})(RechargeMallPage);