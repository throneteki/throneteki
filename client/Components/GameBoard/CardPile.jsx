import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'underscore';

import Card from './Card';
import CardTiledList from './CardTiledList';
import Droppable from './Droppable';
import MovablePanel from './MovablePanel';

class CardPile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showPopup: false,
            showMenu: false
        };

        this.onCollectionClick = this.onCollectionClick.bind(this);
        this.onTopCardClick = this.onTopCardClick.bind(this);
        this.onCloseClick = this.onCloseClick.bind(this);
    }

    componentWillReceiveProps(props) {
        let hasNewSelectableCard = props.cards && props.cards.some(card => card.selectable);
        let didHaveSelectableCard = this.props.cards && this.props.cards.some(card => card.selectable);

        if(!didHaveSelectableCard && hasNewSelectableCard) {
            this.setState({ showPopup: true });
        } else if(didHaveSelectableCard && !hasNewSelectableCard) {
            this.setState({ showPopup: false });
        }
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
        let cardList = [];

        let listProps = {
            disableMouseOver: this.props.disableMouseOver,
            onCardClick: this.onCardClick.bind(this),
            onCardMouseOut: this.props.onMouseOut,
            onCardMouseOver: this.props.onMouseOver,
            onTouchMove: this.props.onTouchMove,
            size: this.props.size,
            source: this.props.source
        };

        if(this.props.cards && this.props.cards.some(card => card.group)) {
            const cardGroup = _.groupBy(this.props.cards, card => card.group);
            const sortedKeys = Object.keys(cardGroup).sort();
            for(const key of sortedKeys) {
                cardList.push(
                    <CardTiledList cards={ cardGroup[key] } key={ key } title={ key } { ...listProps } />
                );
            }
        } else {
            cardList = (
                <CardTiledList cards={ this.props.cards } { ...listProps } />);
        }

        if(this.props.disablePopup || !this.state.showPopup) {
            return null;
        }

        let popupClass = classNames('panel', {
            'our-side': this.props.popupLocation === 'bottom'
        });

        let innerClass = classNames('inner', this.props.size);
        let linkIndex = 0;

        let popupMenu = this.props.popupMenu ? (<div>{ this.props.popupMenu.map(menuItem => {
            return <a className='btn btn-default' key={ linkIndex++ } onClick={ () => this.onPopupMenuItemClick(menuItem) }>{ menuItem.text }</a>;
        }) }</div>) : null;

        popup = (
            <MovablePanel title={ this.props.title } name={ this.props.source } onCloseClick={ this.onCloseClick } side={ this.props.popupLocation }>
                <Droppable onDragDrop={ this.props.onDragDrop } source={ this.props.source }>
                    <div className={ popupClass } onClick={ event => event.stopPropagation() }>
                        { popupMenu }
                        <div className={ innerClass }>
                            { cardList }
                        </div>
                    </div>
                </Droppable>
            </MovablePanel>
        );

        return popup;
    }

    getMenu() {
        let menuIndex = 0;

        let menu = this.props.menu.map(item => {
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
        'revealed plots', 'selected plot', 'attachment', 'agenda', 'faction', 'additional', 'conclave']).isRequired,
    title: PropTypes.string,
    topCard: PropTypes.object
};
CardPile.defaultProps = {
    popupLocation: 'bottom',
    orientation: 'vertical'
};

export default CardPile;
