import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DragSource } from 'react-dnd';

import CardMenu from './CardMenu';
import CardCounters from './CardCounters';
import { ItemTypes } from '../../constants';

import SquishableCardPanel from './SquishableCardPanel';

const cardSource = {
    beginDrag(props) {
        return {
            card: props.card,
            source: props.source
        };
    }
};

function collect(connect, monitor) {
    return {
        connectDragPreview: connect.dragPreview(),
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
        dragOffset: monitor.getSourceClientOffset()
    };
}

class InnerCard extends React.Component {
    constructor() {
        super();

        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);

        this.state = {
            showMenu: false
        };

        this.shortNames = {
            count: 'x',
            stand: 'T',
            poison: 'O',
            gold: 'G',
            valarmorghulis: 'V',
            betrayal: 'B',
            vengeance: 'N',
            ear: 'E',
            venom: 'M',
            kiss: 'K',
            bell: 'L',
            blood: 'D',
            shadow: 'W',
            journey: 'J',
            prayer: 'R',
            tale: 'A',
            ghost: 'H'
        };
    }

    onMouseOver(card) {
        if (this.props.onMouseOver) {
            this.props.onMouseOver(card);
        }
    }

    onMouseOut() {
        if (this.props.onMouseOut) {
            this.props.onMouseOut();
        }
    }

    isAllowedMenuSource() {
        // Explicitly disable menus on agendas when they're selectable during a
        // card select prompt.
        if (this.props.source === 'agenda' && this.props.card.selectable) {
            return false;
        }

        return (
            this.props.source === 'play area' ||
            this.props.source === 'agenda' ||
            this.props.source === 'revealed plots'
        );
    }

    onClick(event, card) {
        event.preventDefault();
        event.stopPropagation();

        if (
            this.isAllowedMenuSource() &&
            this.props.card.menu &&
            this.props.card.menu.length !== 0
        ) {
            this.setState({ showMenu: !this.state.showMenu });

            return;
        }

        if (this.props.onClick) {
            this.props.onClick(card);
        }
    }

    onMenuItemClick(menuItem) {
        if (this.props.onMenuItemClick) {
            this.props.onMenuItemClick(this.props.card, menuItem);
            this.setState({ showMenu: !this.state.showMenu });
        }
    }

    getCountersForCard(card) {
        let counters = [];

        if (card.power) {
            counters.push({ name: 'card-power', count: card.power, shortName: 'P' });
        }

        // Only display psuedo-tokens for face up cards in play
        if (!card.facedown && this.props.source === 'play area') {
            if (card.type === 'character' && card.baseStrength !== card.strength) {
                counters.push({ name: 'strength', count: card.strength, shortName: 'S' });
            }

            if (card.dupes && card.dupes.length > 0) {
                counters.push({ name: 'dupe', count: card.dupes.length, shortName: 'D' });
            }

            for (const icon of card.iconsAdded || []) {
                counters.push({ name: 'challenge-icon', icon: icon, count: 0, cancel: false });
            }

            for (const icon of card.iconsRemoved || []) {
                counters.push({ name: 'challenge-icon', icon: icon, count: 0, cancel: true });
            }

            for (const item of card.factionStatus || []) {
                counters.push({
                    name: 'faction',
                    icon: item.faction,
                    count: 0,
                    cancel: item.status === 'lost'
                });
            }
        }

        for (const [key, token] of Object.entries(card.tokens || {})) {
            counters.push({ name: key, count: token, shortName: this.shortNames[key] });
        }

        for (const attachment of card.attachments || []) {
            let attachmentCounters = this.getCountersForCard(attachment).map((counter) =>
                Object.assign({ fade: true }, counter)
            );
            counters = counters.concat(attachmentCounters);
        }

        return counters.filter((counter) => counter.count >= 0);
    }

    getAttachments() {
        if (!['rookery', 'full deck', 'play area'].includes(this.props.source)) {
            return null;
        }

        var index = 1;
        var attachments = this.props.card.attachments.map((attachment) => {
            var returnedAttachment = (
                <Card
                    key={attachment.uuid}
                    source={this.props.source}
                    card={attachment}
                    className={classNames('attachment', `attachment-${index}`)}
                    wrapped={false}
                    hideTokens
                    onMouseOver={
                        this.props.disableMouseOver ? null : this.onMouseOver.bind(this, attachment)
                    }
                    onMouseOut={this.props.disableMouseOver ? null : this.onMouseOut}
                    onClick={this.props.onClick}
                    onMenuItemClick={this.props.onMenuItemClick}
                    size={this.props.size}
                />
            );

            index += 1;

            return returnedAttachment;
        });

        return attachments;
    }

    getDupes() {
        if (this.props.source !== 'play area') {
            return null;
        }

        let index = 1;
        let dupes = this.props.card.dupes.map((dupe) => {
            // If a dupe is dragged into play during setup, it will display faceup.  This fixes that by forcing it to the parent's state
            if (this.props.card.facedown) {
                dupe.facedown = true;
            }

            let returnedDupe = (
                <Card
                    key={dupe.uuid}
                    className={classNames('card-dupe', `card-dupe-${index}`)}
                    source={this.props.source}
                    card={dupe}
                    wrapped={false}
                    onMouseOver={
                        this.props.disableMouseOver ? null : this.onMouseOver.bind(this, dupe)
                    }
                    onMouseOut={this.props.disableMouseOver ? null : this.onMouseOut}
                    onClick={this.props.onClick}
                    onMenuItemClick={this.props.onMenuItemClick}
                    size={this.props.size}
                    facedown={this.props.card.facedown}
                />
            );

            index += 1;

            return returnedDupe;
        });

        return dupes;
    }

    renderUnderneathCards() {
        // TODO: Right now it is assumed that all cards in the childCards array
        // are being placed underneath the current card. In the future there may
        // be other types of cards in this array and it should be filtered.
        let underneathCards = this.props.card.childCards;
        if (!underneathCards || underneathCards.length === 0) {
            return;
        }

        let maxCards = 1 + (underneathCards.length - 1) / 6;

        return (
            <SquishableCardPanel
                cardSize={this.props.size}
                cards={underneathCards}
                className='underneath'
                maxCards={maxCards}
                onCardClick={this.props.onClick}
                onMouseOut={this.props.onMouseOut}
                onMouseOver={this.props.onMouseOver}
                source='underneath'
            />
        );
    }

    getCardOrder() {
        if (!this.props.card.order) {
            return null;
        }

        return <div className='card-order'>{this.props.card.order}</div>;
    }

    getAlertStatus() {
        if (!this.props.card.alertStatus) {
            return null;
        }

        return (
            <div className={'status-container ' + this.props.card.alertStatus.type}>
                <div className='status-icon glyphicon glyphicon-exclamation-sign' />
                <span className='status-message'>{this.props.card.alertStatus.message}</span>
            </div>
        );
    }

    showMenu() {
        if (!this.isAllowedMenuSource()) {
            return false;
        }

        if (!this.props.card.menu || !this.state.showMenu) {
            return false;
        }

        return true;
    }

    isFacedown() {
        return this.props.card.facedown || !this.props.card.code;
    }

    getDragFrame(image) {
        if (!this.props.isDragging) {
            return null;
        }

        let style = {};

        if (this.props.dragOffset && this.props.isDragging) {
            let x = this.props.dragOffset.x;
            let y = this.props.dragOffset.y;

            style = {
                left: x,
                top: y
            };
        }

        return (
            <div className='drag-preview' style={style}>
                {image}
            </div>
        );
    }

    getCard() {
        if (!this.props.card) {
            return <div />;
        }

        let cardClass = classNames(
            'card',
            `card-type-${this.props.card.type}`,
            this.props.className,
            this.sizeClass,
            this.statusClass,
            {
                'custom-card': this.props.card.code && this.props.card.code.startsWith('custom'),
                horizontal: this.props.orientation !== 'vertical' || this.props.card.kneeled,
                vertical: this.props.orientation === 'vertical' && !this.props.card.kneeled,
                unselectable: this.props.card.unselectable,
                dragging: this.props.isDragging
            }
        );
        let imageClass = classNames('card-image', this.sizeClass, {
            horizontal: this.props.card.type === 'plot',
            vertical: this.props.card.type !== 'plot',
            kneeled:
                this.props.card.type !== 'plot' &&
                (this.props.orientation === 'kneeled' ||
                    this.props.card.kneeled ||
                    this.props.orientation === 'horizontal')
        });

        let image = <img className={imageClass} src={this.imageUrl} />;

        let content = this.props.connectDragSource(
            <div className='card-frame'>
                {this.getDragFrame(image)}
                {this.getCardOrder()}
                <div
                    className={cardClass}
                    onMouseOver={
                        this.props.disableMouseOver
                            ? null
                            : this.onMouseOver.bind(this, this.props.card)
                    }
                    onMouseOut={this.props.disableMouseOver ? null : this.onMouseOut}
                    onClick={(ev) => this.onClick(ev, this.props.card)}
                >
                    <div>
                        <span className='card-name'>{this.props.card.name}</span>
                        {image}
                    </div>
                    {!this.props.hideTokens ? (
                        <CardCounters counters={this.getCountersForCard(this.props.card)} />
                    ) : null}
                    {!this.isFacedown() ? this.getAlertStatus() : null}
                </div>
                {this.showMenu() ? (
                    <CardMenu menu={this.props.card.menu} onMenuItemClick={this.onMenuItemClick} />
                ) : null}
            </div>
        );

        return this.props.connectDragPreview(content);
    }

    get imageUrl() {
        let image = 'cardback.png';

        if (!this.isFacedown()) {
            image = `${this.props.card.code}.png`;
        } else if (this.props.source === 'shadows') {
            image = 'cardback_shadow.png';
        }

        return '/img/cards/' + image;
    }

    get sizeClass() {
        return {
            [this.props.size]: this.props.size !== 'normal'
        };
    }

    get statusClass() {
        if (!this.props.card) {
            return undefined;
        }

        if (this.props.card.selected) {
            return 'selected';
        } else if (this.props.card.selectable) {
            return 'selectable';
        } else if (this.props.card.inDanger) {
            return 'in-danger';
        } else if (this.props.card.saved) {
            return 'saved';
        } else if (this.props.card.inChallenge) {
            return 'challenge';
        } else if (this.props.card.isContributing) {
            return 'contributing';
        } else if (this.props.card.stealth) {
            return 'stealth';
        } else if (this.props.card.assault) {
            return 'assault';
        } else if (this.props.card.controlled) {
            return 'controlled';
        } else if (this.props.card.new) {
            return 'new';
        }

        return undefined;
    }

    render() {
        if (this.props.wrapped) {
            return (
                <div className='card-wrapper' style={this.props.style}>
                    {this.getCard()}
                    {this.getDupes()}
                    {this.getAttachments()}
                    {this.renderUnderneathCards()}
                </div>
            );
        }

        return this.getCard();
    }
}

