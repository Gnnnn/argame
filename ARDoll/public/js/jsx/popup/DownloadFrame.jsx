/**
 * Created by admin on 2017/10/19.
 */
'use strict';

import React from 'react';
import {connect} from 'react-redux';

const DownloadFrame = React.createClass({
	render() {
		return (
			<div>
				<iframe src = {this.props.url} style = {{display: 'none'}}></iframe>
			</div>
		);
	}
});

function mapStateToProps(state) {
	return {
		url: state.getIn(['app', 'appInfo', 'exportUrl'])
	};
}

export default connect(mapStateToProps, {})(DownloadFrame);