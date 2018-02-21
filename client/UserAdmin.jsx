import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'underscore';

import AlertPanel from './SiteComponents/AlertPanel';
import Input from './FormComponents/Input';
import Checkbox from './FormComponents/Checkbox';
import Panel from './SiteComponents/Panel';

import * as actions from './actions';

class InnerUserAdmin extends React.Component {
    constructor(props) {
        super(props);

        this.defaultPermissions = {
            canEditNews: false,
            canManageUsers: false
        };

        this.state = {
            permissions: this.props.currentUser ? (this.props.currentUser.permissions || this.defaultPermissions) : this.defaultPermissions,
            disabled: this.props.currentUser ? this.props.currentUser.disabled : false,
            verified: this.props.currentUser ? this.props.currentUser.verified : false,
            username: ''
        };

        this.permissions = [
            { name: 'canEditNews', label: 'News Editor' },
            { name: 'canManageUsers', label: 'User Manager' }
        ];

        this.onDisabledChanged = this.onDisabledChanged.bind(this);
        this.onVerifiedChanged = this.onVerifiedChanged.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({
            permissions: props.currentUser ? (props.currentUser.permissions || this.defaultPermissions) : this.defaultPermissions,
            disabled: this.props.currentUser ? this.props.currentUser.disabled : false,
            verified: this.props.currentUser ? this.props.currentUser.verified : false
        });
    }

    onUsernameChange(event) {
        this.setState({ username: event.target.value });
    }

    onFindClick(event) {
        event.preventDefault();

        this.props.findUser(this.state.username);
    }

    onSaveClick(event) {
        event.preventDefault();

        this.props.currentUser.permissions = this.state.permissions;
        this.props.currentUser.disabled = this.state.disabled;
        this.props.currentUser.verified = this.state.verified;

        this.props.saveUser(this.props.currentUser);
    }

    onPermissionToggle(field, event) {
        var newState = {};
        newState.permissions = this.state.permissions;

        newState.permissions[field] = event.target.checked;
        this.setState(newState);
    }

    onDisabledChanged(event) {
        this.setState({ disabled: event.target.checked });
    }

    onVerifiedChanged(event) {
        this.setState({ verified: event.target.checked });
    }

    render() {
        let content = null;
        let successPanel = null;

        if(this.props.userSaved) {
            setTimeout(() => {
                this.props.clearUserStatus();
            }, 5000);
            successPanel = (
                <AlertPanel message='User saved successfully' type={ 'success' } />
            );
        }

        let notFoundMessage = this.props.apiStatus === 404 ? <AlertPanel type='warning' message='No users found' /> : null;

        let renderedUser = null;

        if(this.props.currentUser) {
            let permissions = _.map(this.permissions, (permission) => {
                return (<Checkbox key={ permission.name } name={ 'permissions.' + permission.name } label={ permission.label } fieldClass='col-xs-4'
                    type='checkbox' onChange={ this.onPermissionToggle.bind(this, permission.name) } checked={ this.state.permissions[permission.name] } />);
            });

            renderedUser = (
                <div>
                    <form className='form'>
                        <dl className='dl-horizontal'>
                            <dt>Username:</dt><dd>{ this.props.currentUser.username }</dd>
                            <dt>Email:</dt><dd>{ this.props.currentUser.email }</dd>
                            <dt>Registered:</dt><dd>{ this.props.currentUser.registered }</dd>
                        </dl>

                        <h4>Permissions</h4>
                        <div>
                            { permissions }
                            <Checkbox name={ 'disabled' } label='Disabled' fieldClass='col-xs-4' type='checkbox'
                                onChange={ this.onDisabledChanged } checked={ this.state.disabled } />
                            <Checkbox name={ 'verified' } label='Verified' fieldClass='col-xs-4' type='checkbox'
                                onChange={ this.onVerifiedChanged } checked={ this.state.verified } />
                        </div>
                        <div className='col-xs-12' />
                        <button type='button' className='btn btn-primary col-xs-1' onClick={ this.onSaveClick.bind(this) }>Save</button>
                    </form>
                </div>
            );
        }

        if(this.props.loading) {
            content = <div>Searching for user...</div>;
        } else if(this.props.apiError && this.props.apiStatus !== 404) {
            content = <AlertPanel type='error' message={ this.props.apiError } />;
        } else {
            content = (
                <div className='col-sm-offset-2 col-sm-8'>
                    { notFoundMessage }
                    { successPanel }
                    <Panel title='User administration'>
                        <form className='form'>
                            <Input name='username' fieldClass='user-search' label={ 'Search for a user' } value={ this.state.username } onChange={ this.onUsernameChange.bind(this) } placeholder={ 'Enter username' } />
                            <button type='submit' className='btn btn-primary' onClick={ this.onFindClick.bind(this) }>Find</button>
                        </form>
                    </Panel>
                    { this.props.currentUser ?
                        <Panel title={ `${this.props.currentUser.username} - User details` }>
                            { renderedUser }
                        </Panel>
                        : null }
                </div>);
        }

        return content;
    }
}

InnerUserAdmin.displayName = 'UserAdmin';
InnerUserAdmin.propTypes = {
    apiError: PropTypes.string,
    apiStatus: PropTypes.number,
    clearUserStatus: PropTypes.func,
    currentUser: PropTypes.object,
    findUser: PropTypes.func,
    loading: PropTypes.bool,
    saveUser: PropTypes.func,
    userSaved: PropTypes.bool
};

function mapStateToProps(state) {
    return {
        apiError: state.api.message,
        apiStatus: state.api.status,
        currentUser: state.admin.currentUser,
        loading: state.api.loading,
        userSaved: state.admin.userSaved
    };
}

const UserAdmin = connect(mapStateToProps, actions)(InnerUserAdmin);

export default UserAdmin;

