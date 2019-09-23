import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class TimeLimitClock extends React.Component {

    //display the minutes and seconds in the format: mm:ss with optional leading zeroes
    formatMinutesAndSeconds(minutes, seconds) {
        return ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
    }

    render() {
        let diffBetweenStartAndNow = moment.duration(moment().diff(this.props.timeLimitStartedAt));
        let seconds = diffBetweenStartAndNow.seconds();
        let minutes = diffBetweenStartAndNow.minutes();
        return (
            <div>
                <h1>{ this.props.timeLimitStarted ? this.formatMinutesAndSeconds(minutes, seconds) : '00:00' }</h1>
            </div>);
    }
}

TimeLimitClock.displayName = 'TimeLimitClock';
TimeLimitClock.propTypes = {
    timeLimitStarted: PropTypes.bool,
    timeLimitStartedAt: PropTypes.instanceOf(Date)
};

export default TimeLimitClock;
