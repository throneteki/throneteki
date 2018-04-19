import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'underscore';

import Counter from './Counter';

class CardCounters extends React.Component {
    render() {
        if(_.size(this.props.counters) === 0) {
            return null;
        }

        let countersClass = classNames('counters', 'ignore-mouse-events', {
            'many-counters': _.size(this.props.counters) > 3
        });

        let counterDivs = this.props.counters.map((counter, key) => {
            return (<Counter key={ key }
                name={ counter.name }
                value={ counter.count }
                fade={ counter.fade }
                cancel={ counter.cancel }
                shortName={ counter.shortName } />);
        });

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
