import React from 'react';
import PropTypes from 'prop-types';

class AbilityTimer extends React.Component {
    constructor(props) {
        super(props);

        this.tick = this.tick.bind(this);

        this.state = {
            remaining: props.limit
        };
    }

    componentWillMount() {
        this.setState({
            request: requestAnimationFrame(this.tick)
        });
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.state.request);
    }

    tick() {
        // Subtract an offset factor to ensure timer reaches 0 before the
        // component is unmounted.
        const timeOffset = 0.25;
        let now = new Date();
        let elapsed = (now - this.props.startTime) / 1000;
        let remaining = this.props.limit - elapsed - timeOffset;

        if (remaining < 0) {
            remaining = 0;
        }

        this.setState({
            remaining: remaining,
            request: requestAnimationFrame(this.tick)
        });
    }

    render() {
        let remainingPercent = ((this.state.remaining / this.props.limit) * 100).toFixed() + '%';
        return (
            <div>
                <span>Auto passing in {this.state.remaining.toFixed()}...</span>
                <div className='progress'>
                    <div
                        className='progress-bar progress-bar-success'
                        role='progressbar'
                        style={{ width: remainingPercent }}
                    />
                </div>
            </div>
        );
    }
}

AbilityTimer.propTypes = {
    limit: PropTypes.number,
    startTime: PropTypes.instanceOf(Date)
};

export default AbilityTimer;
