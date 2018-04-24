/**
 * Created by admin on 2017/10/13.
 */
'use strict';

import React from 'react';
import {Editor, EditorState, RichUtils, convertFromHTML, ContentState} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import {BlockStyleControls, InlineStyleControls} from './index';

const styleMap = {
	CODE: {
		backgroundColor: 'rgba(0, 0, 0, 0.05)',
		fontFamily     : '"Inconsolata", "Menlo", "Consolas", monospace',
		fontSize       : 16,
		padding        : 2,
	},
};

function getBlockStyle(block) {
	switch (block.getType()) {
		case 'blockquote':
			return 'RichEditor-blockquote';
		default:
			return null;
	}
}

const RichEditor = React.createClass({
	getInitialState() {
		return {
			editorState: EditorState.createEmpty()
		};
	},
	setValue(html) {
		let blocksFromHTML = convertFromHTML(html || ''),
			state = ContentState.createFromBlockArray(
				blocksFromHTML.contentBlocks,
				blocksFromHTML.entityMap,
			);
		this.setState({editorState: EditorState.createWithContent(state)});
	},
	value() {
		return stateToHTML(this.state.editorState.getCurrentContent());
	},
	onChange(editorState) {
		this.setState({editorState});
	},
	handleKeyCommand(command, editorState) {
		const newState = RichUtils.handleKeyCommand(editorState, command);
		if (newState) {
			this.onChange(newState);
			return true;
		}
		return false;
	},
	onTab(e) {
		const maxDepth = 4;
		this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
	},
	toggleBlockType(blockType) {
		this.onChange(
			RichUtils.toggleBlockType(
				this.state.editorState,
				blockType
			)
		);
	},
	toggleInlineStyle(inlineStyle) {
		this.onChange(
			RichUtils.toggleInlineStyle(
				this.state.editorState,
				inlineStyle
			)
		);
	},
	render() {
		const {editorState} = this.state;
		let className = 'RichEditor-editor';
		var contentState = editorState.getCurrentContent();
		if (!contentState.hasText()) {
			if (contentState.getBlockMap().first().getType() !== 'unstyled') {
				className += ' RichEditor-hidePlaceholder';
			}
		}
		return (
			<div className = "RichEditor-root">
				<BlockStyleControls
					editorState = {editorState}
					onToggle = {this.toggleBlockType}
				/>
				<InlineStyleControls
					editorState = {editorState}
					onToggle = {this.toggleInlineStyle}
				/>
				<div className = {className} onClick = {this.focus}>
					<Editor
						blockStyleFn = {getBlockStyle}
						customStyleMap = {styleMap}
						editorState = {editorState}
						handleKeyCommand = {this.handleKeyCommand}
						onChange = {this.onChange}
						onTab = {this.onTab}
						ref = "editor"
						spellCheck = {true}
					/>
				</div>
			</div>
		);
	}
});

export default RichEditor;