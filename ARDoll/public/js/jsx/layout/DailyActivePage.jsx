/**
 * Created by Koan on 2017/10/17.
 */
'use strict';

import React from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/dataZoom';
import {connect} from 'react-redux';
import {exportExcel} from '../../actions/client';
import {loadDailyActive} from '../../actions/api';
import {tsResourzes} from '../../utils';

function getDateArray(actives) {
	var date = [];
	actives.forEach(ac => {
		if (ac) {
			date.push(ac.day);
		}
	});
	return date;
}

function getCount(actives) {
	var data = [];
	actives.forEach(ac => {
		if (ac) {
			data.push(ac.count);
		}
	});
	return data;
}

const DailyActivePage = React.createClass({
	handleExport() {
		let url = tsResourzes.Active.getComputedUrl({type: 'daily'}) + '/excel' + '#' + Math.random();
		this.props.exportExcel(url);
	},
	componentWillReceiveProps(nextProps) {
		if (nextProps.loginUserId && this.props.loginUserId !== nextProps.loginUserId) {
			this.props.loadDailyActive();
		}
		if (nextProps.dailyActives !== this.props.dailyActives) {
			let date = getDateArray(nextProps.dailyActives),
				data = getCount(nextProps.dailyActives);

			// 基于准备好的dom，初始化echarts实例
			let myChart = echarts.init(document.getElementById('main'));
			// 绘制图表
			myChart.setOption({
				tooltip : {
					trigger : 'axis',
					position: function (pt) {
						return [pt[0], '10%'];
					}
				},
				title   : {
					left: 'center',
					text: '日活跃数统计图',
				},
				xAxis   : {
					type       : 'category',
					boundaryGap: false,
					data       : date
				},
				toolbox : {
					right   : '10%',
					itemSize: 30,
					feature : {
						myTool: {
							show   : true,
							title  : '导出数据',
							icon   : 'path://M102.745,48.964h-2.449V37.146c0-0.074-0.012-0.148-0.021-0.223c-0.004-0.469-0.154-0.93-0.475-1.295L80.133,13.163\n' +
							         '\tc-0.006-0.006-0.012-0.008-0.016-0.014c-0.117-0.131-0.254-0.24-0.398-0.334c-0.043-0.029-0.086-0.053-0.131-0.078\n' +
							         '\tc-0.125-0.068-0.258-0.125-0.395-0.166c-0.037-0.01-0.07-0.025-0.107-0.035c-0.148-0.035-0.303-0.057-0.459-0.057H30.295\n' +
							         '\tc-2.207,0-4,1.795-4,4v32.484h-2.449c-3.157,0-5.717,2.559-5.717,5.717v29.73c0,3.156,2.56,5.717,5.717,5.717h2.449v20.352\n' +
							         '\tc0,2.205,1.793,4,4,4h66c2.205,0,4-1.795,4-4V90.128h2.449c3.157,0,5.717-2.561,5.717-5.717v-29.73\n' +
							         '\tC108.461,51.522,105.902,48.964,102.745,48.964z M30.295,16.479h46.332v20.465c0,1.105,0.896,2,2,2h17.668v10.02h-66V16.479z\n' +
							         '\t M70.817,71.016c-3.931-1.369-6.495-3.543-6.495-6.984c0-4.037,3.37-7.125,8.952-7.125c2.666,0,4.632,0.561,6.035,1.193\n' +
							         '\tl-1.193,4.316c-0.947-0.455-2.632-1.123-4.948-1.123c-2.316,0-3.439,1.053-3.439,2.281c0,1.51,1.333,2.176,4.386,3.334\n' +
							         '\tc4.176,1.545,6.142,3.721,6.142,7.055c0,3.967-3.054,7.336-9.547,7.336c-2.702,0-5.369-0.701-6.703-1.439l1.087-4.422\n' +
							         '\tc1.439,0.736,3.651,1.475,5.932,1.475c2.458,0,3.755-1.018,3.755-2.563C74.782,72.877,73.659,72.033,70.817,71.016z M61.764,76.455\n' +
							         '\tv4.494H46.986V57.291h5.372v19.164H61.764z M29.826,80.949h-6.107l6.844-11.971l-6.599-11.688h6.143l2.07,4.318\n' +
							         '\tc0.702,1.439,1.229,2.596,1.791,3.932h0.068c0.563-1.51,1.019-2.563,1.614-3.932l2.001-4.318h6.107l-6.669,11.547l7.021,12.111\n' +
							         '\th-6.177l-2.142-4.283c-0.876-1.648-1.438-2.877-2.105-4.246h-0.07c-0.492,1.369-1.087,2.598-1.825,4.246L29.826,80.949z\n' +
							         '\t M96.295,109.396h-66V90.128h66V109.396z M96.331,80.949l-2.142-4.283c-0.876-1.648-1.438-2.877-2.105-4.246h-0.069\n' +
							         '\tc-0.491,1.369-1.089,2.598-1.827,4.246l-1.964,4.283h-6.108l6.844-11.971l-6.599-11.688h6.143l2.072,4.318\n' +
							         '\tc0.702,1.439,1.227,2.596,1.789,3.932h0.07c0.561-1.51,1.016-2.563,1.614-3.932l2-4.318h6.108l-6.668,11.547l7.019,12.111H96.331z',
							onclick: this.handleExport
						}
					}
				},
				yAxis   : {
					type: 'value'
				},
				dataZoom: [{
					type : 'inside',
					start: 0,
					end  : 100
				}, {
					start      : 0,
					end        : 10,
					handleIcon : 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
					handleSize : '80%',
					handleStyle: {
						color        : '#fff',
						shadowBlur   : 3,
						shadowColor  : 'rgba(0, 0, 0, 0.6)',
						shadowOffsetX: 2,
						shadowOffsetY: 2
					}
				}],
				series  : [
					{
						name     : '日活跃数',
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
			this.props.loadDailyActive();
		}
	}
});

function mapStateToProps(state) {
	return {
		loginUserId : state.getIn(['app', 'loginData', 'loginUserId']),
		dailyActives: state.getIn(['app', 'actives', 'daily'])
	};
}

export default connect(mapStateToProps, {
	loadDailyActive,
	exportExcel
})(DailyActivePage);