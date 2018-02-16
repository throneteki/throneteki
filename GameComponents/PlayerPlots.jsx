import React from 'react';
import PropTypes from 'prop-types';

import CardPile from './CardPile.jsx';

class PlayerPlots extends React.Component {
    renderSchemePile() {
        if(!this.props.agenda || this.props.agenda.code !== '05045') {
            return;
        }

        return (
            <CardPile
                cards={ this.props.schemePlots }
                className='plot'
                hiddenTopCard
                disablePopup={ !this.props.isMe }
                onCardClick={ this.props.onCardClick }
                onDragDrop={ this.props.onDragDrop }
                onMenuItemClick={ this.props.onMenuItemClick }
                onMouseOut={ this.props.onCardMouseOut }
                onMouseOver={ this.props.onCardMouseOver }
                orientation='horizontal'
                source='scheme plots'
                title='Schemes'
                topCard={ { facedown: true, kneeled: true } }
                size={ this.props.cardSize } />
        );
    }

    renderPlotPiles() {
        let piles = [
            <CardPile
                cards={ this.props.plotDiscard }
                className='plot'
                onCardClick={ this.props.onCardClick }
                onDragDrop={ this.props.onDragDrop }
                onMenuItemClick={ this.props.onMenuItemClick }
                onMouseOut={ this.props.onCardMouseOut }
                onMouseOver={ this.props.onCardMouseOver }
                orientation='horizontal'
                size={ this.props.cardSize }
                source='revealed plots'
                title='Used Plots'
                topCard={ this.props.activePlot } />,
            <CardPile
                cards={ this.props.plotDeck }
                className={ this.props.plotSelected ? 'plot plot-selected' : 'plot' }
                closeOnClick={ this.props.isMe }
                hiddenTopCard
                disablePopup={ !this.props.isMe }
                onCardClick={ this.props.onCardClick }
                onDragDrop={ this.props.onDragDrop }
                onMouseOut={ this.props.onCardMouseOut }
                onMouseOver={ this.props.onCardMouseOver }
                orientation='horizontal'
                source='plot deck'
                title='Plots'
                topCard={ { facedown: true, kneeled: true } }
                size={ this.props.cardSize } />,
            this.renderSchemePile()
        ];

        if(this.props.direction === 'reverse') {
            piles.reverse();
        }

        return piles;
    }

    render() {
        let className = 'plot-group';
        if(this.props.direction === 'default') {
            className += ' our-side';
        }

        return (
            <div className={ className }>
                { this.renderPlotPiles() }
            </div>);
    }
}

PlayerPlots.displayName = 'PlayerPlots';
PlayerPlots.propTypes = {
    activePlot: PropTypes.object,
    agenda: PropTypes.object,
    cardSize: PropTypes.string,
    direction: PropTypes.oneOf(['default', 'reverse']),
    isMe: PropTypes.bool,
    onCardClick: PropTypes.func,
    onCardMouseOut: PropTypes.func,
    onCardMouseOver: PropTypes.func,
    onDragDrop: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    plotDeck: PropTypes.array,
    plotDiscard: PropTypes.array,
    plotSelected: PropTypes.bool,
    schemePlots: PropTypes.array
};

export default PlayerPlots;
