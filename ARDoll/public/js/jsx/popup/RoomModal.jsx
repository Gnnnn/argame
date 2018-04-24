'use strict';

import React from 'react';
import ReactPureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {Modal} from '../component';
import {
	SelectDollModal,
	SelectDollMachineModal,
	SelectDollMachinePawModal,
	SelectTagModal,
	SelectCategoryModal
} from './index';
import {updateRoom} from '../../actions/api';
import {
	createRoom,
	closeRoomModal,
	openDollSelectModal,
	openDollMachineSelectModal,
	openDollMachinePawSelectModal,
	openCategorySelectModal,
	openTagSelectModal
} from '../../actions/client';
import {constants, webHelper, tsResourzes} from '../../utils';
import DropzoneComponent from 'react-dropzone-component';

let customStyles = {
	content: {
		width    : '900px',
		height   : '647px',
		marginTop: '80px'
	}
};

const fileComponentConfig = {
	showFiletypeIcon: false,
	postUrl         : tsResourzes.File.getComputedUrl()
};

const RoomModal = React.createClass({
	displayName: 'RoomModal',
	mixins     : [ReactPureRenderMixin],
	getInitialState() {
		return {
			name                    : '',
			description             : '',
			thumbnail               : '',
			showUpload              : false,
			imageId                 : '',
			shareThumbnail          : '',
			showShareThumbnailUpload: false,
			shareThumbnailImageId   : '',
			document                : '',
			fileId                  : '',
			showFileUpload          : false,
			probability             : '0.01',
			limitNumber             : '0',
			point                   : '0',
			consume                 : '20',
			preferentialConsume     : '18',
			jackpot                 : '500',
			sortIndex               : 0,
			dollId                  : '',
			dollName                : '',
			dollMachineId           : '',
			dollMachineName         : '',
			dollMachinePawId        : '',
			dollMachinePawName      : '',
			categoryId              : '',
			categoryName            : '',
			tagId                   : '',
			tagName                 : ''
		};
	},
	afterOpenFn() {
		let {openRoomId, rooms, dolls, dollMachines, dollMachinePaws, categories, tags} = this.props;
		let room;
		if (openRoomId && rooms) {
			room = rooms.get(openRoomId);
		}
		if (room) {
			this.setState({
				name                    : room.get('name'),
				description             : room.get('description'),
				thumbnail               : room.get('thumbnail'),
				document                : room.get('document'),
				showFileUpload          : false,
				showUpload              : false,
				shareThumbnail          : room.get('shareThumbnail'),
				showShareThumbnailUpload: false,
				probability             : room.get('probability'),
				limitNumber             : room.get('limitNumber'),
				point                   : room.get('point'),
				consume                 : room.get('consume'),
				preferentialConsume     : room.get('preferentialConsume'),
				jackpot                 : room.get('jackpot'),
				sortIndex               : room.get('sortIndex'),
				dollId                  : '',
				dollName                : '',
				dollMachineId           : '',
				dollMachineName         : '',
				dollMachinePawId        : '',
				dollMachinePawName      : '',
				categoryId              : '',
				categoryName            : '',
				tagId                   : '',
				tagName                 : ''
			});
			if (dolls && room.get('doll')) {
				this.setState({
					dollId  : room.get('doll'),
					dollName: dolls.getIn([room.get('doll'), 'name'])
				});
			}
			if (dollMachines && room.get('dollMachine')) {
				this.setState({
					dollMachineId  : room.get('dollMachine'),
					dollMachineName: dollMachines.getIn([room.get('dollMachine'), 'name'])
				});
			}
			if (dollMachinePaws && room.get('dollMachinePaw')) {
				this.setState({
					dollMachinePawId  : room.get('dollMachinePaw'),
					dollMachinePawName: dollMachinePaws.getIn([room.get('dollMachinePaw'), 'name'])
				});
			}
			if (categories && room.get('category')) {
				this.setState({
					categoryId  : room.get('category'),
					categoryName: categories.getIn([room.get('category'), 'name'])
				});
			}
			if (tags && room.get('tag')) {
				this.setState({
					tagId  : room.get('tag'),
					tagName: tags.getIn([room.get('tag'), 'name'])
				});
			}
		}
		else {
			this.setState({
				name                    : '',
				description             : '',
				showUpload              : false,
				thumbnail               : '',
				imageId                 : '',
				document                : '',
				fileId                  : '',
				showFileUpload          : false,
				shareThumbnail          : '',
				showShareThumbnailUpload: false,
				shareThumbnailImageId   : '',
				probability             : '0.01',
				limitNumber             : '0',
				point                   : '0',
				consume                 : '20',
				preferentialConsume     : '18',
				jackpot                 : '500',
				sortIndex               : 0,
				dollId                  : '',
				dollName                : '',
				dollMachineId           : '',
				dollMachineName         : '',
				dollMachinePawId        : '',
				dollMachinePawName      : '',
				categoryId              : '',
				categoryName            : '',
				tagId                   : '',
				tagName                 : ''
			});
		}
	},
	handleOpenDollSelectModal() {
		if (this.props.openRoomId) {
			return;
		}
		this.props.openDollSelectModal();
	},
	handleDollSelect(dollId) {
		let {dolls} = this.props;
		if (dolls && dollId) {
			this.setState({
				dollId  : dollId,
				dollName: dolls.getIn([dollId, 'name'])
			});
		}
	},
	handleOpenDollMachineSelectModal() {
		this.props.openDollMachineSelectModal();
	},
	handleDollMachineSelect(dollMachineId) {
		let {dollMachines} = this.props;
		if (dollMachines && dollMachineId) {
			this.setState({
				dollMachineId  : dollMachineId,
				dollMachineName: dollMachines.getIn([dollMachineId, 'name'])
			});
		}
	},
	handleOpenDollMachinePawSelectModal() {
		this.props.openDollMachinePawSelectModal();
	},
	handleDollMachinePawSelect(dollMachinePawId) {
		let {dollMachinePaws} = this.props;
		if (dollMachinePaws && dollMachinePawId) {
			this.setState({
				dollMachinePawId  : dollMachinePawId,
				dollMachinePawName: dollMachinePaws.getIn([dollMachinePawId, 'name'])
			});
		}
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
			shareThumbnail = this.state.shareThumbnailImageId || this.state.shareThumbnail || null,
			document = this.state.fileId || this.state.document || null,
			probability = this.refs.probability.value,
			limitNumber = this.refs.limitNumber.value,
			point = this.refs.point.value,
			consume = this.refs.consume.value,
			preferentialConsume = this.refs.preferentialConsume.value,
			jackpot = this.refs.jackpot.value,
			sortIndex = this.refs.sortIndex.value,
			dollId = this.state.dollId,
			dollMachineId = this.state.dollMachineId,
			dollMachinePawId = this.state.dollMachinePawId,
			categoryId = this.state.categoryId,
			tagId = this.state.tagId,
			{openRoomId} = this.props;
		let data = {
			name,
			description,
			thumbnail,
			shareThumbnail,
			document,
			probability,
			limitNumber,
			point,
			consume,
			preferentialConsume,
			jackpot,
			sortIndex,
			doll          : dollId,
			dollMachine   : dollMachineId,
			dollMachinePaw: dollMachinePawId,
			category      : categoryId,
			tag           : tagId
		};
		if (openRoomId) {
			this.props.updateRoom(openRoomId, data);
		}
		else {
			this.props.createRoom(data);
		}
	},
	handleClose() {
		this.props.closeRoomModal();
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
							<span>长图已存在</span>
						</div>
						<div className = "dz-preview dz-processing dz-image-preview dz-success dz-complete">
							<a className = "tc-pointer-cursor" onClick = {this.handleEditImage}>重选长图</a>
						</div>
					</div>
				);
			}
			else {
				file = (
					<div className = "tc-empty-file-dropzone">
						<div className = "row">
							<a className = "dz-message">点击添加长图</a>
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
							<a className = "dz-message">点击添加缩略图</a>
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
			                   eventHandlers = {eventHandlers} className = "large-4 columns">
				{img}
			</DropzoneComponent>
		);
		return imageElements;
	},
	handleShareImageUploadSuccess(file, res) {
		this.setState({
			showShareThumbnailUpload: true,
			shareThumbnailImageId   : res
		});
		this.refs.uploadShareImage.dropzone.disable();
	},
	handleShareImageWillUpload() {
		this.setState({
			showShareThumbnailUpload: true
		});
	},
	handleShareImageRemoveImageFile() {
		this.setState({
			showShareThumbnailUpload: false
		});
		this.refs.uploadShareImage.dropzone.enable();
	},
	renderShareDropzone() {
		let eventHandlers = {
			success    : this.handleShareImageUploadSuccess,
			addedfile  : this.handleShareImageWillUpload,
			removedfile: this.handleShareImageRemoveImageFile
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
		let {shareThumbnail} = this.state;
		let imageElements, img;
		if (!this.state.showShareThumbnailUpload) {
			if (shareThumbnail) {
				img = (
					<div className = "dz-preview dz-processing dz-image-preview dz-success dz-complete">
						<div className = "dz-image">
							<img onClick = {this.handleEditImage} src = {webHelper.getThumbnailURL(shareThumbnail)}
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
							<a className = "dz-message">点击添加分享图</a>
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
			<DropzoneComponent ref = "uploadShareImage" config = {componentConfig} djsConfig = {djsConfig}
			                   eventHandlers = {eventHandlers} className = "large-4 columns">
				{img}
			</DropzoneComponent>
		);
		return imageElements;
	},
	render() {
		let {isActive, openRoomId} = this.props,
			{name, description, probability, limitNumber, point, consume, preferentialConsume, jackpot, sortIndex} = this.state;
		return (
			<Modal isOpen = {isActive} onAfterOpen = {this.afterOpenFn} modalName = "RoomModal"
			       style = {customStyles}>
				<div className = "row filter-icon-row">
					<div className = "large-12 columns">
						{this.renderDropzone()}
						{this.renderShareDropzone()}
						{this.renderFileDropzone()}
					</div>
				</div>
				<div className = "row">
					<div className = "large-8 columns">
						<label>名称：
							<input id = "name" type = "text" ref = "name"
							       value = {name} onChange = {this.handleInputChange}/>
						</label>
					</div>
					<div className = "large-4 columns">
						<label>排序序号：
							<input id = "sortIndex" type = "text" ref = "sortIndex"
							       value = {sortIndex} onChange = {this.handleInputChange}/>
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
					<div className = "large-4 columns">
						<label>抓取概率：
							<input id = "probability" type = "text" ref = "probability"
							       value = {probability} onChange = {this.handleInputChange}/>
						</label>
					</div>
					<div className = "large-4 columns">
						<label>总数：
							<input id = "limitNumber" type = "text" ref = "limitNumber"
							       value = {limitNumber} onChange = {this.handleInputChange}/>
						</label>
					</div>
					<div className = "large-4 columns">
						<label>代币奖池：
							<input id = "jackpot" type = "text" ref = "jackpot"
							       value = {jackpot} onChange = {this.handleInputChange}/>
						</label>
					</div>
				</div>
				<div className = "row">
					<div className = "large-4 columns">
						<label>抓取可得积分：
							<input id = "point" type = "text" ref = "point"
							       value = {point} onChange = {this.handleInputChange}/>
						</label>
					</div>
					<div className = "large-4 columns">
						<label>每次抓取消耗代币：
							<input id = "consume" type = "text" ref = "consume"
							       value = {consume} onChange = {this.handleInputChange}/>
						</label>
					</div>
					<div className = "large-4 columns">
						<label>连续抓取消耗代币：
							<input id = "preferentialConsume" type = "text" ref = "preferentialConsume"
							       value = {preferentialConsume} onChange = {this.handleInputChange}/>
						</label>
					</div>
				</div>
				<div className = "row">
					<div className = "large-4 columns">
						<label>娃娃：
							<div className = "row collapse">
								<div className = "small-10 columns">
									<input id = "dollName" type = "text" ref = "dollName" disabled = "true"
									       value = {this.state.dollName}/>
								</div>
								<div className = "small-2 columns">
									<a className = {classNames('button postfix', {disabled: !!openRoomId})}
									   onClick = {this.handleOpenDollSelectModal}>...</a>
								</div>
							</div>
						</label>
					</div>
					<div className = "large-4 columns">
						<label>娃娃机：
							<div className = "row collapse">
								<div className = "small-10 columns">
									<input id = "dollMachineName" type = "text" ref = "dollMachineName"
									       disabled = "true" value = {this.state.dollMachineName}/>
								</div>
								<div className = "small-2 columns">
									<a className = 'button postfix'
									   onClick = {this.handleOpenDollMachineSelectModal}>...</a>
								</div>
							</div>
						</label>
					</div>
					<div className = "large-4 columns">
						<label>娃娃机爪子：
							<div className = "row collapse">
								<div className = "small-10 columns">
									<input id = "dollMachinePawName" type = "text" ref = "dollMachinePawName"
									       disabled = "true" value = {this.state.dollMachinePawName}/>
								</div>
								<div className = "small-2 columns">
									<a className = 'button postfix'
									   onClick = {this.handleOpenDollMachinePawSelectModal}>...</a>
								</div>
							</div>
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
				<SelectDollModal rowClick = {this.handleDollSelect}/>
				<SelectDollMachineModal rowClick = {this.handleDollMachineSelect}/>
				<SelectDollMachinePawModal rowClick = {this.handleDollMachinePawSelect}/>
				<SelectCategoryModal rowClick = {this.handleCategorySelect}/>
				<SelectTagModal rowClick = {this.handleTagSelect}/>
			</Modal>
		);
	}
});

function mapStateToProps(state) {
	return {
		isActive       : state.getIn(['app', 'appInfo', 'modals', constants.MODAL_ROOM]),
		users          : state.getIn(['data', 'users']),
		rooms          : state.getIn(['data', 'rooms']),
		openRoomId     : state.getIn(['app', 'appInfo', 'openRoomId']),
		dolls          : state.getIn(['data', 'dolls']),
		dollMachines   : state.getIn(['data', 'dollMachines']),
		dollMachinePaws: state.getIn(['data', 'dollMachinePaws']),
		categories     : state.getIn(['data', 'categories']),
		tags           : state.getIn(['data', 'tags'])
	};
}

export default connect(mapStateToProps, {
	updateRoom,
	createRoom,
	closeRoomModal,
	openDollSelectModal,
	openDollMachineSelectModal,
	openDollMachinePawSelectModal,
	openCategorySelectModal,
	openTagSelectModal
})(RoomModal);
