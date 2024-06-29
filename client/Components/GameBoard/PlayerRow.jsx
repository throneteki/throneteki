import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Card from './Card';
import CardPile from './CardPile';
import SquishableCardPanel from './SquishableCardPanel';
import DrawDeck from './DrawDeck';
import Droppable from './Droppable';
import { getCardDimensions } from '../../util';

class PlayerRow extends React.Component {
    getOutOfGamePile() {
        let pile = this.props.outOfGamePile;

        if (pile.length === 0) {
            return;
        }

        let outOfGamePile = (
            <CardPile
                cards={pile}
                className='additional-cards'
                onCardClick={this.props.onCardClick}
                onDragDrop={this.props.onDragDrop}
                onMenuItemClick={this.props.onMenuItemClick}
                onMouseOut={this.props.onMouseOut}
                onMouseOver={this.props.onMouseOver}
                orientation='kneeled'
                popupLocation={this.props.side}
                source='out of game'
                title='Out of Game'
                size={this.props.cardSize}
            />
        );

        if (this.props.isMe) {
            return (
                <Droppable onDragDrop={this.props.onDragDrop} source='out of game'>
                    {outOfGamePile}
                </Droppable>
            );
        }

        return outOfGamePile;
    }

    getAgenda() {
        if (!this.props.agenda || this.props.agenda.code === '') {
            let className = classNames('agenda', 'card-pile', 'vertical', {
                [this.props.cardSize]: this.props.cardSize !== 'normal'
            });
            return <div className={className} />;
        }
        let underneath = this.props.agenda.childCards || [];
        let disablePopup = underneath.length === 0;
        let title = !disablePopup ? 'Agenda' : null;
        let source = 'agenda';
        let pileClass = classNames('agenda', `agenda-${this.props.agenda.code}`);
        let cardWidth = getCardDimensions(this.props.cardSize);
        let additionalWidth = cardWidth.width / 2;

        let agendas = [];
        agendas.push(
            this.renderDroppablePile(
                source,
                <CardPile
                    key={this.props.agenda.uuid}
                    className={pileClass}
                    cards={underneath}
                    disablePopup={disablePopup}
                    onCardClick={this.props.onCardClick}
                    onDragDrop={this.props.onDragDrop}
                    onMenuItemClick={this.props.onMenuItemClick}
                    onMouseOut={this.props.onMouseOut}
                    onMouseOver={this.props.onMouseOver}
                    popupLocation={this.props.side}
                    source={source}
                    title={title}
                    topCard={this.props.agenda}
                    size={this.props.cardSize}
                />
            )
        );

        if (this.props.bannerCards) {
            for (let index = 0; index < this.props.bannerCards.length; index++) {
                let banner = this.props.bannerCards[index];
                let bannerClass = classNames('agenda', `agenda-${banner.code} banner`);
                let offset = additionalWidth * (index + 1);
                let style = { left: `${offset}px` };
                agendas.push(
                    <Card
                        key={banner.uuid}
                        className={bannerClass}
                        card={banner}
                        source={source}
                        onMouseOver={this.props.onMouseOver}
                        onMouseOut={this.props.onMouseOut}
                        disableMouseOver={false}
                        onClick={this.props.onCardClick}
                        onMenuItemClick={this.props.onMenuItemClick}
                        orientation={'vertical'}
                        size={this.props.cardSize}
                        style={style}
                    />
                );
            }
        }
        let totalWidth = 6 + cardWidth.width + additionalWidth * this.props.bannerCards.length;
        let totalStyle = { width: `${totalWidth}px` };
        return (
            <div className='agendas' style={totalStyle}>
                {agendas.reverse()}
            </div>
        );
    }

    getTitleCard() {
        if (!this.props.isMelee) {
            return;
        }

        return (
            <CardPile
                className='title'
                cards={[]}
                disablePopup
                onMouseOut={this.props.onMouseOut}
                onMouseOver={this.props.onMouseOver}
                source='title'
                topCard={this.props.title}
                size={this.props.cardSize}
            />
        );
    }

