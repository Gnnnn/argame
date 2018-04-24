'use strict';

import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {push} from 'react-router-redux';
import {TopBar} from './component';
import {Toastr} from './layout';
import {recoverLoginToken, resetAllMessage, newMessage} from '../actions/client';
import {
	AdviceModal,
	AnnouncementModal,
	CategoryModal,
	DownloadFrame,
	NoticeModal,
	PointMallModal,
	PushModal,
	VersionModal,
	DollModal,
	DollMachineModal,
	DollMachinePawModal,
	TagModal,
	RoomModal,
	RechargeMallModal,
	OrderModal,
	UserModal
} from './popup';

const App = React.createClass({
	componentWillReceiveProps: function (nextProps) {
		let {loginUserId, hasTriedLogin, location} = nextProps;
		if (!loginUserId && hasTriedLogin && location.pathname !== '/login') {
			this.props.newMessage({type: 'error', message: '请先登录'});
			this.props.push('/login');
		}
	},
	render() {
		let {loginUserId, users} = this.props,
			loginUser;
		if (loginUserId && users && users.size > 0) {
			loginUser = users.get(loginUserId);
		}
		return (
			<div>
				<TopBar title = "抓东东" user = {loginUser}/>
				<div className = "row content">
					<div className = "large-2 columns">
						<ul className = "side-nav">
							<li><Link to = "/login">登录</Link></li>
							<li className = "divider"></li>
							<li><Link to = "/categories">分类</Link></li>
							<li><Link to = "/tags">标签</Link></li>
							<li><Link to = "/dolls">娃娃</Link></li>
							<li><Link to = "/dollMachines">娃娃机</Link></li>
							<li><Link to = "/dollMachinePaws">娃娃机爪子</Link></li>
							<li><Link to = "/rooms">房间配置</Link></li>
							<li className = "divider"></li>
							<li><Link to = "/rechargeMalls">充值商城</Link></li>
							<li><Link to = "/pointMalls">积分商城</Link></li>
							<li className = "divider"></li>
							<li><Link to = "/push">推送</Link></li>
							<li className = "divider"></li>
							<li><Link to = "/advice">反馈信息</Link></li>
							<li><Link to = "/orders">订单</Link></li>
							<li className = "divider"></li>
							<li><Link to = "/versions">app版本信息</Link></li>
							{/*<li><Link to = "/notices">app公告</Link></li>*/}
							<li><Link to = "/announcements">app公告</Link></li>
							<li className = "divider"></li>
							<li><Link to = "/dailyActive">日活统计</Link></li>
							<li><Link to = "/monthlyActive">月活统计</Link></li>
							<li><Link to = "/retention">留存统计</Link></li>
							{/*<li><Link to = "/User">查找用户</Link></li>*/}
							<li><Link to = "/versions">查找用户</Link></li>
						</ul>
					</div>
					<div className = "large-10 columns view-fade">
						{this.props.children}
					</div>
				</div>
				<Toastr/>
				<AdviceModal/>
				<DownloadFrame/>
				<NoticeModal/>
				<PushModal/>
				<VersionModal/>
				<DollModal/>
				<DollMachineModal/>
				<DollMachinePawModal/>
				<RoomModal/>
				<CategoryModal/>
				<TagModal/>
				<RechargeMallModal/>
				<PointMallModal/>
				<AnnouncementModal/>
				<OrderModal/>
				{/*<UserModal/>*/}
			</div>
		);
	},
	componentDidMount() {
		this.props.recoverLoginToken();
		this.props.resetAllMessage();
	}
});

function mapStateToProps(state) {
	return {
		loginUserId  : state.getIn(['app', 'loginData', 'loginUserId']),
		users        : state.getIn(['data', 'users']),
		hasTriedLogin: state.getIn(['app', 'loginData', 'hasTriedLogin'])
	};
}

export default connect(mapStateToProps, {
	recoverLoginToken,
	resetAllMessage,
	newMessage,
	push
})(App);