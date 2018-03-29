import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Avatar extends React.Component {
    render() {
        let className = classNames('gravatar', {
            'pull-left': this.props.float
        });

        return (<img className={ className } src={ 'https://www.gravatar.com/avatar/' + this.props.emailHash + '?d=identicon&s=24' + (this.props.forceDefault ? '&f=y' : '') } />);
    }
}

Avatar.displayName = 'Avatar';
Avatar.propTypes = {
    emailHash: PropTypes.string,
    float: PropTypes.bool,
    forceDefault: PropTypes.bool
};

export default Avatar;
