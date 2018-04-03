import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'underscore';

import Card from './Card';
import Droppable from './Droppable';

class CardPile extends React.Component {
    constructor() {
        super();

        this.onCollectionClick = this.onCollectionClick.bind(this);
        this.onTopCardClick = this.onTopCardClick.bind(this);

        this.state = {
            showPopup: false,
            showMenu: false
        };
    }

    onCollectionClick(event) {
        event.preventDefault();

        if(this.props.menu) {
            this.setState({ showMenu: !this.state.showMenu });
            return;
        }

        if(!this.props.disablePopup) {
            this.setState({ showPopup: !this.state.showPopup });
        }
    }

    onMenuItemClick(menuItem) {
        if(menuItem.showPopup) {
            this.setState({ showPopup: !this.state.showPopup });
        }

        menuItem.handler();
    }

    onCloseClick(event) {
        event.preventDefault();
        event.stopPropagation();

        this.setState({ showPopup: !this.state.showPopup });

        if(this.props.onCloseClick) {
            this.props.onCloseClick();
        }
    }

    onPopupMenuItemClick(menuItem) {
        menuItem.handler();

        this.setState({ showPopup: !this.state.showPopup });
    }

    onTopCardClick() {
        if(this.props.menu) {
            this.setState({ showMenu: !this.state.showMenu });
            return;
        }

        if(this.props.disablePopup) {
            if(this.props.onCardClick) {
                this.props.onCardClick(this.props.topCard);
            }

            return;
        }

        this.setState({ showPopup: !this.state.showPopup });
    }

    onCardClick(card) {
        if(this.props.closeOnClick) {
            this.setState({ showPopup: false });
        }

        if(this.props.onCardClick) {
            this.props.onCardClick(card);
        }
    }

    getPopup() {
        let popup = null;
        let cardIndex = 0;

        let cardList = _.map(this.props.cards, card => {
            let cardKey = card.uuid || cardIndex++;
            return (<Card key={ cardKey } card={ card } source={ this.props.source }
                disableMouseOver={ this.props.disableMouseOver }
                onMouseOver={ this.props.onMouseOver }
                onMouseOut={ this.props.onMouseOut }
                onTouchMove={ this.props.onTouchMove }
                onClick={ this.onCardClick.bind(this, card) }
                orientation={ this.props.orientation === 'kneeled' ? 'vertical' : this.props.orientation }
                size={ this.props.size } />);
        });

        if(this.props.disablePopup || !this.state.showPopup) {
            return null;
        }

        let popupClass = classNames('panel', {
            'our-side': this.props.popupLocation === 'top'
        });
        let arrowClass = classNames('arrow', 'lg', {
            'down': this.props.popupLocation === 'top' && this.props.orientation !== 'horizontal',
            'up': this.props.popupLocation !== 'top' && this.props.orientation !== 'horizontal',
            'left': this.props.orientation === 'horizontal'
        });

        let linkIndex = 0;

        let popupMenu = this.props.popupMenu ? (<div>{ _.map(this.props.popupMenu, menuItem => {
            return <a className='btn btn-default' key={ linkIndex++ } onClick={ () => this.onPopupMenuItemClick(menuItem) }>{ menuItem.text }</a>;
        }) }</div>) : null;

        popup = (
            <div className='popup'>
                <div className='panel-title' onClick={ event => event.stopPropagation() }>
                    <span className='text-center'>{ this.props.title }</span>
                    <span className='pull-right'>
                        <a className='close-button glyphicon glyphicon-remove' onClick={ this.onCloseClick.bind(this) } />
                    </span>
                </div>
                <Droppable onDragDrop={ this.props.onDragDrop } source={ this.props.source }>
                    <div className={ popupClass } onClick={ event => event.stopPropagation() }>
                        { popupMenu }
                        <div className='inner'>
                            { cardList }
                        </div>
                        <div className={ arrowClass } />
                    </div>
                </Droppable>
            </div>);

        return popup;
    }

    getMenu() {
        let menuIndex = 0;

        let menu = _.map(this.props.menu, item => {
            return <div key={ (menuIndex++).toString() } onClick={ this.onMenuItemClick.bind(this, item) }>{ item.text }</div>;
        });

        return (
            <div className='panel menu'>
                { menu }
            </div>);
    }

    render() {
        let className = classNames('panel', 'card-pile', this.props.className, {
            [this.props.size]: this.props.size !== 'normal',
            'horizontal': this.props.orientation === 'horizontal' || this.props.orientation === 'kneeled',
            'vertical': this.props.orientation === 'vertical'
        });

        let cardCount = this.props.cardCount || (this.props.cards ? this.props.cards.length : '0');
        let headerText = this.props.title ? this.props.title + ' (' + (cardCount) + ')' : '';
        let topCard = this.props.topCard || _.first(this.props.cards);
        let cardOrientation = this.props.orientation === 'horizontal' && topCard && topCard.facedown ? 'kneeled' : this.props.orientation;

        if(this.props.hiddenTopCard && !this.props.topCard) {
            topCard = { facedown: true };
        }

        return (
            <div className={ className } onClick={ this.onCollectionClick }>
                <div className='panel-header'>
                    { headerText }
                </div>
                { topCard ? <Card card={ topCard } source={ this.props.source }
                    onMouseOver={ this.props.onMouseOver }
                    onMouseOut={ this.props.onMouseOut }
                    disableMouseOver={ this.props.hiddenTopCard }
                    onClick={ this.onTopCardClick }
                    onMenuItemClick={ this.props.onMenuItemClick }
                    orientation={ cardOrientation }
                    size={ this.props.size } /> : <div className='card-placeholder' /> }
                { this.state.showMenu ? this.getMenu() : null }
                { this.getPopup() }
            </div>);
    }
}

CardPile.displayName = 'CardPile';
CardPile.propTypes = {
    cardCount: PropTypes.number,
    cards: PropTypes.array,
    className: PropTypes.string,
    closeOnClick: PropTypes.bool,
    disableMouseOver: PropTypes.bool,
    disablePopup: PropTypes.bool,
    hiddenTopCard: PropTypes.bool,
    menu: PropTypes.array,
    onCardClick: PropTypes.func,
    onCloseClick: PropTypes.func,
    onDragDrop: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    onTouchMove: PropTypes.func,
    orientation: PropTypes.string,
    popupLocation: PropTypes.string,
    popupMenu: PropTypes.array,
    size: PropTypes.string,
    source: PropTypes.oneOf(['hand', 'discard pile', 'play area', 'dead pile', 'draw deck', 'plot deck',
        'revealed plots', 'selected plot', 'attachment', 'agenda', 'faction', 'additional',
        'scheme plots', 'conclave']).isRequired,
    title: PropTypes.string,
    topCard: PropTypes.object
};
CardPile.defaultProps = {
    orientation: 'vertical'
};

export default CardPile;
