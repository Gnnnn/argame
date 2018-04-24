/**
 * Created by Koan on 2017/10/17.
 */
'use strict';

import React from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import {connect} from 'react-redux';
import {loadRetention} from '../../actions/api';

function getDayLengthArray(actives) {
	var date = [];
	actives.forEach(ac => {
		if (ac) {
			date.push(ac.dayLength);
		}
	});
	return date;
}

function getCount(actives, totalVisitor) {
	var data = [];
	actives.forEach(ac => {
		if (ac) {
			data.push(ac.count / totalVisitor);
		}
	});
	return data;
}

const RetentionPage = React.createClass({
	componentWillReceiveProps(nextProps) {
		if (nextProps.loginUserId && this.props.loginUserId !== nextProps.loginUserId) {
			this.props.loadRetention();
		}
		if (nextProps.retention !== this.props.retention) {
			let date = getDayLengthArray(nextProps.retention),
				data = getCount(nextProps.retention, nextProps.totalVisitor);

			// 基于准备好的dom，初始化echarts实例
			let myChart = echarts.init(document.getElementById('main'));
			// 绘制图表
			myChart.setOption({
				tooltip: {
					trigger : 'axis',
					position: function (pt) {
						return [pt[0], '10%'];
					}
				},
				title  : {
					left: 'center',
					text: '留存率统计图',
				},
				xAxis  : {
					type       : 'category',
					boundaryGap: false,
					data       : date
				},
				yAxis  : {
					type: 'value'
				},
				series : [
					{
						name     : '留存率',
						type     : 'line',
						smooth   : true,
						symbol   : 'none',
						sampling : 'average',
						itemStyle: {
							normal: {
								color: 'rgb(255, 70, 131)'
							}
						},
						areaStyle: {
							normal: {
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
									offset: 0,
									color : 'rgb(255, 158, 68)'
								}, {
									offset: 1,
									color : 'rgb(255, 70, 131)'
								}])
							}
						},
						data     : data
					}
				]
			});
		}
	},
	render() {
		return (
			<div id = "main" style = {{width: 800, height: 800}}></div>
		);
	},
	componentDidMount() {
		if (this.props.loginUserId) {
			this.props.loadRetention();
		}
	}
});

function mapStateToProps(state) {
	return {
		loginUserId : state.getIn(['app', 'loginData', 'loginUserId']),
		retention   : state.getIn(['app', 'actives', 'retention']),
		totalVisitor: state.getIn(['app', 'actives', 'totalVisitor'])
	};
}

export default connect(mapStateToProps, {
	loadRetention
})(RetentionPage);