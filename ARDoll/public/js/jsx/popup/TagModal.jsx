/**
 * Created by admin on 2017/11/20.
 */
'use strict';

import React from 'react';
import ReactPureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import classNames from 'classnames';
import DropzoneComponent from 'react-dropzone-component';
import {Modal} from '../component';
import {updateTag} from '../../actions/api';
import {closeTagModal, createTag} from '../../actions/client';
import {constants, tsResourzes, webHelper} from '../../utils';

const fileComponentConfig = {
	showFiletypeIcon: false,
	postUrl         : tsResourzes.File.getComputedUrl()
};
let customStyles = {
	content: {
		width    : '500px',
		height   : '420px',
		marginTop: '170px'
	}
};

const TagModal = React.createClass({
	displayName: 'TagModal',
	mixins     : [ReactPureRenderMixin],
	getInitialState() {
		return {
			name           : '',
			description    : '',
			thumbnail      : '',
			imageId        : '',
			showImageUpload: false,
			document       : '',
			fileId         : '',
			showFileUpload : false
		};
	},
	afterOpenFn() {
		let {openTagId, tags} = this.props;
		let tag;
		if (openTagId && tags) {
			tag = tags.get(openTagId);
		}
		if (tag) {
			this.setState({
				name           : tag.get('name'),
				description    : tag.get('description'),
				thumbnail      : tag.get('thumbnail'),
				showImageUpload: false,
				imageId        : '',
				document       : tag.get('document'),
				fileId         : '',
				showFileUpload : ''
			});
		}
		else {
			this.setState({
				name           : '',
				description    : '',
				thumbnail      : '',
				imageId        : '',
				showImageUpload: false,
				document       : '',
				fileId         : '',
				showFileUpload : ''
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
			document = this.state.fileId || this.state.document || null,
			{openTagId} = this.props;
		let data = {name, description, thumbnail, document};
		if (openTagId) {
			this.props.updateTag(openTagId, data);
		}
		else {
			this.props.createTag(data);
		}
	},
	handleClose() {
		this.props.closeTagModal();
	},
	handleUploadFileSuccess(file, res) {
		this.setState({
			showFileUpload: true,
			fileId        : res
		});
		this.refs.uploadFile.dropzone.disable();
	},
	handleFileWillUpload() {
		this.setState({
			showFileUpload: true
		});
	},
	handleRemoveFile() {
		this.setState({
			showFileUpload: false
		});
		this.refs.uploadFile.dropzone.enable();
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
	handleImageUploadSuccess(file, res) {
		this.setState({
			showImageUpload: true,
			imageId        : res
		});
		this.refs.upload.dropzone.disable();
	},
	handleImageWillUpload() {
		this.setState({
			showImageUpload: true
		});
	},
	handleRemoveImageFile() {
		this.setState({
			showImageUpload: false
		});
		this.refs.upload.dropzone.enable();
	},
	renderImageDropzone() {
		let eventHandlers = {
			success    : this.handleImageUploadSuccess,
			addedfile  : this.handleImageWillUpload,
			removedfile: this.handleRemoveImageFile
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
		if (!this.state.showImageUpload) {
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
			                   eventHandlers = {eventHandlers} className = "large-8 columns">
				{img}
			</DropzoneComponent>
		);
		return imageElements;
	},
	renderFileDropzone() {
		let fileEventHandlers = {
			success    : this.handleUploadFileSuccess,
			addedfile  : this.handleFileWillUpload,
			removedfile: this.handleRemoveFile
		};
		let fileDjsConfig = {
			addRemoveLinks    : true,
			uploadMultiple    : false,
			headers           : {
				[constants.TOKEN_KEY]: tsResourzes.headers()[constants.TOKEN_KEY]
			},
			autoProcessQueue  : true,
			parallelUploads   : 1,
			dictDefaultMessage: '',
			dictRemoveFile    : '上传成功，取消',
			dictCancelUpload  : '取消上传',
			maxFiles          : 1
		};
		let {document} = this.state;
		let file;
		if (!this.state.showFileUpload) {
			if (document) {
				file = (
					<div className = "tc-empty-file-dropzone">
						<div className = "row">
							<span>文件已存在</span>
						</div>
						<div className = "dz-preview dz-processing dz-image-preview dz-success dz-complete">
							<a className = "tc-pointer-cursor" onClick = {this.handleEditImage}>重选文件</a>
						</div>
					</div>
				);
			}
			else {
				file = (
					<div className = "tc-empty-file-dropzone">
						<div className = "row">
							<a className = "dz-message">点击添加文件</a>
						</div>
						<div className = "row">
							<small className = "subheader">#可将文件拖入此处#</small>
						</div>
					</div>
				);
			}
		}
		return (
			<DropzoneComponent ref = "uploadFile" config = {fileComponentConfig} djsConfig = {fileDjsConfig}
			                   eventHandlers = {fileEventHandlers} className = "tc-file-dropzone large-4 columns">
				{file}
			</DropzoneComponent>
		);
	},
	render() {
		let {isActive} = this.props,
			{name, description} = this.state;
		return (
			<Modal isOpen = {isActive} onAfterOpen = {this.afterOpenFn} modalName = "TagModal"
			       style = {customStyles}>
				<div className = "row filter-icon-row">
					<div className = "large-12 columns">
						{this.renderImageDropzone()}
						{this.renderFileDropzone()}
					</div>
				</div>
				<div className = "row">
					<div className = "large-12 columns">
						<label>名称：
							<input id = "name" type = "text" ref = "name"
							       value = {name} onChange = {this.handleInputChange}/>
						</label>
					</div>
				</div>
				<div className = "row">
					<div className = "large-12 columns">
						<label>描述：
							<textarea id = "description"
							          ref = "description"
							          value = {description}
							          onChange = {this.handleInputChange}
							          rows = "5"
							          className = "unresizable-area"/>
						</label>
					</div>
				</div>
				<div className = "row">
					<div className = "large-2 push-8 columns">
						<a className = {classNames('button postfix', {disabled: this.props.onSending})}
						   onClick = {this.handleSave}>保存</a>
					</div>
					<div className = "large-2 columns">
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
		isActive : state.getIn(['app', 'appInfo', 'modals', constants.MODAL_TAG]),
		users    : state.getIn(['data', 'users']),
		tags     : state.getIn(['data', 'tags']),
		openTagId: state.getIn(['app', 'appInfo', 'openTagId']),
		onSending: state.getIn(['app', 'appInfo', 'onSending'])
	};
}

export default connect(mapStateToProps, {
	updateTag,
	closeTagModal,
	createTag
})(TagModal);