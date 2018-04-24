/**
 * Created by admin on 2017/10/12.
 */
'use strict';

import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import ReactPureRenderMixin from 'react-addons-pure-render-mixin';

const Modal = React.createClass({
	displayName: 'Modal',
	mixins     : [ReactPureRenderMixin],
	propTypes  : {
		isOpen     : PropTypes.bool,
		onAfterOpen: PropTypes.func.isRequired
	},
	render() {
		return (
			<ReactModal isOpen = {this.props.isOpen} contentLabel = {this.props.modalName} style = {this.props.style}
			            onAfterOpen = {this.props.onAfterOpen}
			            className = {{
				            base       : 'row',
				            afterOpen  : 'modal-after-open',
				            beforeClose: 'modal-before-close'
			            }}
			            overlayClassName = {{
				            base       : 'modal-overlay-bass',
				            afterOpen  : 'modal-overlay-after-open',
				            beforeClose: 'modal-overlay-before-close'
			            }}
			>
				<div className = "modal-content-div">
					{this.props.children}
				</div>
			</ReactModal>
		);
	}
});

export default Modal;