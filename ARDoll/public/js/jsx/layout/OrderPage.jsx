/**
 * Created by admin on 2017/10/10.
 */
'use strict';

import React from 'react';
import {connect} from 'react-redux';
import Pagination from 'rc-pagination';
import {loadOrders} from '../../actions/api';
import {openOrder} from '../../actions/client';
import {tsResourzes, dateHelper, appConfigs, constants} from '../../utils';

const OrderPage = React.createClass({
	handleRowClick(orderId) {
		this.props.openOrder(orderId);
	},
	handleChangePage(page) {
		this.props.loadOrders(page);
	},
	componentWillReceiveProps(nextProps) {
		if (nextProps.loginUserId && this.props.loginUserId !== nextProps.loginUserId) {
			this.props.loadOrders(1);
		}
	},
	render() {
		let {users, orders, pointMalls, playRecords, rooms, loadedOrders, orderCount, orderCurrentPage} = this.props,
			trs = [];
		orderCurrentPage = orderCurrentPage || 1;
		if (loadedOrders && loadedOrders.size > 0) {
			trs = loadedOrders.toArray().map((orderId) => {
				let order = orders.get(orderId);
				if (order) {
					let handleUser = users ? users.getIn([order.get('handleUser'), 'name']) : '',
						pointMallName = pointMalls ? pointMalls.getIn([order.get('pointMall'), 'name']) : '',
						playRecord = playRecords ? playRecords.get(order.get('playRecord')) : null,
						roomName = rooms && playRecord ? rooms.getIn([playRecord.get('room'), 'name']) : '';
					return (
						<tr key = {order.get('_id')}
						    onClick = {this.handleRowClick.bind(null, order.get('_id'))}>
							<td><input value = {order.get('state') === 'DELIVERED' ? '已发货' : ''} readOnly = "readonly"/>
							</td>
							<td><input value = {pointMallName || ''} readOnly = "readonly"/></td>
							<td><input value = {roomName || ''} readOnly = "readonly"/></td>
							<td><input value = {order.get('consignee')} readOnly = "readonly"/></td>
							<td><input value = {handleUser || ''} readOnly = "readonly"/></td>
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
						<th width = "100">处理状态</th>
						<th width = "200">积分商品</th>
						<th width = "200">抓取奖品房间</th>
						<th width = "100">收件人</th>
						<th width = "100">处理人</th>
					</tr>
					</thead>
					<tbody>
					{trs}
					</tbody>
				</table>

				<div className = "rows">
					<div className = "large-12 columns">
						<Pagination onChange = {this.handleChangePage} current = {orderCurrentPage}
						            pageSize = {appConfigs.orderCountPrePage}
						            total = {orderCount}/>
					</div>
				</div>
			</div>
		);
	},
	componentDidMount() {
		if (this.props.loginUserId) {
			this.props.loadOrders(1);
		}
	}
});

function mapStateToProps(state) {
	return {
		loginUserId     : state.getIn(['app', 'loginData', 'loginUserId']),
		users           : state.getIn(['data', 'users']),
		orders          : state.getIn(['data', 'orders']),
		pointMalls      : state.getIn(['data', 'pointMalls']),
		playRecords     : state.getIn(['data', 'playRecords']),
		rooms           : state.getIn(['data', 'rooms']),
		loadedOrders    : state.getIn(['data', 'loadedOrders']),
		orderCount      : state.getIn(['data', 'orderCount']),
		orderCurrentPage: state.getIn(['data', 'orderCurrentPage'])
	};
}

export default connect(mapStateToProps, {
	loadOrders,
	openOrder
})(OrderPage);