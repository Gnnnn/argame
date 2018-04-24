/**
 * Created by admin on 2017/10/19.
 */
'use strict';

import React from 'react';
import ReactPureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {Modal} from '../component';
import {updateAdvice} from '../../actions/api';
import {closeAdviceModal} from '../../actions/client';
import {constants, dateHelper} from '../../utils';

const customStyles = {
	content: {
		width    : '800px',
		height   : '590px',
		marginTop: '8%'
	}
};

const AdviceModal = React.createClass({
	displayName: 'AdviceModal',
	mixins     : [ReactPureRenderMixin],
	getInitialState() {
		return {
			handleState  : '',
			handleMessage: ''
		};
	},
	afterOpenFn() {
		let {openAdviceId, advice} = this.props;
		let singleAdvice;
		if (openAdviceId && advice) {
			singleAdvice = advice.get(openAdviceId);
		}
		if (singleAdvice) {
			this.setState({
				handleState  : singleAdvice.get('handleState'),
				handleMessage: singleAdvice.get('handleMessage')
			});
		}
		else {
			this.setState({
				handleState  : '',
				handleMessage: ''
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
		let {openAdviceId} = this.props,
			{handleState, handleMessage} = this.state;
		if (openAdviceId) {
			this.props.updateAdvice(openAdviceId, {handleState, handleMessage});
		}
	},
	handleClose() {
		this.props.closeAdviceModal();
	},
	renderAdvice() {
		let {openAdviceId, advice, visitors} = this.props;
		let singleAdvice, mobileId, mobileModel;
		if (openAdviceId && advice) {
			singleAdvice = advice.get(openAdviceId);
		}
		if (singleAdvice) {
			if (visitors) {
				let visitorId = singleAdvice.get('visitor');
				mobileId = visitors.getIn([visitorId, 'mobileId']);
				mobileModel = visitors.getIn([visitorId, 'mobileModel']);
			}
			return (
				<div>
					<div className = "row">
						<div className = "large-6 columns">
							<label>手机ID
								<input type = "text" value = {mobileId} disabled = "true"/>
							</label>
						</div>
						<div className = "large-6 columns">
							<label>手机型号
								<input type = "text" value = {mobileModel} disabled = "true"/>
							</label>
						</div>
					</div>
					<div className = "row">
						<div className = "large-6 columns">
							<label>反馈类型
								<input type = "text"
								       value = {constants.ADVICE_MSG_TYPE[singleAdvice.get('messageType')] || '用户反馈'}
								       disabled = "true"/>
							</label>
						</div>
						<div className = "large-6 columns">
							<label>反馈时间
								<input type = "text"
								       value = {dateHelper.format(singleAdvice.get('uploadTime'), 'yyyy-MM-dd HH:mm')}
								       disabled = "true"/>
							</label>
						</div>
					</div>
					<div className = "row">
						<div className = "large-12 columns">
							<label>反馈信息
								<textarea className = "unresizable-area" rows = "8" type = "text"
								          value = {singleAdvice.get('message')}
								          disabled = "true"/>
							</label>
						</div>
					</div>
					<div className = "row">
						<div className = "large-4 columns">
							<label>处理人
								<input type = "text" value = {singleAdvice.get('handleUser')} disabled = "true"/>
							</label>
						</div>
						<div className = "large-4 columns">
							<label>处理时间
								<input type = "text"
								       value = {dateHelper.format(singleAdvice.get('handleTime'), 'yyyy-MM-dd HH:mm')}
								       disabled = "true"/>
							</label>
						</div>
						<div className = "large-4 columns">
							<label>处理状态
								<select onChange = {this.handleChangeState} value = {this.state.handleState}>
									<option value = "pending">待处理</option>
									<option value = "processed">已处理</option>
									<option value = "shelve">搁置</option>
								</select>
							</label>
						</div>
					</div>
					<div className = "row">
						<div className = "large-12 columns">
							<label>处理意见
								<textarea id = "handleMessage" className = "unresizable-area" rows = "8" type = "text"
								          value = {this.state.handleMessage}
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
			<Modal isOpen = {isActive} onAfterOpen = {this.afterOpenFn} modalName = "AdviceModal"
			       style = {customStyles}>
				<div>
					{this.renderAdvice()}
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
		isActive    : state.getIn(['app', 'appInfo', 'modals', constants.MODAL_ADVICE]),
		users       : state.getIn(['data', 'users']),
		visitors    : state.getIn(['data', 'visitors']),
		advice      : state.getIn(['data', 'advice']),
		openAdviceId: state.getIn(['app', 'appInfo', 'openAdviceId']),
		onSending   : state.getIn(['app', 'appInfo', 'onSending'])
	};
}

export default connect(mapStateToProps, {
	closeAdviceModal,
	updateAdvice
})(AdviceModal);