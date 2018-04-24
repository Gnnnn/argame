/**
 * Created by Koan on 2017/10/10.
 */

'use strict';

import React, {PropTypes} from 'react';
import ReactPureRenderMixin from 'react-addons-pure-render-mixin';
import {tsPropTypes} from '../../utils';

const TopBar = React.createClass({
	displayName: 'TopBar',
	mixins     : [ReactPureRenderMixin],
	propTypes  : {
		title: PropTypes.string.isRequired,
		user : tsPropTypes.user,
	},
	render() {
		let {title, user} = this.props;
		return (
			<div className = "contain-to-grid">
				<nav className = "top-bar" role = "navigation">
					<ul className = "title-area">
						<li className = "name">
							<h1>{title}</h1>
						</li>
					</ul>
					<section className = "top-bar-section">
						<ul className = "right">
							<li><a href = "#">{user ? user.get('name') : '请登录'}</a></li>
						</ul>
					</section>
				</nav>
			</div>
		);
	}
});

export default TopBar;