    renderDroppablePile(source, child) {
        return this.props.isMe ? (
            <Droppable onDragDrop={this.props.onDragDrop} source={source}>
                {child}
            </Droppable>
        ) : (
            child
        );
    }

    render() {
        let cardPileProps = {
            onCardClick: this.props.onCardClick,
            onDragDrop: this.props.onDragDrop,
            onMouseOut: this.props.onMouseOut,
            onMouseOver: this.props.onMouseOver,
            popupLocation: this.props.side,
            size: this.props.cardSize
        };

        let hand = (
            <SquishableCardPanel
                cards={this.props.hand}
                className='panel hand'
                groupVisibleCards
                username={this.props.username}
                maxCards={5}
                onCardClick={this.props.onCardClick}
                onMouseOut={this.props.onMouseOut}
                onMouseOver={this.props.onMouseOver}
                source='hand'
                title='Hand'
                cardSize={this.props.cardSize}
            />
        );
        let drawDeck = (
            <DrawDeck
                cardCount={this.props.numDrawCards}
                cards={this.props.drawDeck}
                isMe={this.props.isMe}
                numDrawCards={this.props.numDrawCards}
                onPopupChange={this.props.onDrawPopupChange}
                onShuffleClick={this.props.onShuffleClick}
                revealTopCard={this.props.revealTopCard}
                showDeck={this.props.showDeck}
                spectating={this.props.spectating}
                {...cardPileProps}
            />
        );
        let discardPile = (
            <CardPile
                className='discard'
                title='Discard'
                source='discard pile'
                cards={this.props.discardPile}
                {...cardPileProps}
            />
        );
        let deadPile = (
            <CardPile
                className='dead'
                title='Dead'
                source='dead pile'
                cards={this.props.deadPile}
                orientation='kneeled'
                {...cardPileProps}
            />
        );
        let shadows = (
            <SquishableCardPanel
                cards={this.props.shadows}
                cardSize={this.props.cardSize}
                className='panel shadows'
                maxCards={2}
                onCardClick={this.props.onCardClick}
                onMouseOut={this.props.onMouseOut}
                onMouseOver={this.props.onMouseOver}
                source='shadows'
                title='Shadows'
                username={this.props.username}
            />
        );

        return (
            <div className='player-home-row-container'>
                <CardPile
                    className='faction'
                    source='faction'
                    cards={[]}
                    topCard={this.props.faction}
                    onMouseOver={this.onMouseOver}
                    onMouseOut={this.onMouseOut}
                    disablePopup
                    onCardClick={this.props.onCardClick}
                    size={this.props.cardSize}
                />
                {this.getAgenda()}
                {this.getTitleCard()}
                {this.renderDroppablePile('hand', hand)}
                {this.props.shadows.length !== 0 && this.renderDroppablePile('shadows', shadows)}
                {this.renderDroppablePile('draw deck', drawDeck)}
                {this.renderDroppablePile('discard pile', discardPile)}
                {this.renderDroppablePile('dead pile', deadPile)}

                {this.getOutOfGamePile()}
            </div>
        );
    }
}

PlayerRow.displayName = 'PlayerRow';
PlayerRow.propTypes = {
    agenda: PropTypes.object,
    bannerCards: PropTypes.array,
    cardSize: PropTypes.string,
    deadPile: PropTypes.array,
    discardPile: PropTypes.array,
    drawDeck: PropTypes.array,
    faction: PropTypes.object,
    hand: PropTypes.array,
    isMe: PropTypes.bool,
    isMelee: PropTypes.bool,
    numDrawCards: PropTypes.number,
    onCardClick: PropTypes.func,
    onDragDrop: PropTypes.func,
    onDrawPopupChange: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    onShuffleClick: PropTypes.func,
    outOfGamePile: PropTypes.array,
    plotDeck: PropTypes.array,
    power: PropTypes.number,
    revealTopCard: PropTypes.bool,
    shadows: PropTypes.array,
    showDeck: PropTypes.bool,
    side: PropTypes.oneOf(['top', 'bottom']),
    spectating: PropTypes.bool,
    title: PropTypes.object,
    username: PropTypes.string
};

export default PlayerRow;
