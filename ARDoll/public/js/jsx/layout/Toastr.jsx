import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import imPropTypes from 'react-immutable-proptypes';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ReactPureRenderMixin from 'react-addons-pure-render-mixin';
import {popMessage} from '../../actions/client';

var Toastr = React.createClass({
	displayName: 'Toastr',
	mixins     : [ReactPureRenderMixin],
	propTypes  : {
		messages   : imPropTypes.listOf(imPropTypes.contains({
			message: PropTypes.string.isRequired,
			type   : PropTypes.oneOf(['error', 'info']).isRequired
		})).isRequired,
		popMessage : PropTypes.func.isRequired,
		animate    : PropTypes.string,
		animateTime: PropTypes.number
	},
	getDefaultProps() {
		return {
			animate    : 'tc-error-fade-right-right',
			animateTime: 250
		};
	},
	handlePopMessage(id) {
		delete this.timeouts[id];
		this.props.popMessage();
	},
	componentDidUpdate() {
		let messages = this.props.messages;
		if (messages) {
			messages.forEach(message => {
				const id = message.get('id');
				if (!this.timeouts[id]) {
					this.timeouts[id] = setTimeout(this.handlePopMessage.bind(this, id), 3000);
				}
			});
		}
	},
	renderMessage() {
		const {messages} = this.props;
		if (messages) {
			var size = messages.size;
			return (
				messages.map((message, num) => {
					var move = (size - 1 - num) * 46;
					return (<span key = {message.get('id')}
					              className = {classNames('tc-toastr', this.props.animate, {error: message.get('type') === 'error'})}
					              style = {{bottom: move + 'px'}}>{message.get('message')}</span>);
				})
			);
		}
	},
	render() {
		return (
			<ReactCSSTransitionGroup className = "tc-toastr-container"
			                         transitionName = "tc-error"
			                         transitionEnterTimeout = {this.props.animateTime}
			                         transitionLeaveTimeout = {this.props.animateTime}>
				{this.renderMessage()}
			</ReactCSSTransitionGroup>
		);
	},
	componentWillMount() {
		this.timeouts = {};
	}
});

function mapStateToProps(state) {
	return {
		messages: state.getIn(['app', 'messages'])
	};
}

export default connect(mapStateToProps, {
	popMessage
})(Toastr);