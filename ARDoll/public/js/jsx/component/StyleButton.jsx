/**
 * Created by admin on 2017/10/13.
 */
'use strict';

import React from 'react';

const StyleButton = React.createClass({
	onToggle(e) {
		e.preventDefault();
		this.props.onToggle(this.props.style);
	},
	render() {
		let className = 'RichEditor-styleButton';
		if (this.props.active) {
			className += ' RichEditor-activeButton';
		}
		return (
			<span className = {className} onMouseDown = {this.onToggle}>
              {this.props.label}
            </span>
		);
	}
});

export default StyleButton;