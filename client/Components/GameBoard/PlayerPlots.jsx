import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import CardPile from './CardPile';
import Droppable from './Droppable';

class PlayerPlots extends React.Component {
    renderSchemePile() {
        if(!this.props.agenda || this.props.agenda.code !== '05045') {
            return;
        }

        return (
            <Droppable onDragDrop={ this.props.onDragDrop } source='scheme plots'>
                <CardPile
                    cards={ this.props.schemePlots }
                    className='plot'
                    closeOnClick={ this.props.isMe }
                    hiddenTopCard
                    disablePopup={ !this.props.isMe }
                    onCardClick={ this.props.onCardClick }
                    onMenuItemClick={ this.props.onMenuItemClick }
                    onMouseOut={ this.props.onCardMouseOut }
                    onMouseOver={ this.props.onCardMouseOver }
                    orientation='horizontal'
                    source='scheme plots'
                    title='Schemes'
                    topCard={ { facedown: true, kneeled: true } }
                    size={ this.props.cardSize } />
            </Droppable>
        );
    }

    renderPlotPiles() {
        let piles = [
            <Droppable key='usedplots' onDragDrop={ this.props.onDragDrop } source='revealed plots'>
                <CardPile
                    cards={ this.props.plotDiscard }
                    className='plot'
                    onCardClick={ this.props.onCardClick }
                    onMenuItemClick={ this.props.onMenuItemClick }
                    onMouseOut={ this.props.onCardMouseOut }
                    onMouseOver={ this.props.onCardMouseOver }
                    orientation='horizontal'
                    size={ this.props.cardSize }
                    source='revealed plots'
                    title='Used Plots'
                    topCard={ this.props.activePlot } />
            </Droppable>,
            <Droppable key='plotdeck' onDragDrop={ this.props.onDragDrop } source='plot deck'>
                <CardPile
                    cards={ this.props.plotDeck }
                    className={ this.props.plotSelected ? 'plot plot-selected' : 'plot' }
                    closeOnClick={ this.props.isMe }
                    hiddenTopCard
                    disablePopup={ !this.props.isMe }
                    onCardClick={ this.props.onCardClick }
                    onMouseOut={ this.props.onCardMouseOut }
                    onMouseOver={ this.props.onCardMouseOver }
                    orientation='horizontal'
                    source='plot deck'
                    title='Plots'
                    topCard={ { facedown: true, kneeled: true } }
                    size={ this.props.cardSize } />
            </Droppable>,
            this.renderSchemePile()
        ];

        if(this.props.direction === 'reverse') {
            piles.reverse();
        }

        return piles;
    }

    render() {
        let className = classNames('plot-group', {
            'our-side': this.props.direction === 'default'
        });

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
