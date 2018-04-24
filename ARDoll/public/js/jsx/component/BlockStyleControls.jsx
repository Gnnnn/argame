/**
 * Created by admin on 2017/10/13.
 */
'use strict';

import React from 'react';
import {StyleButton} from './index';

const BLOCK_TYPES = [
	{label: 'H1', style: 'header-one'},
	{label: 'H2', style: 'header-two'},
	{label: 'H3', style: 'header-three'},
	{label: 'H4', style: 'header-four'},
	{label: 'H5', style: 'header-five'},
	{label: 'H6', style: 'header-six'},
// 	{label: 'Blockquote', style: 'blockquote'},
	{label: '无序列表', style: 'unordered-list-item'},
	{label: '有序列表', style: 'ordered-list-item'}
// 	{label: 'Code Block', style: 'code-block'},
];

const BlockStyleControls = React.createClass({
	render() {
		const {editorState} = this.props;
		const selection = editorState.getSelection();
		const blockType = editorState
			.getCurrentContent()
			.getBlockForKey(selection.getStartKey())
			.getType();
		return (
			<div className = "RichEditor-controls">
				{BLOCK_TYPES.map((type) =>
					<StyleButton
						key = {type.label}
						active = {type.style === blockType}
						label = {type.label}
						onToggle = {this.props.onToggle}
						style = {type.style}
					/>
				)}
			</div>
		);
	}
});

export default BlockStyleControls;