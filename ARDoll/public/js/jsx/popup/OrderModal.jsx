/**
 * Created by admin on 2017/10/19.
 */
'use strict';

import React from 'react';
import ReactPureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {Modal} from '../component';
import {updateOrder} from '../../actions/api';
import {closeOrderModal} from '../../actions/client';
import {constants, dateHelper} from '../../utils';

const customStyles = {
	content: {
		width    : '800px',
		height   : '330px',
		marginTop: '8%'
	}
};

const OrderModal = React.createClass({
	displayName: 'OrderModal',
	mixins     : [ReactPureRenderMixin],
	getInitialState() {
		return {
			expressCompany: '',
			expressNo     : ''
		};
	},
	afterOpenFn() {
		let {openOrderId, orders} = this.props;
		let order;
		if (openOrderId && orders) {
			order = orders.get(openOrderId);
		}
		if (order) {
			this.setState({
				expressCompany: order.get('expressCompany'),
				expressNo     : order.get('expressNo')
			});
		}
		else {
			this.setState({
				expressCompany: '',
				expressNo     : ''
			});
		}
	},
	handleChangeState(e) {
		this.setState({
			handleState: e.target.value
		});
	},
	handleInputChange(e) {
		let inputId = e.target.id,
			inputValue = e.target.value;
		let newState = {};
		newState[inputId] = inputValue;
		this.setState(newState);
	},
	handleSave() {
		let {openOrderId} = this.props,
			{expressCompany, expressNo} = this.state;
		if (openOrderId) {
			this.props.updateOrder(openOrderId, {expressCompany, expressNo});
		}
	},
	handleClose() {
		this.props.closeOrderModal();
	},
	renderOrder() {
		let {openOrderId, orders, pointMalls, playRecords, rooms} = this.props;
		let {expressCompany, expressNo} = this.state;
		let order;
		if (openOrderId && orders) {
			order = orders.get(openOrderId);
		}
		if (order) {
			let pointMallName = pointMalls ? pointMalls.getIn([order.get('pointMall'), 'name']) : '',
				playRecord = playRecords ? playRecords.get(order.get('playRecord')) : null,
				roomName = rooms && playRecord ? rooms.getIn([playRecord.get('room'), 'name']) : '';
			return (
				<div>
					<div className = "row">
						<div className = "large-6 columns">
							<label>收件人
								<input type = "text" value = {order.get('consignee') || ''} disabled = "true"/>
							</label>
						</div>
						<div className = "large-6 columns">
							<label>联系电话
								<input type = "text" value = {order.get('cellPhone') || ''} disabled = "true"/>
							</label>
						</div>
					</div>
					<div className = "row">
						<div className = "large-12 columns">
							<label>收货地址
								<input type = "text" value = {order.get('address') || ''} disabled = "true"/>
							</label>
						</div>
					</div>
					<div className = "row">
						<div className = "large-6 columns">
							<label>对应积分商城商品
								<input type = "text" value = {pointMallName || ''} disabled = "true"/>
							</label>
						</div>
						<div className = "large-6 columns">
							<label>对应游玩房间
								<input type = "text" value = {roomName || ''} disabled = "true"/>
							</label>
						</div>
					</div>
					<div className = "row">
						<div className = "large-6 columns">
							<label>快递公司
								<input id = "expressCompany" type = "text" ref = "expressCompany"
								       value = {expressCompany} disabled = {order.get('state') === 'DELIVERED'}
								       onChange = {this.handleInputChange}/>
							</label>
						</div>
						<div className = "large-6 columns">
							<label>快递单号
								<input id = "expressNo" type = "text" ref = "expressNo"
								       value = {expressNo} disabled = {order.get('state') === 'DELIVERED'}
								       onChange = {this.handleInputChange}/>
							</label>
						</div>
					</div>
				</div>
			);
		}
	},
	render() {
		let {isActive} = this.props;
		return (
			<Modal isOpen = {isActive} onAfterOpen = {this.afterOpenFn} modalName = "OrderModal"
			       style = {customStyles}>
				<div>
					{this.renderOrder()}
					<hr/>
					<div className = "row">
						<div className = "small-2 push-8 columns">
							<a className = {classNames('button postfix', {disabled: this.props.onSending})}
							   onClick = {this.handleSave}>保存</a>
						</div>
						<div className = "small-2 columns">
							<a className = {classNames('button postfix', {disabled: this.props.onSending})}
							   onClick = {this.handleClose}>取消</a>
						</div>
					</div>
				</div>
			</Modal>
		);
	}
});

function mapStateToProps(state) {
	return {
		isActive   : state.getIn(['app', 'appInfo', 'modals', constants.MODAL_ORDER]),
		users      : state.getIn(['data', 'users']),
		orders     : state.getIn(['data', 'orders']),
		pointMalls : state.getIn(['data', 'pointMalls']),
		playRecords: state.getIn(['data', 'playRecords']),
		rooms      : state.getIn(['data', 'rooms']),
		openOrderId: state.getIn(['app', 'appInfo', 'openOrderId']),
		onSending  : state.getIn(['app', 'appInfo', 'onSending'])
	};
}

export default connect(mapStateToProps, {
	closeOrderModal,
	updateOrder
})(OrderModal);