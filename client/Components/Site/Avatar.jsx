import React from 'react';
import classNames from 'classnames';

const Avatar = ({ float, username }) => {
    let className = classNames('gravatar', {
        'pull-left': float
    });

    if (!username) {
        return null;
    }

    return <img className={className} src={`/img/avatar/${username}.png`} />;
};

export default Avatar;
