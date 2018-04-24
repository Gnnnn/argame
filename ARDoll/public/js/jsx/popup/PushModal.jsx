/**
 * Created by admin on 2017/10/31.
 */
'use strict';

import React from 'react';
import ReactPureRenderMixin from 'react-addons-pure-render-mixin';
import DatePicker from 'react-datepicker';
import classNames from 'classnames';
import {connect} from 'react-redux';
import moment from 'moment';
import {Modal} from '../component';
import {updatePush} from '../../actions/api';
import {createPush, closePushModal} from '../../actions/client';
import {dateHelper, constants} from '../../utils';

const customStyles = {
	content: {
		width    : '800px',
		height   : '360px',
		marginTop: '240px'
	}
};

const PushModal = React.createClass({
	displayName: 'PushModal',
	mixins     : [ReactPureRenderMixin],
	getInitialState() {
		return {
			schedule: '',
			readOnly: false
		};
	},
	clearRefsValues() {
		this.refs.title.value = '';
		this.refs.description.value = '';
		this.refs.expiry.value = '';
		this.refs.type.value = '';
		this.refs.user.value = '';
		this.refs.updateTime.value = '';
		this.setState({schedule: '', readOnly: false});
	},
	handleScheduleChange(schedule) {
		this.setState({schedule});
	},
	afterOpenFn() {
		this.clearRefsValues();
		let {openPushId, pushes, users} = this.props;
		let push;
		if (openPushId && pushes) {
			push = pushes.get(openPushId);
		}
		if (push) {
			this.refs.title.value = push.get('title');
			this.refs.description.value = push.get('description');
			this.refs.expiry.value = push.get('expiry');
			this.refs.type.value = push.get('type');
			this.refs.user.value = users ? users.getIn([push.get('user'), 'name']) : '';
			this.refs.updateTime.value = push.get('updateTime') ? dateHelper.format(push.get('updateTime'), 'yyyy-MM-dd HH:mm') : '';
			this.setState({schedule: new moment(push.get('schedule'))});
			if (!push.get('schedule') || (new Date(push.get('schedule'))).getTime() < Date.now()) {
				this.setState({readOnly: true});
			}
		}
		else {
			this.refs.title.value = '';
			this.refs.description.value = '';
			this.refs.expiry.value = '';
			this.refs.type.value = '';
			this.refs.user.value = '';
			this.refs.updateTime.value = '';
			this.setState({schedule: '', readOnly: false});
		}
	},
	handleSave() {
		let {openPushId} = this.props;
		var newPush = {
			type       : this.refs.type.value,
			title      : this.refs.title.value,
			description: this.refs.description.value,
			expiry     : this.refs.expiry.value,
			schedule   : this.state.schedule ? this.state.schedule.toDate() : ''
		};
		if (openPushId) {
			this.props.updatePush(openPushId, newPush);
		}
		else {
			this.props.createPush(newPush);
		}
	},
	handleClose() {
		this.props.closePushModal();
	},
	renderCreatePanel() {
		return (
			<div>
				<div className = "row">
					<div className = "large-10 columns">
						<label>标题
							<input type = "text" ref = "title" placeholder = "请输入标题"
							       disabled = {this.state.readOnly}/>
						</label>
					</div>
					<div className = "large-2 columns">
						<label>类型
							<select ref = "type" disabled = {this.state.readOnly}>
								<option value = "SYSTEM_UPDATA">系统更新</option>
								<option value = "NEW_DOLL">新增娃娃</option>
								<option value = "ACTIVITY">活动</option>
							</select>
						</label>
					</div>
				</div>
				<div className = "row">
					<div className = "large-12 columns">
						<label>描述
							<textarea ref = "description" className = "unresizable-area" rows = "2"
							          disabled = {this.state.readOnly}/>
						</label>
					</div>
				</div>
				<div className = "row">
					<div className = "large-6 columns">
						<label>推送时间
							<DatePicker disabled = {this.state.readOnly}
							            selected = {this.state.schedule}
							            onChange = {this.handleScheduleChange}
							            showTimeSelect
							            timeIntervals = {15}
							            dateFormat = "YYYY-MM-DD HH:mm"/>
						</label>
					</div>
					<div className = "large-6 columns">
						<label>超时时间
							<small>超时后客户端仍未收到的消息将被丢弃(单位ms)</small>
							<input type = "text" ref = "expiry" disabled = {this.state.readOnly}/>
						</label>
					</div>
				</div>
				<div className = "row">
					<div className = "large-6 columns">
						<label>创建人
							<input type = "text" ref = "user" disabled = "true"/>
						</label>
					</div>
					<div className = "large-6 columns">
						<label>创建时间
							<input type = "text" ref = "updateTime" disabled = "true"/>
						</label>
					</div>
				</div>
			</div>
		);
	},
	render() {
		let {isActive} = this.props;
		return (
			<Modal isOpen = {isActive} onAfterOpen = {this.afterOpenFn} modalName = "PushModal"
			       style = {customStyles}>
				<div>
					{this.renderCreatePanel()}
					<hr/>
					<div className = "row">
						<div className = "small-2 push-8 columns">
							{!this.state.readOnly ?
							 <a className = {classNames('button postfix', {disabled: this.props.onSending})}
							    onClick = {this.handleSave}>保存</a> : ''}
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
		isActive  : state.getIn(['app', 'appInfo', 'modals', constants.MODAL_PUSH]),
		users     : state.getIn(['data', 'users']),
		pushes    : state.getIn(['data', 'push']),
		openPushId: state.getIn(['app', 'appInfo', 'openPushId']),
		onSending : state.getIn(['app', 'appInfo', 'onSending'])
	};
}

export default connect(mapStateToProps, {
	closePushModal,
	createPush,
	updatePush
})(PushModal);