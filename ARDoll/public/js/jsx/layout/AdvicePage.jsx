/**
 * Created by admin on 2017/10/10.
 */
'use strict';

import React from 'react';
import {connect} from 'react-redux';
import Pagination from 'rc-pagination';
import {loadAdvice} from '../../actions/api';
import {openAdvice, exportExcel} from '../../actions/client';
import {tsResourzes, dateHelper, appConfigs, constants} from '../../utils';

const AdvicePage = React.createClass({
	handleExport() {
		let url = tsResourzes.Advice.getComputedUrl({id: 'excel'}) + '#' + Math.random();
		this.props.exportExcel(url);
	},
	handleRowClick(adviceId) {
		this.props.openAdvice(adviceId);
	},
	handleChangePage(page) {
		this.props.loadAdvice(page);
	},
	componentWillReceiveProps(nextProps) {
		if (nextProps.loginUserId && this.props.loginUserId !== nextProps.loginUserId) {
			this.props.loadAdvice(1);
		}
	},
	render() {
		let {users, advice, loadedAdvice, adviceCount, adviceCurrentPage} = this.props,
			trs = [];
		adviceCurrentPage = adviceCurrentPage || 1;
		if (loadedAdvice && loadedAdvice.size > 0) {
			trs = loadedAdvice.toArray().map((adviceId) => {
				let singleAdvice = advice.get(adviceId);
				if (singleAdvice) {
					let handleUser = users ? users.getIn([singleAdvice.get('handleUser'), 'name']) : '';
					return (
						<tr key = {singleAdvice.get('_id')}
						    onClick = {this.handleRowClick.bind(null, singleAdvice.get('_id'))}>
							<td><input
								value = {constants.ADVICE_MSG_TYPE[singleAdvice.get('messageType')] || '用户反馈'}
								readOnly = "readonly"/></td>
							<td><input value = {singleAdvice.get('message')} readOnly = "readonly"/></td>
							<td><input
								value = {dateHelper.format(singleAdvice.get('uploadTime'), 'yyyy-MM-dd HH:mm')}
								readOnly = "readonly"/></td>
							<td><input
								value = {constants.ADVICE_HANDLESTATE[singleAdvice.get('handleState')] || '待处理'}
								readOnly = "readonly"/></td>
							<td><input value = {handleUser || ''} readOnly = "readonly"/></td>
						</tr>
					);
				}
			});
		}

		return (
			<div>
				<table>
					<thead>
					<tr>
						<th width = "100">反馈类型</th>
						<th width = "500">反馈内容</th>
						<th width = "150">反馈时间</th>
						<th width = "100">处理状态</th>
						<th width = "100">处理人</th>
					</tr>
					</thead>
					<tbody>
					{trs}
					</tbody>
				</table>

				<div className = "rows">
					<div className = "large-11 columns">
						<Pagination onChange = {this.handleChangePage} current = {adviceCurrentPage}
						            pageSize = {appConfigs.adviceCountPrePage}
						            total = {adviceCount}/>
					</div>
					<div className = "large-1 columns">
						<button className = "button postfix tc-circle"
						        onClick = {this.handleExport}>导出
						</button>
					</div>
				</div>
			</div>
		);
	},
	componentDidMount() {
		if (this.props.loginUserId) {
			this.props.loadAdvice(1);
		}
	}
});

function mapStateToProps(state) {
	return {
		loginUserId      : state.getIn(['app', 'loginData', 'loginUserId']),
		users            : state.getIn(['data', 'users']),
		advice           : state.getIn(['data', 'advice']),
		loadedAdvice     : state.getIn(['data', 'loadedAdvice']),
		adviceCount      : state.getIn(['data', 'adviceCount']),
		adviceCurrentPage: state.getIn(['data', 'adviceCurrentPage'])
	};
}

export default connect(mapStateToProps, {
	loadAdvice,
	openAdvice,
	exportExcel
})(AdvicePage);