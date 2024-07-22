import React, { useCallback } from 'react';

import DeckStatus from './DeckStatus';
import CardLink from './CardLink';

const DeckSummaryHeader = ({ currentRestrictedList, deck, onCardMouseOut, onCardMouseOver }) => {
    const getBannersToRender = useCallback(() => {
        let banners = [];

        if (deck.bannerCards) {
            for (const card of deck.bannerCards) {
                banners.push(
                    <div className='pull-right' key={card.code ? card.code : card}>
                        <CardLink
                            card={card}
                            onMouseOut={onCardMouseOut}
                            onMouseOver={onCardMouseOver}
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
    }, [deck.bannerCards, onCardMouseOut, onCardMouseOver]);

    let banners = getBannersToRender();

    return (
        <div className='decklist'>
            <div className='col-xs-2 col-sm-3 no-x-padding'>
                {deck.faction ? (
                    <img
                        className='img-responsive'
                        src={'/img/cards/' + deck.faction.value + '.png'}
                    />
                ) : null}
            </div>
            <div className='col-xs-8 col-sm-6'>
                <div className='info-row row'>
                    <span>Faction:</span>
                    {deck.faction ? (
                        <span className={'pull-right'}>{deck.faction.name}</span>
                    ) : null}
                </div>
                <div className='info-row row'>
                    <span>Agenda:</span>
                    <div className='pull-right'>
                        {deck.agenda && deck.agenda.label ? (
                            <CardLink
                                card={deck.agenda}
                                onMouseOut={onCardMouseOut}
                                onMouseOver={onCardMouseOver}
                            />
                        ) : (
                            <span>None</span>
                        )}
                    </div>
                </div>
                {deck.agenda && deck.agenda.label === 'Alliance' ? banners : null}
                {deck.format && (
                    <div className='info-row row'>
                        <span>Format:</span>
                        <span className='pull-right'>{deck.format}</span>
                    </div>
                )}
                <div className='info-row row'>
                    <span>Draw deck:</span>
                    <span className='pull-right'>{deck.drawCount} cards</span>
                </div>
                <div className='info-row row'>
                    <span>Plot deck:</span>
                    <span className='pull-right'>{deck.plotCount} cards</span>
                </div>
                <div className='info-row row'>
                    <span>Validity:</span>
                    {deck.status[currentRestrictedList._id] && (
                        <DeckStatus
                            className='pull-right'
                            status={deck.status[currentRestrictedList._id]}
                        />
                    )}
                </div>
            </div>
            <div className='col-xs-2 col-sm-3 no-x-padding'>
                {deck.agenda && deck.agenda.code ? (
                    <img
                        className='img-responsive'
                        src={'/img/cards/' + deck.agenda.code + '.png'}
                    />
                ) : null}
            </div>
        </div>
    );
};

export default DeckSummaryHeader;
