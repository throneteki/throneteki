import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class TimeLimitClock extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            timer: undefined,
            timeLeft: undefined
        };
    }

    componentDidMount() {
        this.updateProps(this.props);
    }

    componentWillReceiveProps(props) {
        this.updateProps(props);
    }

    updateProps(props) {
        if (props.timeLimitStarted && !this.state.timer) {
            let timer = setInterval(() => {
                let endTime = moment(props.timeLimitStartedAt).add(props.timeLimit, 'seconds');
                let time = moment.utc(endTime.diff(moment()));
                let timeDisplay = undefined;
                if (time.hours() > 0) {
                    timeDisplay = time.format('HH:mm:ss');
                } else {
                    timeDisplay = time.format('mm:ss');
                }
                this.setState({ timeLeft: timeDisplay });
            }, 1000);

            this.setState({ timer: timer });
        }
        if (!props.timeLimitStarted && this.state.timer) {
            clearInterval(this.state.timer);
            this.setState({ timer: undefined });
        }
    }

    render() {
        return (
            <div>
                <h1>{this.state.timeLeft}</h1>
            </div>
        );
    }
}

TimeLimitClock.displayName = 'TimeLimitClock';
TimeLimitClock.propTypes = {
    timeLimit: PropTypes.number,
    timeLimitStarted: PropTypes.bool,
    timeLimitStartedAt: PropTypes.instanceOf(Date)
};

export default TimeLimitClock;
