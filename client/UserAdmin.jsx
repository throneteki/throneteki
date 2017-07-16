import React from 'react';
import {connect} from 'react-redux';
import _ from 'underscore';

import AlertPanel from './SiteComponents/AlertPanel.jsx';
import Input from './FormComponents/Input.jsx';

import * as actions from './actions';

class InnerUserAdmin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: ''
        };
    }

    componentWillMount() {
    }

    onUsernameChange(event) {
        this.setState({ username: event.target.value });
    }

    onFindClick(event) {
        event.preventDefault();

        this.props.findUser(this.state.username);
    }

    render() {
        let content = null;
        let successPanel = null;

        // if(this.props.newsSaved) {
        //     setTimeout(() => {
        //         this.props.clearNewsStatus();
        //     }, 5000);
        //     successPanel = (
        //         <AlertPanel message='News added successfully' type={ 'success' } />
        //     );

        //     this.props.loadNews({ forceLoad: true });
        // }

        if(this.props.loading) {
            content = <div>Loading news from the server...</div>;
        } else if(this.props.apiError) {
            content = <AlertPanel type='error' message={ this.props.apiError } />;
        } else {
            content = (
                <div>
                    <form className='form'>
                        <Input name='username' label={ 'Search for a user' } value={ this.state.username } onChange={ this.onUsernameChange.bind(this) } placeholder={ 'Enter username' } />
                        <button type='submit' className='btn btn-primary' onClick={ this.onFindClick.bind(this) }>Find</button>
                    </form>
                </div>);
        }

        return content;
    }
}

InnerUserAdmin.displayName = 'UserAdmin';
InnerUserAdmin.propTypes = {
    apiError: React.PropTypes.string,
    findUser: React.PropTypes.func,
    loading: React.PropTypes.bool
};

function mapStateToProps(state) {
    return {
        apiError: state.api.message,
        loading: state.api.loading
    };
}

const UserAdmin = connect(mapStateToProps, actions)(InnerUserAdmin);

export default UserAdmin;

