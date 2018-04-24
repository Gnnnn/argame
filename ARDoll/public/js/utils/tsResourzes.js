'use strict';
/**
 * Created by Koan on 2017.9.25
 */
import assign from 'lodash/assign';
import resourzeFactoryProvider from './resourzeFactoryProvider';
import config from './appConfigs';

var apiFactory = resourzeFactoryProvider(config.serverUrl, {
	port     : config.port,
	prefixUrl: 'api'
});

var commonFactory = resourzeFactoryProvider(config.serverUrl, {
	port: config.port
});

var User = apiFactory('users/:id', {id: '@_id'}, {
	me      : {
		method: 'GET',
		params: {id: 'me'}
	},
	updateMe: {
		method: 'PUT',
		params: {id: 'me'}
	}
});

var Token = apiFactory('token/:type');

var Push = apiFactory('push/:id', {id: '@_id'});

var Image = apiFactory('images', null);

var File = apiFactory('files', null);

var Advice = apiFactory('advice/:id', {id: '@_id'});

var Active = apiFactory('active/:type', {type: '@type'});

var Notice = apiFactory('notices/:id', {id: '@_id'});

var Version = apiFactory('versions', null, {
	lastest: {
		method: 'GET',
		url   : 'versions/lastest'
	}
});

var Doll = apiFactory('dolls/:id', {id: '@_id'});

var DollMachine = apiFactory('dollMachines/:id', {id: '@_id'});

var DollMachinePaw = apiFactory('dollMachinePaws/:id', {id: '@_id'});

var Category = apiFactory('categories/:id', {id: '@_id'});

var Tag = apiFactory('tags/:id', {id: '@_id'});

var Room = apiFactory('rooms/:id', {id: '@_id'});

var RechargeMall = apiFactory('rechargeMalls/:id', {id: '@_id'});

var PointMall = apiFactory('pointMalls/:id', {id: '@_id'});

var Announcement = apiFactory('announcements/:id', {id: '@_id'});

var Order = apiFactory('orders/:id', {id: '@_id'});

export default {
	User,
	Token,
	Push,
	Image,
	File,
	Advice,
	Active,
	Notice,
	Version,
	Doll,
	DollMachine,
	DollMachinePaw,
	Category,
	Tag,
	Room,
	RechargeMall,
	PointMall,
	Announcement,
	Order,
	headers(key, value) {
		if (arguments.length > 1) {
			var newHeader = {};
			newHeader[key] = value;
			apiFactory.provider.headers = assign(apiFactory.provider.headers, newHeader);
		}
		else if (arguments.length === 1) {
			if (key != null) {
				apiFactory.provider.headers = key;
			}
		}
		return apiFactory.provider.headers;
	}
};

// ============================ normalizr ============================
import {normalize, Schema, arrayOf} from 'normalizr';

const userSchema = new Schema('users', {idAttribute: '_id'});
const pushSchema = new Schema('push', {idAttribute: '_id'});
const adviceSchema = new Schema('advice', {idAttribute: '_id'});
const noticeSchema = new Schema('notices', {idAttribute: '_id'});
const versionSchema = new Schema('versions', {idAttribute: '_id'});
const dollSchema = new Schema('dolls', {idAttribute: '_id'});
const dollMachineSchema = new Schema('dollMachines', {idAttribute: '_id'});
const dollMachinePawSchema = new Schema('dollMachinePaws', {idAttribute: '_id'});
const visitorSchema = new Schema('visitors', {idAttribute: '_id'});
const categorySchema = new Schema('categories', {idAttribute: '_id'});
const tagSchema = new Schema('tags', {idAttribute: '_id'});
const roomSchema = new Schema('rooms', {idAttribute: '_id'});
const rechargeMallSchema = new Schema('rechargeMalls', {idAttribute: '_id'});
const pointMallSchema = new Schema('pointMalls', {idAttribute: '_id'});
const announcementSchema = new Schema('announcements', {idAttribute: '_id'});
const orderSchema = new Schema('orders', {idAttribute: '_id'});
const playRecordSchema = new Schema('playRecords', {idAttribute: '_id'});

pushSchema.define(
	{
		user: userSchema
	}
);

adviceSchema.define(
	{
		visitor   : visitorSchema,
		handleUser: userSchema
	}
);

noticeSchema.define(
	{
		uploadUser      : userSchema,
		lastModifiedUser: userSchema
	}
);

versionSchema.define(
	{user: userSchema}
);

dollSchema.define(
	{
		uploadUser      : userSchema,
		lastModifiedUser: userSchema
	}
);

dollMachineSchema.define(
	{
		uploadUser      : userSchema,
		lastModifiedUser: userSchema
	}
);

dollMachinePawSchema.define(
	{
		uploadUser      : userSchema,
		lastModifiedUser: userSchema
	}
);

categorySchema.define(
	{
		uploadUser      : userSchema,
		lastModifiedUser: userSchema
	}
);

tagSchema.define(
	{
		uploadUser      : userSchema,
		lastModifiedUser: userSchema
	}
);

roomSchema.define(
	{
		uploadUser      : userSchema,
		lastModifiedUser: userSchema,
		doll            : dollSchema,
		dollMachine     : dollMachineSchema,
		dollMachinePaw  : dollMachinePawSchema,
		category        : categorySchema,
		tag             : tagSchema
	}
);

rechargeMallSchema.define(
	{
		uploadUser      : userSchema,
		lastModifiedUser: userSchema
	}
);

pointMallSchema.define(
	{
		uploadUser      : userSchema,
		lastModifiedUser: userSchema,
		category        : categorySchema,
		tag             : tagSchema
	}
);

announcementSchema.define(
	{
		uploadUser      : userSchema,
		lastModifiedUser: userSchema
	}
);

orderSchema.define(
	{
		playRecord: playRecordSchema,
		pointMall : pointMallSchema,
		visitor   : visitorSchema,
		handleUser: userSchema
	}
);

playRecordSchema.define(
	{
		room: roomSchema
	}
);

export const schemas = {
	user          : userSchema,
	push          : pushSchema,
	advice        : adviceSchema,
	notice        : noticeSchema,
	version       : versionSchema,
	doll          : dollSchema,
	dollMachine   : dollMachineSchema,
	dollMachinePaw: dollMachinePawSchema,
	category      : categorySchema,
	tag           : tagSchema,
	room          : roomSchema,
	rechargeMall  : rechargeMallSchema,
	pointMall     : pointMallSchema,
	announcement  : announcementSchema,
	order         : orderSchema
};