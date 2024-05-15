import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Counter extends React.Component {
    render() {
        let className = classNames('counter', `${this.props.name}-token`, {
            cancel: this.props.cancel,
            'fade-out': this.props.fade
        });

        if (this.props.icon) {
            return (
                <div
                    key={this.props.icon}
                    className={classNames(
                        className,
                        'thronesicon',
                        `thronesicon-${this.props.icon}`
                    )}
                />
            );
        }

        return (
            <div key={this.props.name} className={className}>
                {this.props.shortName ? <span>{this.props.shortName}</span> : null}
                <span>{this.props.value}</span>
            </div>
        );
    }
}

Counter.displayName = 'Counter';
Counter.propTypes = {
    cancel: PropTypes.bool,
    fade: PropTypes.bool,
    icon: PropTypes.string,
    name: PropTypes.string.isRequired,
    shortName: PropTypes.string,
    value: PropTypes.number
};

export default Counter;
