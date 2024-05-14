import React from 'react';
import PropTypes from 'prop-types';

import DeckStatus from './DeckStatus';
import CardLink from './CardLink';

class DeckSummaryHeader extends React.Component {
    getBannersToRender() {
        let banners = [];

        if (this.props.deck.bannerCards) {
            for (const card of this.props.deck.bannerCards) {
                banners.push(
                    <div className='pull-right' key={card.code ? card.code : card}>
                        <CardLink
                            card={card}
                            onMouseOut={this.props.onCardMouseOut}
                            onMouseOver={this.props.onCardMouseOver}
                        />
                    </div>
                );
            }
        }

        return (
            <div className='info-row row'>
                <span>Banners:</span>
                {banners}
            </div>
        );
    }

    render() {
        let banners = this.getBannersToRender();

        return (
            <div className='decklist'>
                <div className='col-xs-2 col-sm-3 no-x-padding'>
                    {this.props.deck.faction ? (
                        <img
                            className='img-responsive'
                            src={'/img/cards/' + this.props.deck.faction.value + '.png'}
                        />
                    ) : null}
                </div>
                <div className='col-xs-8 col-sm-6'>
                    <div className='info-row row'>
                        <span>Faction:</span>
                        {this.props.deck.faction ? (
                            <span className={'pull-right'}>{this.props.deck.faction.name}</span>
                        ) : null}
                    </div>
                    <div className='info-row row' ref='agenda'>
                        <span>Agenda:</span>
                        <div className='pull-right'>
                            {this.props.deck.agenda && this.props.deck.agenda.label ? (
                                <CardLink
                                    card={this.props.deck.agenda}
                                    onMouseOut={this.props.onCardMouseOut}
                                    onMouseOver={this.props.onCardMouseOver}
                                />
                            ) : (
                                <span>None</span>
                            )}
                        </div>
                    </div>
                    {this.props.deck.agenda && this.props.deck.agenda.label === 'Alliance'
                        ? banners
                        : null}
                    {this.props.deck.format && (
                        <div className='info-row row' ref='drawCount'>
                            <span>Format:</span>
                            <span className='pull-right'>{this.props.deck.format}</span>
                        </div>
                    )}
                    <div className='info-row row' ref='drawCount'>
                        <span>Draw deck:</span>
                        <span className='pull-right'>{this.props.deck.status.drawCount} cards</span>
                    </div>
                    <div className='info-row row' ref='plotCount'>
                        <span>Plot deck:</span>
                        <span className='pull-right'>{this.props.deck.status.plotCount} cards</span>
                    </div>
                    <div className='info-row row'>
                        <span>Validity:</span>
                        <DeckStatus className='pull-right' status={this.props.deck.status} />
                    </div>
                </div>
                <div className='col-xs-2 col-sm-3 no-x-padding'>
                    {this.props.deck.agenda && this.props.deck.agenda.code ? (
                        <img
                            className='img-responsive'
                            src={'/img/cards/' + this.props.deck.agenda.code + '.png'}
                        />
                    ) : null}
                </div>
            </div>
        );
    }
}

DeckSummaryHeader.displayName = 'DeckSummaryHeader';
DeckSummaryHeader.propTypes = {
    deck: PropTypes.object,
    onCardMouseOut: PropTypes.func,
    onCardMouseOver: PropTypes.func
};

export default DeckSummaryHeader;
