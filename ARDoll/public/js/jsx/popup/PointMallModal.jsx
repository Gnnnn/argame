'use strict';

import React from 'react';
import ReactPureRenderMixin from 'react-addons-pure-render-mixin';
import {List} from 'immutable';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {
	SelectTagModal,
	SelectCategoryModal
} from './index';
import {Modal} from '../component';
import {updatePointMall} from '../../actions/api';
import {
	createPointMall,
	closePointMallModal,
	openCategorySelectModal,
	openTagSelectModal
} from '../../actions/client';
import {constants, webHelper, tsResourzes} from '../../utils';
import DropzoneComponent from 'react-dropzone-component';

let customStyles = {
	content: {
		width    : '600px',
		height   : '530px',
		marginTop: '100px'
	}
};

const fileComponentConfig = {
	showFiletypeIcon: false,
	postUrl         : tsResourzes.File.getComputedUrl()
};

const PointMallModal = React.createClass({
	displayName: 'PointMallModal',
	mixins     : [ReactPureRenderMixin],
	getInitialState() {
		return {
			name        : '',
			description : '',
			thumbnail   : '',
			showUpload  : false,
			imageId     : '',
			document    : '',
			consumePoint: 0,
			price       : 0,
			categoryId  : '',
			categoryName: '',
			tagId       : '',
			tagName     : ''
		};
	},
	afterOpenFn() {
		let {openPointMallId, pointMalls, categories, tags} = this.props;
		let pointMall;
		if (openPointMallId && pointMalls) {
			pointMall = pointMalls.get(openPointMallId);
		}
		if (pointMall) {
			this.setState({
				name        : pointMall.get('name'),
				description : pointMall.get('description'),
				thumbnail   : pointMall.get('thumbnail'),
				showUpload  : false,
				document    : pointMall.get('document'),
				consumePoint: pointMall.get('consumePoint'),
				price       : pointMall.get('price'),
				categoryId  : '',
				categoryName: '',
				tagId       : '',
				tagName     : ''
			});
			if (categories && pointMall.get('category')) {
				this.setState({
					categoryId  : pointMall.get('category'),
					categoryName: categories.getIn([pointMall.get('category'), 'name'])
				});
			}
			if (tags && pointMall.get('tag')) {
				this.setState({
					tagId  : pointMall.get('tag'),
					tagName: tags.getIn([pointMall.get('tag'), 'name'])
				});
			}
		}
		else {
			this.setState({
				name        : '',
				description : '',
				showUpload  : false,
				thumbnail   : '',
				imageId     : '',
				document    : '',
				consumePoint: 0,
				price       : 0,
				categoryId  : '',
				categoryName: '',
				tagId       : '',
				tagName     : ''
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
	handleOpenCategorySelectModal() {
		this.props.openCategorySelectModal();
	},
	handleCategorySelect(categoryId) {
		let {categories} = this.props;
		if (categories && categoryId) {
			this.setState({
				categoryId  : categoryId,
				categoryName: categories.getIn([categoryId, 'name'])
			});
		}
	},
	handleOpenTagSelectModal() {
		this.props.openTagSelectModal();
	},
	handleTagSelect(tagId) {
		let {tags} = this.props;
		if (!tagId) {
			this.setState({
				tagId  : '',
				tagName: ''
			});
		}
		else if (tags) {
			this.setState({
				tagId  : tagId,
				tagName: tags.getIn([tagId, 'name'])
			});
		}
	},
	handleSave() {
		let name = this.refs.name.value,
			description = this.refs.description.value,
			thumbnail = this.state.imageId || this.state.thumbnail || null,
			document = this.state.document || null,
			consumePoint = this.refs.consumePoint.value,
			price = this.refs.price.value,
			categoryId = this.state.categoryId,
			tagId = this.state.tagId,
			{openPointMallId} = this.props;
		let data = {
			name,
			description,
			thumbnail,
			document,
			consumePoint,
			price,
			category: categoryId,
			tag     : tagId
		};
		if (openPointMallId) {
			this.props.updatePointMall(openPointMallId, data);
		}
		else {
			this.props.createPointMall(data);
		}
	},
	handleClose() {
		this.props.closePointMallModal();
	},
	handleUploadFileSuccess(file, res) {
		this.refs.uploadFile.dropzone.removeFile(file);
		let {document} = this.state;
		document = ((document && document.toArray) ? document.toArray() : document) || [];
		document.push(res);
		this.setState({
			document: List(document)
		});
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
	handleRemoveImageFile() {
		this.setState({
			showUpload: false
		});
		this.refs.upload.dropzone.enable();
	},
	handleRemoveImage(fileId) {
		let {document} = this.state;
		document = ((document && document.toArray) ? document.toArray() : document) || [];
		if (document.indexOf(fileId) > -1) {
			document.splice(document.indexOf(fileId), 1);
		}
		this.setState({
			document: List(document)
		});
	},
	renderFileDropzone() {
		let fileEventHandlers = {
			success: this.handleUploadFileSuccess
		};
		let fileDjsConfig = {
			addRemoveLinks    : true,
			uploadMultiple    : false,
			headers           : {
				[constants.TOKEN_KEY]: tsResourzes.headers()[constants.TOKEN_KEY]
			},
			acceptedFiles     : 'image/jpeg,image/png,image/gif,image/x-icon',
			autoProcessQueue  : true,
			parallelUploads   : 1,
			dictDefaultMessage: '',
			dictRemoveFile    : '上传成功，取消',
			dictCancelUpload  : '取消上传',
			maxFiles          : 99
		};
		let {document} = this.state;
		document = ((document && document.toArray) ? document.toArray() : document) || [];
		let files;
		files = document.map((fileId) => {
			return (
				<div className = "small-3 columns ts-multiimg" key = {fileId}>
					<img onClick = {this.handleRemoveImage.bind(null, fileId)} src = {webHelper.getThumbnailURL(fileId)}
					     className = "tc-pointer-cursor"/>
				</div>
			);
		});
		let filesNode = (
			<div className = "row">
				{files}
			</div>
		);

		return (
			<DropzoneComponent ref = "uploadFile" config = {fileComponentConfig}
			                   djsConfig = {fileDjsConfig}
			                   eventHandlers = {fileEventHandlers}
			                   className = "large-6 columns ts-multiimg-upload-custom">
				{filesNode}
			</DropzoneComponent>
		);
	},
	renderDropzone() {
		let eventHandlers = {
			success    : this.handleUploadSuccess,
			addedfile  : this.handleWillUpload,
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
			                   eventHandlers = {eventHandlers} className = "large-6 columns">
				{img}
			</DropzoneComponent>
		);
		return imageElements;
	},
	render() {
		let {isActive, openPointMallId} = this.props,
			{name, description, consumePoint, price} = this.state;
		return (
			<Modal isOpen = {isActive} onAfterOpen = {this.afterOpenFn} modalName = "PointMallModal"
			       style = {customStyles}>
				<div className = "row filter-icon-row">
					<div className = "large-12 columns">
						{this.renderDropzone()}
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
							<textarea id = "description" ref = "description"
							          rows = "5" value = {description}
							          onChange = {this.handleInputChange} className = "unresizable-area"/>
						</label>
					</div>
				</div>
				<div className = "row">
					<div className = "large-6 columns">
						<label>消费积分：
							<input id = "consumePoint" type = "text" ref = "consumePoint"
							       value = {consumePoint} onChange = {this.handleInputChange}/>
						</label>
					</div>
					<div className = "large-6 columns">
						<label>原价：
							<input id = "price" type = "text" ref = "price"
							       value = {price} onChange = {this.handleInputChange}/>
						</label>
					</div>
				</div>
				<div className = "row">
					<div className = "large-6 columns">
						<label>分类：
							<div className = "row collapse">
								<div className = "small-10 columns">
									<input id = "categoryName" type = "text" ref = "categoryName" disabled = "true"
									       value = {this.state.categoryName}/>
								</div>
								<div className = "small-2 columns">
									<a className = 'button postfix'
									   onClick = {this.handleOpenCategorySelectModal}>...</a>
								</div>
							</div>
						</label>
					</div>
					<div className = "large-6 columns">
						<label>标签：
							<div className = "row collapse">
								<div className = "small-10 columns">
									<input id = "tagName" type = "text" ref = "tagName"
									       disabled = "true" value = {this.state.tagName}/>
								</div>
								<div className = "small-2 columns">
									<a className = 'button postfix'
									   onClick = {this.handleOpenTagSelectModal}>...</a>
								</div>
							</div>
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
				<SelectCategoryModal rowClick = {this.handleCategorySelect}/>
				<SelectTagModal rowClick = {this.handleTagSelect}/>
			</Modal>
		);
	}
});

function mapStateToProps(state) {
	return {
		isActive       : state.getIn(['app', 'appInfo', 'modals', constants.MODAL_POINTMALL]),
		users          : state.getIn(['data', 'users']),
		pointMalls     : state.getIn(['data', 'pointMalls']),
		openPointMallId: state.getIn(['app', 'appInfo', 'openPointMallId']),
		categories     : state.getIn(['data', 'categories']),
		tags           : state.getIn(['data', 'tags'])
	};
}

export default connect(mapStateToProps, {
	updatePointMall,
	createPointMall,
	closePointMallModal,
	openCategorySelectModal,
	openTagSelectModal
})(PointMallModal);
