import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Panel = ({ children, className, title, type = 'primary' }) => {
    return (
        <div className={classNames('panel', `panel-${type}`, className)}>
            {title && <div className='panel-heading'>{title}</div>}
            <div className='panel-body'>{children}</div>
        </div>
    );
};

Panel.displayName = 'Panel';
Panel.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.oneOf([
        'danger',
        'success',
        'warning',
        'info',
        'default',
        'primary',
        'tertiary'
    ])
};

export default Panel;
