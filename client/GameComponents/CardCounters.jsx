import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

import Counter from './Counter.jsx';

class CardCounters extends React.Component {
    render() {
        if(_.size(this.props.counters) === 0) {
            return null;
        }

        let countersClass = 'counters ignore-mouse-events';

        let counterDivs = _.map(this.props.counters, (counter, key) => {
            return (<Counter key={ key }
                name={ counter.name }
                value={ counter.count }
                fade={ counter.fade }
                cancel={ counter.cancel }
                shortName={ counter.shortName } />);
        });

        if(_.size(this.props.counters) > 3) {
            countersClass += ' many-counters';
        }

        return (
            <div className={ countersClass }>
                { counterDivs }
            </div>
        );
    }
}

CardCounters.displayName = 'CardCounters';
CardCounters.propTypes = {
    counters: PropTypes.array.isRequired
};

export default CardCounters;
