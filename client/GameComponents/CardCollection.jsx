import React from 'react';
import _ from 'underscore';
import $ from 'jquery';

import Card from './Card.jsx';

class CardCollection extends React.Component {
    constructor() {
        super();

        this.state = {
            showPopup: false
        };
    }

    onDragOver(event) {
        $(event.target).addClass('highlight-panel');

        event.preventDefault();
    }

    onDragLeave(event) {
        $(event.target).removeClass('highlight-panel');
    }

    getPopup() {
        var popup = null;

        if(this.state.showPopup) {
            var cardList = _.map(this.props.cards, card => {
                return (<Card key={card.uuid} card={card} source={this.props.source}
                             onMouseOver={this.props.onMouseOver}
                             onMouseOut={this.props.onMouseOut}
                             onClick={this.props.onCardClick} />);
            });

            popup = (
                <div className='popup panel' onClick={event => event.stopPropagation() }>
                    <div>
                        <a onClick={this.onCloseClick}>Close</a>
                    </div>
                    <div className='inner'>
                        {cardList}
                    </div>
                </div>);
        }

        return popup;
    }

    render() {
        var className = 'panel ' + this.props.className;
        var headerText = this.props.title + '(' + this.props.cards.length + ')';
        var topCard = this.props.cards.length > 0 ? this.props.cards[0] : undefined;

        return (
            <div className={className} onDragLeave={this.onDragLeave} onDragOver={this.onDragOver} onDrop={event => this.onDragDrop(event, this.props.source)}
                    onClick={this.onDiscardClick}>
                <div className='panel-header'>
                    {headerText}
                </div>
                {topCard ? <Card card={topCard} source={this.props.source}
                         onMouseOver={this.props.onMouseOver}
                         onMouseOut={this.props.onMouseOut} /> : null}
                {this.getPopup()}
            </div>);
    }
}

CardCollection.displayName = 'CardCollection';
CardCollection.propTypes = {
    cards: React.PropTypes.array,
    className: React.PropTypes.string,
    onCardClick: React.PropTypes.func,
    onMouseOut: React.PropTypes.func,
    onMouseOver: React.PropTypes.func,
    source: React.PropTypes.oneOf(['hand', 'discard pile', 'play area', 'dead pile', 'draw deck', 'plot deck', 'attachment']).isRequired,
    title: React.PropTypes.string
};

export default CardCollection;
