import React from 'react';
import Card from '../Card';
import CardPile from '../CardPile';
import PlayerPlots from '../PlayerPlots';

// The faction card, then the agenda, then any further agendas, each tucked half under the one before it, as on the
// classic board. While the row has room the agenda shows whole; when it has to squeeze, the agenda's column (and
// each further agenda's) narrows and the card before it slides over it, down to a strip of it and no further. A
// column's size is fixed, not taken from the card in it, so the row knows how narrow it can go.
const agendaColumn =
    'minmax(calc(var(--card-scale, 1) * 1.4rem), calc(var(--card-scale, 1) * 4rem + 0.25rem))';
const extraAgendaColumn =
    'minmax(calc(var(--card-scale, 1) * 1rem), calc(var(--card-scale, 1) * 2rem))';

const AgendaSlot = ({ depth, children }) => (
    <div className='relative min-w-0' style={{ zIndex: 10 - depth }}>
        {children}
    </div>
);

// A player's plots, with their faction card and agenda stacked beside them
const PlotFactionStack = ({ player, isMe, side, onCardClick, pileProps, droppable }) => {
    const cardPiles = player.cardPiles;
    const agenda = player.agendas?.[0];
    const hasAgenda = !!agenda?.code;
    const underAgenda = agenda?.childCards || [];
    const additionalAgendas = player.agendas?.slice(1) || [];

    return (
        <div className='flex min-w-0 items-start gap-1'>
            <div className='relative shrink-0'>
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
            </div>
            <div
                className='grid min-w-0 grid-flow-col items-start'
                style={{
                    gridTemplateColumns: [
                        'auto',
                        ...(hasAgenda ? [agendaColumn] : []),
                        ...additionalAgendas.map(() => extraAgendaColumn)
                    ].join(' '),
                    gridAutoColumns: 'auto'
                }}
            >
                <div className='relative z-20 shrink-0'>
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
                {hasAgenda && (
                    <AgendaSlot depth={0}>
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
                    </AgendaSlot>
                )}
                {additionalAgendas.map((extra, index) => (
                    <AgendaSlot key={extra.uuid} depth={index + 1}>
                        <div className='absolute right-0 top-0'>
                            <Card
                                card={extra}
                                source='agenda'
                                onClick={onCardClick}
                                orientation='vertical'
                            />
                        </div>
                    </AgendaSlot>
                ))}
                {player.title && (
                    <div className='relative z-20 ml-1 shrink-0'>
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
