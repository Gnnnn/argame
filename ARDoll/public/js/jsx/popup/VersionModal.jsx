import React, {PropTypes} from 'react';
import ReactPureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {Modal} from '../component';
import {closeVersionModal} from '../../actions/client';
import {constants, dateHelper} from '../../utils';

let customStyles = {
	content: {
		width    : '500px',
		height   : '340px',
		marginTop: '200px'
	}
};

const VersionModal = React.createClass({
	displayName: 'VersionModal',
	mixins     : [ReactPureRenderMixin],
	afterOpenFn() {},
	handleClose() {
		this.props.closeVersionModal();
	},
	render() {
		let isActive = this.props.isActive;
		let {openVersionId, versions, users} = this.props,
			version, versionNum, updateNews, uploadTime, userName;
		if (openVersionId && versions) {
			version = versions.get(openVersionId);
			versionNum = version.get('version');
			updateNews = version.get('updateNews');
			uploadTime = dateHelper.format(version.get('uploadTime'), 'yyyy-MM-dd HH:mm');
			if (users) {
				let userId = version.get('user');
				userName = users.getIn([userId, 'name']);
			}
		}
		return (
			<Modal isOpen = {isActive} onAfterOpen = {this.afterOpenFn} modalName = "VersionModal"
			       style = {customStyles}>
				<div className = "row">
					<div className = "large-12 columns">
						<label>版本号<input type = "text" value = {versionNum || ''} disabled = "true"/></label>
					</div>
				</div>
				<div className = "row">
					<div className = "large-12 columns">
						<label>更新履历
							<textarea value = {updateNews || ''} className = "unresizable-area" disabled = "true"
							          rows = "8"/>
						</label>
					</div>
				</div>
				<div className = "row">
					<div className = "large-6 columns">
						<label>发布人<input type = "text" value = {userName || ''} disabled = "true"/></label>
					</div>
					<div className = "large-6 columns">
						<label>发布时间<input type = "text" value = {uploadTime || ''} disabled = "true"/></label>
					</div>
				</div>
				<div className = "small-2 push-10">
					<a className = {classNames('button postfix', {disabled: this.props.onSending})}
					   onClick = {this.handleClose}>返回</a>
				</div>
			</Modal>
		);
	}
});

function mapStateToProps(state) {
	return {
		isActive     : state.getIn(['app', 'appInfo', 'modals', constants.MODAL_VERSION]),
		openVersionId: state.getIn(['app', 'appInfo', 'openVersionId']),
		versions     : state.getIn(['data', 'versions']),
		users        : state.getIn(['data', 'users'])
	};
}

export default connect(mapStateToProps, {
	closeVersionModal,
})(VersionModal);