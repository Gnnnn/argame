'use strict';

import constants from './constants';
import configs from './appConfigs';

const helper = {
	query(params) {
		var strParams = '';
		for (var key in params) {
			if (params.hasOwnProperty(key)) {
				if (!strParams) {
					strParams += key + ':' + params[key];
				}
				else {
					strParams += ',' + key + ':' + params[key];
				}
			}
		}
		let qParams = {};
		if (strParams) {
			qParams.q = strParams;
		}
		return qParams;
	},
	getThumbnailURL(imageId, width, height) {
		if (!imageId) {
			return '';
		}
		var rtnUrl = `http://${configs.webUrl}:${configs.port}/images/${imageId}`;
		if (typeof width === 'object') {
			var option = width;
			if (option.width && option.height) {
				rtnUrl += `/w/${option.width}/h/${option.height}`;
			}
			if (option.mobile) {
				rtnUrl += '/mobile';
			}
		}
		else if (width && height) {
			rtnUrl += `/w/${width}/h/${height}`;
		}
		return rtnUrl;
	},
	FakePromise() {
		return new Promise(function (resolve, reject) {
			reject({message: constants.ERROR_CODE_FAKE});
		});
	},
	randomString(len) {
		len = len || 12;
		var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
		/****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
		var maxPos = $chars.length;
		var pwd = '';
		var i;
		for (i = 0; i < len; i++) {
			pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
		}
		return pwd;
	},
	scrollTo(offset){
		const onBody = !!document.body.scrollTop || !document.body.parentElement.scrollTop;

		function getEl() {
			return onBody ? document.body : document.body.parentElement;
		}

		let speed = (getEl().scrollTop - offset) / 20;
		const compare = speed > 0 ? 'max' : 'min';
		speed = Math[compare](150, -150, speed);
		var animateFrame;
		const scrollTop = ()=> {
			var element = getEl();
			let isEndTop = element.scrollTop - speed < 0 && element.scrollTop === 0;
			let isEndBottom = element.scrollTop - speed > (element.scrollHeight - element.clientHeight)
			                  && element.scrollTop === element.scrollHeight - element.clientHeight;
			if (element.scrollTop !== offset && !isEndTop && !isEndBottom) {
				element.scrollTop = Math[compare](element.scrollTop - speed, offset);
				animateFrame = requestAnimationFrame(scrollTop);
			}
			else {
				cancelAnimationFrame(animateFrame);
			}
		};

		animateFrame = requestAnimationFrame(scrollTop);
	},
	scrollTop(){
		helper.scrollTo(0);
	},
	scrollToElement(id){
		var ele = document.getElementById(id);
		if (ele) {
			var top = ele.getBoundingClientRect().top;
			if (top < 0 || top >= screen.availHeight - 50) {
				helper.scrollTo(ele.offsetTop);
			}
		}
	},
	addClass(el, className){
		if (el.className.indexOf(className) === -1) {
			el.className += ` ${className}`;
		}
	},
	removeClass(el, className){
		if (el.className.indexOf(className) > -1) {
			el.className = el.className.replace(className, '');
		}
	},
	isNetworkBroken(err){
		return err.code === 'ECONNABORTED';
	}
};

export default helper;
