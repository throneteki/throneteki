import React from 'react';
import _ from 'underscore';
import $ from 'jquery';
import {connect} from 'react-redux';

import Link from './Link.jsx';

import * as actions from './actions';

class InnerParams extends React.Component {
    constructor() {
        super();

        this.state = {
            error: '',
            image_path: '',
            validation: {}
        };

        this.onChange = this.onChange.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    onChange(field, event) {
        var newState = {};

        newState[field] = event.target.value;
        this.setState(newState);
        console.log(newState);
    }

    onSave(event) {
        event.preventDefault();
        this.setState({ error: '' });

        if(_.any(this.state.validation, function(message) {
            return message && message !== '';
        })) {
            this.setState({ error: 'Please complete both fields and try again' });
            return;
        }

        $.ajax({
            url: '/api/account/params',
            type: 'POST',
            data: JSON.stringify({ image_path: this.state.image_path }),
            contentType: 'application/json'
        }).done((data) => {
            if(!data.success) {
                this.setState({ error: data.message });
                return;
            }
        }).fail((xhr) => {
            console.log(xhr);
            if(xhr.status === 401) {
                this.setState({ error: 'something wrong' });
            } else {
                this.setState({ error: 'Could not communicate with the server.  Please try again later.' });
            }
        });

    }

    render() {
        var fields = [
            {
                name: 'image_path',
                label: 'Image path',
                placeholder: 'my/image/path',
                inputType: 'text'
            }
        ];

        var fieldsToRender = [];
        var errorBar = this.state.error ? <div className='alert alert-danger' role='alert'>{ this.state.error }</div> : null;

        _.each(fields, (field) => {
            var className = 'form-group';
            var validation = null;

            if(this.state.validation[field.name]) {
                className += ' has-error';
                validation = <span className='help-block'>{ this.state.validation[field.name]}</span>;
            }

            fieldsToRender.push(
                <div key={ field.name } className={ className }>
                    <label htmlFor={ field.name } className='col-sm-2 control-label'>{ field.label }</label>
                    <div className='col-sm-3'>
                        <input type={ field.inputType }
                            ref={ field.name }
                            className='form-control'
                            id={ field.name }
                            placeholder={ field.placeholder }
                            value={ this.state[field.name]}
                            onChange={ this.onChange.bind(this, field.name) }
                            onBlur={ field.blurCallback } />
                        { validation }
                    </div>
                </div>);
        });

        return (
            <div>
                { errorBar }
                <form className='form form-horizontal'>
                    { fieldsToRender }
                    <div className='form-group'>
                        <div className='col-sm-offset-2 col-sm-3'>
                            <button ref='submit' type='submit' className='btn btn-primary' onClick={ this.onSave }>Save</button>
                        </div>
                    </div>
                </form>
            </div>);
    }
}

InnerParams.displayName = 'Params';
InnerParams.propTypes = {
    login: React.PropTypes.func,
    navigate: React.PropTypes.func,
    socket: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        socket: state.socket.socket
    };
}

const Params = connect(mapStateToProps, actions)(InnerParams);

export default Params;
