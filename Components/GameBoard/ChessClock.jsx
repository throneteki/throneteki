import React from 'react';
import PropTypes from 'prop-types';

const formattedSeconds = (sec) => (sec < 0 ? '-' : '') + Math.floor(Math.abs(sec) / 60) + ':' + ('0' + Math.abs(sec) % 60).slice(-2);

class ChessClock extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mode: undefined,
            secondsLeft: undefined,
            delayToStartClock: undefined
        };
    }

    componentDidMount() {
        this.updateProps(this.props);
    }

    componentWillReceiveProps(props) {
        this.updateProps(props);
    }

    updateProps(props) {
        if(props.secondsLeft === 0 || this.stateId === props.stateId) {
            return;
        }
        this.stateId = props.stateId;
        this.setState({mode: props.mode});
        this.setState({secondsLeft: props.secondsLeft});
        this.setState({delayToStartClock: props.delayToStartClock});
        if(this.timer) {
            clearInterval(this.timer);
        }

        if(props.mode !== 'stop') {
            this.timer = setInterval(() => {
                if(this.state.delayToStartClock > 0) {
                    this.setState({ delayToStartClock: this.state.delayToStartClock - 1 });
                } else if(this.state.delayToStartClock <= 0) {
                    this.setState({ secondsLeft: this.state.secondsLeft - 1 });
                }
            }, 1000);
        }
    }

    render() {
        if(this.state.mode !== 'inactive') {
            let clockIcon = this.state.mode === 'down' && this.state.delayToStartClock <= 0 ? <img src='/img/chess-clock.png' className='game-list-icon' /> : '';
            let delaySeconds = this.state.mode === 'down' && this.state.delayToStartClock > 0 ? ' - ' + formattedSeconds(this.state.delayToStartClock) : '';
            return (
                <div>
                    <h1>{ formattedSeconds(this.state.secondsLeft) } { clockIcon } { delaySeconds } </h1>
                </div>);
        }
        return (<div/>);
    }
}

ChessClock.displayName = 'ChessClock';
ChessClock.propTypes = {
    delayToStartClock: PropTypes.number,
    mode: PropTypes.string,
    secondsLeft: PropTypes.number,
    stateId: PropTypes.number
};

export default ChessClock;