InnerCard.displayName = 'Card';
InnerCard.propTypes = {
    card: PropTypes.shape({
        alertStatus: PropTypes.shape({
            type: PropTypes.string,
            message: PropTypes.string
        }),
        assault: PropTypes.bool,
        attached: PropTypes.bool,
        attachments: PropTypes.array,
        baseStrength: PropTypes.number,
        childCards: PropTypes.array,
        code: PropTypes.string,
        controlled: PropTypes.bool,
        dupes: PropTypes.array,
        facedown: PropTypes.bool,
        factionStatus: PropTypes.array,
        iconsAdded: PropTypes.array,
        iconsRemoved: PropTypes.array,
        inChallenge: PropTypes.bool,
        inDanger: PropTypes.bool,
        isContributing: PropTypes.bool,
        kneeled: PropTypes.bool,
        menu: PropTypes.array,
        name: PropTypes.string,
        new: PropTypes.bool,
        order: PropTypes.number,
        power: PropTypes.number,
        saved: PropTypes.bool,
        selectable: PropTypes.bool,
        selected: PropTypes.bool,
        stealth: PropTypes.bool,
        strength: PropTypes.number,
        tokens: PropTypes.object,
        type: PropTypes.string,
        unselectable: PropTypes.bool
    }).isRequired,
    className: PropTypes.string,
    connectDragPreview: PropTypes.func,
    connectDragSource: PropTypes.func,
    disableMouseOver: PropTypes.bool,
    dragOffset: PropTypes.object,
    hideTokens: PropTypes.bool,
    isDragging: PropTypes.bool,
    onClick: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    orientation: PropTypes.oneOf(['horizontal', 'kneeled', 'vertical']),
    size: PropTypes.string,
    source: PropTypes.oneOf([
        'hand',
        'discard pile',
        'play area',
        'dead pile',
        'draw deck',
        'plot deck',
        'revealed plots',
        'selected plot',
        'attachment',
        'agenda',
        'faction',
        'additional',
        'conclave',
        'shadows',
        'full deck',
        'rookery',
        'underneath'
    ]).isRequired,
    style: PropTypes.object,
    wrapped: PropTypes.bool
};
InnerCard.defaultProps = {
    orientation: 'vertical',
    wrapped: true
};

const Card = DragSource(ItemTypes.CARD, cardSource, collect)(InnerCard);

export default Card;
