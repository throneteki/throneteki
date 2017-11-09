import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AlertPanel from './SiteComponents/AlertPanel';
import Panel from './SiteComponents/Panel';

import * as actions from './actions';

class InnerPasswordGame extends React.Component {
    constructor() {
        super();

        this.state = {
            password: ''
        };
    }

    onJoinClick(event) {
        event.preventDefault();

        if(this.props.passwordJoinType === 'Join') {
            this.props.socket.emit('joingame', this.props.passwordGame.id, this.state.password);
        } else if(this.props.passwordJoinType === 'Watch') {
            this.props.socket.emit('watchgame', this.props.passwordGame.id, this.state.password);
        }
    }

    onCancelClick(event) {
        this.props.cancelPasswordJoin();

        event.preventDefault();
    }

    onPasswordChange(event) {
        this.setState({ password: event.target.value });
    }

    render() {
        if(!this.props.passwordGame) {
            return null;
        }

        return (
            <div>
                <Panel title={ this.props.passwordGame.name }>
                    <div>
                        <h3>Enter the password</h3>
                    </div>
                    <div className='game-password'>
                        <input className='form-control' type='password' onChange={ this.onPasswordChange.bind(this) } value={ this.state.password }/>
                    </div>
                    { this.props.passwordError ?
                        <div>
                            <AlertPanel type='error' message={ this.props.passwordError } />
                        </div>
                        : null }
                    <div>
                        <div className='btn-group'>
                            <button className='btn btn-primary' onClick={ this.onJoinClick.bind(this) }>{ this.props.passwordJoinType }</button>
                            <button className='btn btn-primary' onClick={ this.onCancelClick.bind(this) }>Cancel</button>
                        </div>
                    </div>
                </Panel>
            </div>);
    }
}

InnerPasswordGame.displayName = 'PasswordGame';
InnerPasswordGame.propTypes = {
    cancelPasswordJoin: PropTypes.func,
    passwordError: PropTypes.string,
    passwordGame: PropTypes.object,
    passwordJoinType: PropTypes.string,
    socket: PropTypes.object
};

function mapStateToProps(state) {
    return {
        passwordError: state.games.passwordError,
        passwordGame: state.games.passwordGame,
        passwordJoinType: state.games.passwordJoinType,
        socket: state.socket.socket
    };
}

const PasswordGame = connect(mapStateToProps, actions)(InnerPasswordGame);

export default PasswordGame;

