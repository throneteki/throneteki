import React from 'react';
import _ from 'underscore';
import $ from 'jquery';

import Card from './Card.jsx';
import { tryParseJSON } from '../util.js';

class CardPile extends React.Component {
    constructor() {
        super();

        this.onCollectionClick = this.onCollectionClick.bind(this);
        this.onDragDrop = this.onDragDrop.bind(this);
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

    onDragOver(event) {
        $(event.target).addClass('highlight-panel');

        event.preventDefault();
    }

    onDragLeave(event) {
        $(event.target).removeClass('highlight-panel');
    }

    onDragDrop(event, target) {
        event.stopPropagation();
        event.preventDefault();

        $(event.target).removeClass('highlight-panel');

        var card = event.dataTransfer.getData('Text');

        if(!card) {
            return;
        }

        var dragData = tryParseJSON(card);

        if(!dragData) {
            return;
        }

        if(this.props.onDragDrop) {
            this.props.onDragDrop(dragData.card, dragData.source, target);
        }
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
                onDragDrop={ this.props.onDragDrop }
                orientation={ this.props.orientation === 'kneeled' ? 'vertical' : this.props.orientation } />);
        });

        if(this.props.disablePopup || !this.state.showPopup) {
            return null;
        }

        let popupClass = 'panel';
        let arrowClass = 'arrow lg';

        if(this.props.popupLocation === 'top') {
            popupClass += ' our-side';
            arrowClass += ' down';
        } else {
            arrowClass += ' up';
        }

        if(this.props.orientation === 'horizontal') {
            arrowClass = 'arrow lg left';
        }

        let linkIndex = 0;

        var popupMenu = this.props.popupMenu ? (<div>{ _.map(this.props.popupMenu, menuItem => {
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
                <div className={ popupClass } onClick={ event => event.stopPropagation() }>
                    { popupMenu }
                    <div className='inner'>
                        { cardList }
                    </div>
                    <div className={ arrowClass }/>
                </div>
            </div>);

        return popup;
    }

    getMenu() {
        var menuIndex = 0;

        var menu = _.map(this.props.menu, item => {
            return <div key={ (menuIndex++).toString() } onClick={ this.onMenuItemClick.bind(this, item) }>{ item.text }</div>;
        });

        return (
            <div className='panel menu'>
                { menu }
            </div>);
    }

    render() {
        var className = 'panel card-pile ' + this.props.className;
        var cardCount = this.props.cardCount || (this.props.cards ? this.props.cards.length : '0');
        var headerText = this.props.title ? this.props.title + ' (' + (cardCount) + ')' : '';
        var topCard = this.props.topCard || _.last(this.props.cards);
        var cardOrientation = this.props.orientation === 'horizontal' && topCard && topCard.facedown ? 'kneeled' : this.props.orientation;

        if(this.props.hiddenTopCard && !topCard) {
            topCard = { facedown: true };
        }

        if(this.props.orientation === 'horizontal' || this.props.orientation === 'kneeled') {
            className += ' horizontal';
        } else {
            className += ' vertical';
        }

        return (
            <div className={ className } onDragLeave={ this.onDragLeave } onDragOver={ this.onDragOver } onDrop={ event => this.onDragDrop(event, this.props.source) }
                onClick={ this.onCollectionClick }>
                <div className='panel-header'>
                    { headerText }
                </div>
                { topCard ? <Card card={ topCard } source={ this.props.source }
                    onMouseOver={ this.props.onMouseOver }
                    onMouseOut={ this.props.onMouseOut }
                    disableMouseOver={ this.props.hiddenTopCard }
                    onClick={ this.onTopCardClick }
                    onMenuItemClick={ this.props.onMenuItemClick }
                    onDragDrop={ this.props.onDragDrop }
                    orientation={ cardOrientation } /> : <div className='card-placeholder' /> }
                { this.state.showMenu ? this.getMenu() : null }
                { this.getPopup() }
            </div>);
    }
}

CardPile.displayName = 'CardPile';
CardPile.propTypes = {
    cardCount: React.PropTypes.number,
    cards: React.PropTypes.array,
    className: React.PropTypes.string,
    closeOnClick: React.PropTypes.bool,
    disableMouseOver: React.PropTypes.bool,
    disablePopup: React.PropTypes.bool,
    hiddenTopCard: React.PropTypes.bool,
    menu: React.PropTypes.array,
    onCardClick: React.PropTypes.func,
    onCloseClick: React.PropTypes.func,
    onDragDrop: React.PropTypes.func,
    onMenuItemClick: React.PropTypes.func,
    onMouseOut: React.PropTypes.func,
    onMouseOver: React.PropTypes.func,
    onTouchMove: React.PropTypes.func,
    orientation: React.PropTypes.string,
    popupLocation: React.PropTypes.string,
    popupMenu: React.PropTypes.array,
    source: React.PropTypes.oneOf(['hand', 'discard pile', 'play area', 'dead pile', 'draw deck', 'plot deck',
        'revealed plots', 'selected plot', 'attachment', 'agenda', 'faction', 'additional',
        'scheme plots']).isRequired,
    title: React.PropTypes.string,
    topCard: React.PropTypes.object
};
CardPile.defaultProps = {
    orientation: 'vertical'
};

export default CardPile;
