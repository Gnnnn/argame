'use strict';

import React from 'react';
import ReactPureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {Modal} from '../component';
import {updateRechargeMall} from '../../actions/api';
import {createRechargeMall, closeRechargeMallModal} from '../../actions/client';
import {constants, webHelper, tsResourzes} from '../../utils';
import DropzoneComponent from 'react-dropzone-component';

let customStyles = {
	content: {
		width    : '600px',
		height   : '470px',
		marginTop: '100px'
	}
};

const RechargeMallModal = React.createClass({
	displayName: 'RechargeMallModal',
	mixins     : [ReactPureRenderMixin],
	getInitialState() {
		return {
			name       : '',
			description: '',
			thumbnail  : '',
			showUpload : false,
			imageId    : '',
			amount     : 0,
			presentCoin: 0,
			productId  : ''
		};
	},
	afterOpenFn() {
		let {openRechargeMallId, rechargeMalls} = this.props;
		let rechargeMall;
		if (openRechargeMallId && rechargeMalls) {
			rechargeMall = rechargeMalls.get(openRechargeMallId);
		}
		if (rechargeMall) {
			this.setState({
				name       : rechargeMall.get('name'),
				description: rechargeMall.get('description'),
				thumbnail  : rechargeMall.get('thumbnail'),
				showUpload : false,
				amount     : rechargeMall.get('amount'),
				presentCoin: rechargeMall.get('presentCoin'),
				productId  : rechargeMall.get('productId')
			});
		}
		else {
			this.setState({
				name       : '',
				description: '',
				showUpload : false,
				thumbnail  : '',
				imageId    : '',
				amount     : 0,
				presentCoin: 0,
				productId  : ''
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
		let name = this.refs.name.value,
			description = this.refs.description.value,
			thumbnail = this.state.imageId || this.state.thumbnail || null,
			amount = this.refs.amount.value,
			presentCoin = this.refs.presentCoin.value,
			productId = this.refs.productId.value,
			{openRechargeMallId} = this.props;
		let data = {
			name,
			description,
			thumbnail,
			amount,
			presentCoin,
			productId
		};
		if (openRechargeMallId) {
			this.props.updateRechargeMall(openRechargeMallId, data);
		}
		else {
			this.props.createRechargeMall(data);
		}
	},
	handleClose() {
		this.props.closeRechargeMallModal();
	},
	handleEditImage(e) {
		if (e && e.target) {
			let zoneDiv = e.target.parentElement;
			while (zoneDiv) {
				if (zoneDiv.classList.contains('dz-clickable')) {
					zoneDiv.click();
					break;
				}
				zoneDiv = zoneDiv.parentElement;
			}
		}
	},
	handleUploadSuccess(file, res) {
		this.setState({
			showUpload: true,
			imageId   : res
		});
		this.refs.upload.dropzone.disable();
	},
	handleWillUpload() {
		this.setState({
			showUpload: true
		});
	},
	handleRemoveFile() {
		this.setState({
			showUpload: false
		});
		this.refs.upload.dropzone.enable();
	},
	renderDropzone() {
		let eventHandlers = {
			success    : this.handleUploadSuccess,
			addedfile  : this.handleWillUpload,
			removedfile: this.handleRemoveFile
		};
		let djsConfig = {
			addRemoveLinks    : true,
			uploadMultiple    : false,
			headers           : {
				[constants.TOKEN_KEY]: tsResourzes.headers()[constants.TOKEN_KEY]
			},
			autoProcessQueue  : true,
			parallelUploads   : 1,
			acceptedFiles     : 'image/jpeg,image/png,image/gif,image/x-icon',
			dictRemoveFile    : '取消',
			dictDefaultMessage: '',
			dictCancelUpload  : '取消上传',
			maxFiles          : 1
		};
		let componentConfig = {
			iconFiletypes   : ['.jpg', '.jpeg', '.png', '.gif', '.ico'],
			showFiletypeIcon: true,
			postUrl         : tsResourzes.Image.getComputedUrl()
		};
		let {thumbnail} = this.state;
		let imageElements, img;
		if (!this.state.showUpload) {
			if (thumbnail) {
				img = (
					<div className = "dz-preview dz-processing dz-image-preview dz-success dz-complete">
						<div className = "dz-image">
							<img onClick = {this.handleEditImage} src = {webHelper.getThumbnailURL(thumbnail)}
							     className = "tc-pointer-cursor"/>
						</div>
						<a className = "dz-remove" onClick = {this.handleEditImage}>重选图片</a>
					</div>
				);
				componentConfig.showFiletypeIcon = false;
			}
			else {
				img = (
					<div>
						<div className = "row">
							<a className = "dz-message">点击添加图片</a>
						</div>
						<div className = "row">
							<small className = "subheader">#可将文件拖入此处#</small>
						</div>
					</div>
				);
				componentConfig.showFiletypeIcon = true;
			}
		}
		imageElements = (
			<DropzoneComponent ref = "upload" config = {componentConfig} djsConfig = {djsConfig}
			                   eventHandlers = {eventHandlers} className = "large-8 push-2">
				{img}
			</DropzoneComponent>
		);
		return imageElements;
	},
	render() {
		let {isActive, openRoomId} = this.props,
			{name, description, amount, presentCoin, productId} = this.state;
		return (
			<Modal isOpen = {isActive} onAfterOpen = {this.afterOpenFn} modalName = "RechargeMallModal"
			       style = {customStyles}>
				<div className = "row filter-icon-row">
					{this.renderDropzone()}
				</div>
				<div className = "row">
					<div className = "large-8 columns">
						<label>名称：
							<input id = "name" type = "text" ref = "name"
							       value = {name} onChange = {this.handleInputChange}/>
						</label>
					</div>
					<div className = "large-4 columns">
						<label>苹果商城ID：
							<input id = "productId" type = "text" ref = "productId"
							       value = {productId} onChange = {this.handleInputChange}/>
						</label>
					</div>
				</div>
				<div className = "row">
					<div className = "large-12 columns">
						<label>描述：
							<textarea id = "description" ref = "description"
							          rows = "5" value = {description}
							          onChange = {this.handleInputChange} className = "unresizable-area"/>
						</label>
					</div>
				</div>
				<div className = "row">
					<div className = "large-6 columns">
						<label>充值金额（单位：元）：
							<input id = "amount" type = "text" ref = "amount"
							       value = {amount} onChange = {this.handleInputChange}/>
						</label>
					</div>
					<div className = "large-6 columns">
						<label>额外赠送代币数：
							<input id = "presentCoin" type = "text" ref = "presentCoin"
							       value = {presentCoin} onChange = {this.handleInputChange}/>
						</label>
					</div>
				</div>
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
			</Modal>
		);
	}
});

function mapStateToProps(state) {
	return {
		isActive          : state.getIn(['app', 'appInfo', 'modals', constants.MODAL_RECHARGEMALL]),
		users             : state.getIn(['data', 'users']),
		rechargeMalls     : state.getIn(['data', 'rechargeMalls']),
		openRechargeMallId: state.getIn(['app', 'appInfo', 'openRechargeMallId'])
	};
}

export default connect(mapStateToProps, {
	updateRechargeMall,
	createRechargeMall,
	closeRechargeMallModal
})(RechargeMallModal);
