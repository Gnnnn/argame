/**
 * Created by admin on 2017/11/20.
 */
'use strict';

import React from 'react';
import Pagination from 'rc-pagination';
import {connect} from 'react-redux';
import {loadRooms, updateRoom} from '../../actions/api';
import {openRoom} from '../../actions/client';
import {dateHelper, appConfigs} from '../../utils';

const RoomPage = React.createClass({
	handleChangePage(page) {
		this.props.loadRooms(page);
	},
	handleRowClick(dollId) {
		this.props.openRoom(dollId);
	},
	handleValidClick(id, e) {
		e.preventDefault();
		e.stopPropagation();
		let text = e.target.textContent,
			validFlg;
		if (text === '未上架') {
			validFlg = true;
		}
		else {
			validFlg = false;
		}
		this.props.updateRoom(id, {validFlg});
	},
	renderTable() {
		let {users, rooms, loadedRooms, roomCount, roomCurrentPage} = this.props,
			trs = [];
		roomCurrentPage = roomCurrentPage || 1;
		if (loadedRooms && loadedRooms.size > 0) {
			trs = loadedRooms.toArray().map((roomId) => {
				let room = rooms.get(roomId);
				if (room) {
					let uploadUserId = room.get('uploadUser'),
						lastModifiedUserId = room.get('lastModifiedUser'),
						uploadUser,
						lastModifiedUser;
					if (users) {
						uploadUser = users.getIn([uploadUserId, 'name']);
						lastModifiedUser = users.getIn([lastModifiedUserId, 'name']);
					}
					return (
						<tr key = {room.get('_id')} onClick = {this.handleRowClick.bind(null, room.get('_id'))}>
							<td><input value = {room.get('name')} readOnly = "readonly"/></td>
							<td>{room.get('thumbnail') ?
							     <span>√</span> :
							     <span>×</span>}
							</td>
							<td>{room.get('shareThumbnail') ?
							     <span>√</span> :
							     <span>×</span>}
							</td>
							<td>{room.get('document') ?
							     <span>√</span> :
							     <span>×</span>}
							</td>
							<td>
								<a onClick = {this.handleValidClick.bind(null, room.get('_id'))}
								   className = "tiny secondary col-btn">{room.get('validFlg') ?
								                                         <span>上架</span> :
								                                         <span>未上架</span>}
								</a>
							</td>
							<td><input value = {lastModifiedUser} readOnly = "readonly"/></td>
							<td><input
								value = {dateHelper.format(room.get('lastModifiedTime'), 'yyyy-MM-dd HH:mm')}
								readOnly = "readonly"/>
							</td>
							<td><input value = {room.get('playedTimes')} readOnly = "readonly"/></td>
							{/*<td><input value = {room.get('probability')} readOnly = "readonly"/></td>*/}
							{/*<td><input value = {room.get('limitNumber')} readOnly = "readonly"/></td>*/}
							<td><input value = {room.get('catchedNumber')} readOnly = "readonly"/></td>
							<td><input value = {room.get('point')} readOnly = "readonly"/></td>
							<td><input value = {room.get('consume')} readOnly = "readonly"/></td>
							<td><input value = {room.get('preferentialConsume')} readOnly = "readonly"/></td>
							<td><input value = {room.get('jackpot')} readOnly = "readonly"/></td>
							<td><input value = {room.get('sortIndex')} readOnly = "readonly"/></td>
						</tr>
					);
				}
			});
		}
		return (
			<div>
				<small>#可点击列表行进行房间的查询和修改，但不能删除；可点击右下角“+”按钮添加新房间</small>
				<hr/>
				<table>
					<thead>
					<tr>
						<th width = "100">名称</th>
						<th width = "50">图片</th>
						<th width = "50">分享图</th>
						<th width = "50">描述图</th>
						<th width = "80">状态</th>
						<th width = "80">修改人</th>
						<th width = "120">修改时间</th>
						<th width = "100">游玩次数</th>
						{/*<th width = "50">抓取概率</th>*/}
						{/*<th width = "100">总数</th>*/}
						<th width = "80">被抓取数量</th>
						<th width = "50">抓取可得积分</th>
						<th width = "50">抓取消耗代币</th>
						<th width = "50">连续抓取消耗代币</th>
						<th width = "50">奖池</th>
						<th width = "50">排序</th>
					</tr>
					</thead>
					<tbody>
					{trs}
					</tbody>
				</table>
				<div className = "rows">
					<div className = "large-11 columns">
						<Pagination onChange = {this.handleChangePage} current = {roomCurrentPage}
						            pageSize = {appConfigs.roomCountPrePage}
						            total = {roomCount}/>
					</div>
					<div className = "large-1 columns">
						<button className = "button postfix tc-circle"
						        onClick = {this.handleRowClick.bind(null, null)}>+
						</button>
					</div>
				</div>
			</div>
		);
	},
	componentWillReceiveProps(nextProps) {
		if (nextProps.loginUserId && this.props.loginUserId !== nextProps.loginUserId) {
			this.props.loadRooms(1);
		}
	},
	render() {
		return (
			<div>
				{this.renderTable()}
			</div>
		);
	},
	componentDidMount() {
		if (this.props.loginUserId) {
			this.props.loadRooms(1);
		}
	}
});

function mapStateToProps(state) {
	return {
		loginUserId    : state.getIn(['app', 'loginData', 'loginUserId']),
		users          : state.getIn(['data', 'users']),
		rooms          : state.getIn(['data', 'rooms']),
		loadedRooms    : state.getIn(['data', 'loadedRooms']),
		roomCount      : state.getIn(['data', 'roomCount']),
		roomCurrentPage: state.getIn(['data', 'roomCurrentPage']),
		onSending      : state.getIn(['app', 'appInfo', 'onSending'])
	};
}

export default connect(mapStateToProps, {
	loadRooms,
	updateRoom,
	openRoom
})(RoomPage);