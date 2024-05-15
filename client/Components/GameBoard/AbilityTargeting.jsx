import React from 'react';
import PropTypes from 'prop-types';

class AbilityTargeting extends React.Component {
    onMouseOver(event, card) {
        if (card && this.props.onMouseOver) {
            this.props.onMouseOver(card);
        }
    }

    onMouseOut(event, card) {
        if (card && this.props.onMouseOut) {
            this.props.onMouseOut(card);
        }
    }

    renderSimpleCard(card) {
        return (
            <div
                className='target-card vertical'
                onMouseOut={(event) => this.onMouseOut(event, card)}
                onMouseOver={(event) => this.onMouseOver(event, card)}
            >
                <img
                    className='target-card-image vertical'
                    alt={card.name}
                    src={
                        '/img/cards/' +
                        (card.facedown
                            ? card.shadowPosition
                                ? 'cardback_shadow.png'
                                : 'cardback.png'
                            : card.code + '.png')
                    }
                />
                {card.shadowPosition ? (
                    <div className='target-card-shadow-position'>{'#' + card.shadowPosition}</div>
                ) : null}
            </div>
        );
    }

    render() {
        let targetCards = this.props.targets.map((target) => this.renderSimpleCard(target));
        return (
            <div className='prompt-control-targeting'>
                {this.renderSimpleCard(this.props.source)}
                <span className='glyphicon glyphicon-arrow-right targeting-arrow' />
                {targetCards}
            </div>
        );
    }
}

AbilityTargeting.displayName = 'AbilityTargeting';
AbilityTargeting.propTypes = {
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    source: PropTypes.object,
    targets: PropTypes.array
};

export default AbilityTargeting;
