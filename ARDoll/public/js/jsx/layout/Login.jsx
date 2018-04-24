/**
 * Created by Koan on 2017/9/25.
 */
'use strict';

import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {login, logout} from '../../actions/client';
import {newMessage, createUser, updateUser, userUpdateTablist, addUserTablist} from  '../../actions/client';

const Login = React.createClass({
	propTypes: {
		error    : PropTypes.string,
		onSending: PropTypes.bool,
		login    : PropTypes.func.isRequired,
	},
	handleLoginKeyDown(e) {
		if (e.keyCode === 13) {
			this.handleLogin(e);
		}
	},
	handleLogin(e) {
		e.preventDefault();
		e.stopPropagation();
		this.props.login(
			this.refs.userName.value,
			this.refs.password.value,
		);
	},
	handleLogout(e) {
		e.preventDefault();
		e.stopPropagation();
		this.props.logout();
	},
	clearPasswordRefsValues(){
		this.refs.oldPassword.value = '';
		this.refs.newPassword.value = '';
		this.refs.confirmedPassword.value = '';
	},
	handleChangePassword(e){
		e.preventDefault();
		e.stopPropagation();
		let oldPassword = this.refs.oldPassword.value,
			newPassword = this.refs.newPassword.value,
			confirmedPassword = this.refs.confirmedPassword.value;
		this.props.updateUser(oldPassword, newPassword, confirmedPassword, this.clearPasswordRefsValues);
	},
	clearCreateUserRefsValues(){
		this.refs.newUser.value = '';
		this.refs.newUserPassword.value = '';
		this.refs.newUserConfirmed.value = '';
	},
	handleCreateUser(e){
		e.preventDefault();
		e.stopPropagation();
		let newUser = this.refs.newUser.value,
			newUserPassword = this.refs.newUserPassword.value,
			newUserConfirmed = this.refs.newUserConfirmed.value;
		this.props.createUser(newUser, newUserPassword, newUserConfirmed, this.clearCreateUserRefsValues);
	},
	handlePanelClick(isEditing, e){
		if (e.target.name === 'update') {
			this.props.userUpdateTablist(isEditing);
		}
		else {
			this.props.addUserTablist(isEditing);
		}
	},
	renderUpdateUser(){
		let {isEditingUpdate}=this.props;
		return (
			<div>
				<a className = "accordion-title" name = "update" role = "tab" id = "panel1d-heading"
				   onClick = {this.handlePanelClick.bind(null, isEditingUpdate)}>修改密码</a>
				<hr/>
				<div className = {classNames('', ' panelhidden', {active: isEditingUpdate})}>
					<div className = "row" key = "current">
						<div className = "columns large-4"><label>当前密码:</label></div>
						<div className = "columns large-8 pull-1"><input type = "password" ref = "oldPassword"/>
						</div>
					</div>
					<div className = "row" key = "new">
						<div className = "columns large-4"><label>&nbsp;新&nbsp;密&nbsp;码:</label></div>
						<div className = "columns large-8 pull-1"><input type = "password" ref = "newPassword"/>
						</div>
					</div>
					<div className = "row" key = "confirmed">
						<div className = "columns large-4"><label>确认密码:</label></div>
						<div className = "columns large-8 pull-1"><input type = "password"
						                                                 ref = "confirmedPassword"/>
						</div>
					</div>
					<a className = "push-4" onClick = {this.handleChangePassword}>确定</a>
					<hr/>
				</div>
			</div>
		);
	},
	renderAddUser(){
		let {isEditingAdd}=this.props;
		return (
			<div>
				<a className = "accordion-title" name = "add" role = "tab" id = "panel2d-heading"
				   onClick = {this.handlePanelClick.bind(null, isEditingAdd)}>添加管理员</a>
				<div className = {classNames(' panelhidden', {active: isEditingAdd})}>
					<hr/>
					<div className = "row" key = "newUser">
						<div className = "columns large-4"><label>用户名:</label></div>
						<div className = "columns large-8 pull-1"><input type = "text" ref = "newUser"/></div>
					</div>
					<div className = "row" key = "newUserPassword">
						<div className = "columns large-4"><label>&nbsp;密&nbsp;&nbsp;码:</label></div>
						<div className = "columns large-8 pull-1"><input type = "password" ref = "newUserPassword"/>
						</div>
					</div>
					<div className = "row" key = "newUserConfirmed">
						<div className = "columns large-4"><label>确认密码:</label></div>
						<div className = "columns large-8 pull-1"><input type = "password"
						                                                 ref = "newUserConfirmed"/>
						</div>
					</div>
					<a className = "push-4" onClick = {this.handleCreateUser}>确定</a>
				</div>
			</div>
		);
	},
	renderTablist(){
		return (
			<div className = "vcard vcard-width" role = "tablist">
				{this.renderUpdateUser()}
				{this.renderAddUser()}
				<hr/>
				<a className = "accordion-title" onClick = {this.handleLogout}>注销</a>
			</div>
		);
	},
	render() {
		let {loginUserId, users} = this.props,
			loginUser;
		if (loginUserId && users && users.size > 0) {
			loginUser = users.get(loginUserId);
		}
		if (loginUser) {
			return (
				<div className = "login-page">
					<h4 className = "welcome">
						<strong className = "">{loginUser.get('name')}</strong>
						<span className = "">,欢迎回来！</span>
					</h4>
					{this.renderTablist()}
				</div>
			);
		}
		else {
			return (
				<div>
					<div className = "row">
						<label>用户名：
							<div className = "row collapse">
								<input type = "text" placeholder = "输入用户名" ref = "userName"/>
							</div>
						</label>
					</div>

					<div className = "row">
						<label>密码：
							<div className = "row collapse">
								<div className = "small-10 columns">
									<input type = "password" placeholder = "输入密码" ref = "password"
									       onKeyUp = {this.handleLoginKeyDown}/>
								</div>
								<div className = "small-2 columns">

									<a className = {classNames('button postfix', {disabled: this.props.onSending})}
									   onClick = {this.handleLogin}>登录</a>
								</div>
							</div>
						</label>
					</div>
				</div>
			);
		}
	},
	componentDidMount() {

	}
});

function mapStateToProps(state) {
	return {
		loginUserId    : state.getIn(['app', 'loginData', 'loginUserId']),
		users          : state.getIn(['data', 'users']),
		onSending      : state.getIn(['app', 'appInfo', 'onSending']),
		isEditingUpdate: state.getIn(['app', 'accordion', 'userUpdate']),
		isEditingAdd   : state.getIn(['app', 'accordion', 'addUser'])
	};
}

export default connect(mapStateToProps, {
	login,
	logout,
	updateUser,
	newMessage,
	createUser,
	userUpdateTablist,
	addUserTablist
})(Login);