/**
 * Created by admin on 2017/10/11.
 */
'use strict';

import React from 'react';
import {connect} from 'react-redux';
import Pagination from 'rc-pagination';
import classNames from 'classnames';
import {loadVersions} from '../../actions/api';
import {createVersion, openVersionModal} from '../../actions/client';
import {dateHelper, appConfigs} from '../../utils';

const VersionPage = React.createClass({
    clearRefsValues() {
        this.refs.newVersion.value = '';
        this.refs.newUpdateNews.value = '';
    },
    handleChangePage(page) {
        this.props.loadVersions(page);
    },
    handleCreate(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.createVersion(
            this.refs.newVersion.value,
            this.refs.newUpdateNews.value,
            this.clearRefsValues
        );
    },
    handleOpenModalClick(versionId) {
        this.props.openVersionModal(versionId);
    },
    componentWillReceiveProps(nextProps) {
        if (nextProps.loginUserId && this.props.loginUserId !== nextProps.loginUserId) {
            this.props.loadVersions(1);
        }
    },
    renderCreatePanel() {
        let zIndex = {zIndex: 0};
        return (
            <div>
                <small>#版本号发布后不允许修改或删除，且每次发布的版本必须比上一版新</small>
                <hr/>
                <div className = "row">
                    <div className = "large-12 columns">
                        <label>版本号：
                            <input type = "text" placeholder = "输入版本号" ref = "newVersion"/>
                        </label>
                    </div>
                </div>
                <div className = "row">
                    <div className = "large-12 columns">
                        <label>更新履历：
                            <textarea className = "unresizable-area" rows = "5" placeholder = "输入更新履历"
                                      ref = "newUpdateNews"/>
                        </label>
                    </div>
                </div>
                <div className = "row">
                    <div className = "small-2 push-10 columns">
                        <a className = {classNames('button postfix', {disabled: this.props.onSending})}
                           onClick = {this.handleCreate} style = {zIndex}>提交</a>
                    </div>
                </div>
            </div>
        );
    },
    renderTable() {
        let {users, versions, loadedVersions, versionCount, versionCurrentPage} = this.props,
            trs = [];
        versionCurrentPage = versionCurrentPage || 1;
        if (loadedVersions && loadedVersions.size > 0) {
            trs = loadedVersions.toArray().map((versionId) => {
                let version = versions.get(versionId);
                if (version) {
                    let userId = version.get('user'),
                        userName;
                    if (users) {
                        userName = users.getIn([userId, 'name']);
                    }
                    return (
                        <tr key = {version.get('_id')}
                            onClick = {this.handleOpenModalClick.bind(null, version.get('_id'))}>
                            <td><input value = {version.get('version')} readOnly = "readonly"/></td>
                            <td>
                                <input value = {version.get('updateNews')} readOnly = "readonly"/>
                            </td>
                            <td><input value = {userName || ''} readOnly = "readonly"/></td>
                            <td><input value = {dateHelper.format(version.get('uploadTime'), 'yyyy-MM-dd HH:mm')}
                                       readOnly = "readonly"/></td>
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
                        <th width = "150">版本号</th>
                        <th width = "400">更新履历</th>
                        <th width = "100">发布人</th>
                        <th width = "150">发布时间</th>
                    </tr>
                    </thead>
                    <tbody>
                    {trs}
                    </tbody>
                </table>
                <Pagination onChange = {this.handleChangePage} current = {versionCurrentPage}
                            pageSize = {appConfigs.versionCountPrePage}
                            total = {versionCount}/>
            </div>
        );
    },
    render() {
        return (
            <div>
                {this.renderCreatePanel()}
                <hr/>
                {this.renderTable()}
            </div>
        );
    },
    componentDidMount() {
        if (this.props.loginUserId) {
            this.props.loadVersions(1);
        }
    }
});

function mapStateToProps(state) {
    return {
        loginUserId       : state.getIn(['app', 'loginData', 'loginUserId']),
        users             : state.getIn(['data', 'users']),
        versions          : state.getIn(['data', 'versions']),
        loadedVersions    : state.getIn(['data', 'loadedVersions']),
        versionCount      : state.getIn(['data', 'versionCount']),
        versionCurrentPage: state.getIn(['data', 'versionCurrentPage']),
        onSending         : state.getIn(['app', 'appInfo', 'onSending'])
    };
}

export default connect(mapStateToProps, {
    loadVersions,
    createVersion,
    openVersionModal
})(VersionPage);