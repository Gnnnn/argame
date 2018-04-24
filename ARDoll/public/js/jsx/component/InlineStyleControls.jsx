/**
 * Created by admin on 2017/10/13.
 */
'use strict';

import React from 'react';
import {StyleButton} from './index';

var INLINE_STYLES = [
	{label: '加粗', style: 'BOLD'},
	{label: '斜体', style: 'ITALIC'},
	{label: '下划线', style: 'UNDERLINE'}
// 	{label: 'Monospace', style: 'CODE'},
];

const InlineStyleControls = React.createClass({
	render() {
		var currentStyle = this.props.editorState.getCurrentInlineStyle();
		return (
			<div className = "RichEditor-controls">
				{INLINE_STYLES.map(type =>
					<StyleButton
						key = {type.label}
						active = {currentStyle.has(type.style)}
						label = {type.label}
						onToggle = {this.props.onToggle}
						style = {type.style}
					/>
				)}
			</div>
		);
	}
});

export default InlineStyleControls;