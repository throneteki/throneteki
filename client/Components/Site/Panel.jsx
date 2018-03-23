import React from 'react';
import PropTypes from 'prop-types';

class Panel extends React.Component {
    render() {
        return (
            <div className={ `panel panel-${this.props.type}` }>
                <div className='panel-heading'>
                    { this.props.title }
                </div>
                <div className='panel-body'>
                    { this.props.children }
                </div>
            </div>);
    }
}

Panel.displayName = 'Panel';
Panel.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
    type: PropTypes.oneOf(['danger', 'success', 'warning', 'info', 'default', 'primary'])
};
Panel.defaultProps = {
    type: 'primary'
};

export default Panel;

