import React from 'react';
import Card from '../Card';
import CardPile from '../CardPile';
import PlayerPlots from '../PlayerPlots';

// The faction card lies over the agenda, which shows a strip down its left side
const peekBehind = { marginLeft: 'calc(var(--card-scale, 1) * -2.6rem)' };

// A player's plots, with their faction card and agenda stacked beside them
const PlotFactionStack = ({ player, isMe, side, onCardClick, pileProps, droppable }) => {
    const cardPiles = player.cardPiles;
    const agenda = player.agendas?.[0];
    const hasAgenda = !!agenda?.code;
    const underAgenda = agenda?.childCards || [];
    const additionalAgendas = player.agendas?.slice(1) || [];

    return (
        <div className='flex items-start gap-1'>
            <PlayerPlots
                onCardClick={onCardClick}
                direction={side === 'bottom' ? 'default' : 'reverse'}
                isMe={isMe}
                playerName={player.user?.username}
                plotDeck={cardPiles.plotDeck}
                plotDiscard={cardPiles.plotDiscard}
                activePlot={player.activePlot}
                selectedPlot={player.selectedPlot}
                mustShowPlotSelection={player.mustShowPlotSelection}
            />
            <div className='flex items-start'>
                {additionalAgendas.map((extra, index) => (
                    <div
                        key={extra.uuid}
                        className='relative z-0'
                        style={index > 0 ? peekBehind : null}
                    >
                        <Card
                            card={extra}
                            source='agenda'
                            onClick={onCardClick}
                            orientation='vertical'
                        />
                    </div>
                ))}
                {hasAgenda && (
                    <div
                        className='relative z-0'
                        style={additionalAgendas.length > 0 ? peekBehind : null}
                    >
                        {droppable(
                            'agenda',
                            <CardPile
                                cards={underAgenda}
                                disablePopup={underAgenda.length === 0}
                                showCards
                                source='agenda'
                                title={underAgenda.length > 0 ? 'Agenda' : null}
                                topCard={agenda}
                                numColumns={5}
                                numRows={1.2}
                                {...pileProps}
                            />
                        )}
                    </div>
                )}
                <div className='relative z-10' style={hasAgenda ? peekBehind : null}>
                    <CardPile
                        className='faction'
                        source='faction'
                        cards={[]}
                        topCard={player.faction}
                        disablePopup
                        onCardClick={onCardClick}
                        orientation={player.faction?.kneeled ? 'horizontal' : 'vertical'}
                    />
                </div>
                {player.title && (
                    <div className='relative z-0 ml-1'>
                        <Card
                            card={player.title}
                            source='title'
                            onClick={onCardClick}
                            orientation='vertical'
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlotFactionStack;
