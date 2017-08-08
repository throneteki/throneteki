import React from 'react';
import _ from 'underscore';

import CardPile from './CardPile.jsx';

class AdditionalCardPile extends React.Component {
    render() {
        var topCard = _.last(this.props.pile.cards);
        if(this.props.pile.isPrivate) {
            topCard = { facedown: true, kneeled: true };
        } else if(topCard && topCard.facedown) {
            topCard.kneeled = true;
        }

        return (
            <CardPile
                className={ this.props.className }
                title={ this.props.title }
                source={ this.props.source }
                cards={ this.props.pile.cards }
                topCard={ topCard }
                onDragDrop={ this.props.onDragDrop }
                onMouseOver={ this.props.onMouseOver }
                onMouseOut={ this.props.onMouseOut }
                popupLocation={ this.props.isMe || this.props.spectating ? 'top' : 'bottom' }
                disablePopup={ this.props.pile.isPrivate && !(this.props.isMe || this.props.spectating) }
                orientation='horizontal' />
        );
    }
}

AdditionalCardPile.displayName = 'AdditionalCardPile';
AdditionalCardPile.propTypes = {
    className: React.PropTypes.string,
    isMe: React.PropTypes.bool,
    onDragDrop: React.PropTypes.func,
    onMouseOut: React.PropTypes.func,
    onMouseOver: React.PropTypes.func,
    pile: React.PropTypes.object,
    source: React.PropTypes.string,
    spectating: React.PropTypes.bool,
    title: React.PropTypes.string
};

export default AdditionalCardPile;
