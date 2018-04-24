'use strict';
/**
 * Created by Koan on 2017.9.25
 */

import React from 'react';
import {Route, IndexRedirect} from 'react-router';
import App from './App';
import {
	AdvicePage,
	AnnouncementPage,
	CategoryPage,
	DailyActivePage,
	DollPage,
	DollMachinePage,
	DollMachinePawPage,
	Login,
	MonthlyActivePage,
	PointMallPage,
	PushPage,
	RechargeMallPage,
	RetentionPage,
	RoomPage,
	TagPage,
	NoticePage,
	OrderPage,
	VersionPage,
} from './layout';

export default (
	<Route path = "/" component = {App}>
		<IndexRedirect to = "/login"/>
		<Route path = "/login" component = {Login}/>
		<Route path = "/push" component = {PushPage}/>
		<Route path = "/advice" component = {AdvicePage}/>
		<Route path = "/dailyActive" component = {DailyActivePage}/>
		<Route path = "/monthlyActive" component = {MonthlyActivePage}/>
		<Route path = "/retention" component = {RetentionPage}/>
		<Route path = "/versions" component = {VersionPage}/>
		<Route path = "/notices" component = {NoticePage}/>
		<Route path = "/announcements" component = {AnnouncementPage}/>
		<Route path = "/dolls" component = {DollPage}/>
		<Route path = "/dollMachines" component = {DollMachinePage}/>
		<Route path = "/dollMachinePaws" component = {DollMachinePawPage}/>
		<Route path = "/rooms" component = {RoomPage}/>
		<Route path = "/categories" component = {CategoryPage}/>
		<Route path = "/tags" component = {TagPage}/>
		<Route path = "/rechargeMalls" component = {RechargeMallPage}/>
		<Route path = "/pointMalls" component = {PointMallPage}/>
		<Route path = "/orders" component = {OrderPage}/>
	</Route>
);
