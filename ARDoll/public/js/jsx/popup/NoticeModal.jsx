/**
 * Created by admin on 2017/10/11.
 */
'use strict';

import React, {PropTypes} from 'react';
import ReactPureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {Modal, Editor} from '../component';
import {updateNotice} from '../../actions/api';
import {closeNoticeModal, createNotice} from '../../actions/client';
import {constants} from '../../utils';

const customStyles = {
	content: {
		width : '800px',
		height: '710px'
	}
};

const NoticeModal = React.createClass({
	displayName: 'NoticeModal',
	mixins     : [ReactPureRenderMixin],
	getInitialState() {
		return {
			title  : '',
			content: ''
		};
	},
	afterOpenFn() {
		let {openNoticeId, notices} = this.props;
		let notice;
		if (openNoticeId && notices) {
			notice = notices.get(openNoticeId);
		}
		if (notice) {
			this.setState({
				title  : notice.get('title'),
				content: notice.get('content')
			});
			this.refs.content.setValue(notice.get('content'));
		}
		else {
			this.setState({
				title  : '',
				content: ''
			});
		}
	},
	handleInputChange(e) {
		let inputId = e.target.id,
			inputValue = e.target.value;
		let newState = {};
		newState[inputId] = inputValue;
		this.setState(newState);
	},
	handleSave() {
		let title = this.refs.title.value,
			content = this.refs.content.value(),
			{openNoticeId} = this.props;
		let data = {title, content};
		if (openNoticeId) {
			this.props.updateNotice(openNoticeId, data);
		}
		else {
			this.props.createNotice(data);
		}
	},
	handleClose() {
		this.props.closeNoticeModal();
	},
	render() {
		let {isActive} = this.props,
			{title, content} = this.state;

		return (
			<Modal isOpen = {isActive} onAfterOpen = {this.afterOpenFn} modalName = "NoticeModal"
			       style = {customStyles}>
				<div>
					<div className = "row">
						<label>公告标题：
							<div className = "row collapse">
								<input id = "title" type = "text" placeholder = "公告标题" ref = "title"
								       onChange = {this.handleInputChange} value = {title}/>
							</div>
						</label>
					</div>

					<div className = "row">
						<label>正文：
							<div className = "row collapse">
								<Editor ref = "content" content = {content}/>
							</div>
						</label>
					</div>
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
		isActive    : state.getIn(['app', 'appInfo', 'modals', constants.MODAL_NOTICE]),
		users       : state.getIn(['data', 'users']),
		notices     : state.getIn(['data', 'notices']),
		openNoticeId: state.getIn(['app', 'appInfo', 'openNoticeId']),
		onSending   : state.getIn(['app', 'appInfo', 'onSending'])
	};
}

export default connect(mapStateToProps, {
	updateNotice,
	closeNoticeModal,
	createNotice
})(NoticeModal);