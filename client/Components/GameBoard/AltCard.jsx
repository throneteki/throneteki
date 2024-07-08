import React, { useMemo } from 'react';
import classNames from 'classnames';
import { ThronesIcons } from '../../constants';

const AltCard = ({ card }) => {
    const icons = useMemo(() => {
        let icons = [];

        if (card.icons) {
            for (let [icon, present] of Object.entries(card.icons)) {
                if (present) {
                    icons.push(
                        <div
                            key={icon}
                            className={`challenge-icon thronesicon thronesicon-${icon} with-background`}
                        />
                    );
                } else {
                    icons.push(<div key={icon} className='challenge-icon' />);
                }
            }
        }

        return icons;
    }, [card.icons]);

    const cardText = useMemo(() => {
        let cardText = card.text.replace(/\n/g, '<br />');
        for (let icon of ThronesIcons) {
            cardText = cardText.replace(
                new RegExp(`\\[${icon}\\]`, 'g'),
                `<span class='thronesicon thronesicon-${icon}'></span>`
            );
        }

        return cardText;
    }, [card.text]);

    return (
        <div className='card-alt'>
            <div className='card-top-row'>
                {!['plot', 'agenda'].includes(card.type) && (
                    <div className='card-cost card-icon'>
                        <span className='card-cost-number'>{card.cost}</span>
                        <div className='card-type'>{card.type}</div>
                    </div>
                )}
                {['event', 'agenda'].includes(card.type) ? (
                    <div className='card-name'>
                        {card.unique ? <span className='card-unique' /> : null} {card.name}
                    </div>
                ) : (
                    <div className='card-name' />
                )}
                {['attachment', 'event'].includes(card.type) && (
                    <div
                        className={`card-faction attachment thronesicon thronesicon-${card.faction} with-background`}
                    />
                )}
            </div>
            <div
                className={classNames('card-icons', {
                    attachment: ['attachment', 'event', 'agenda'].includes(card.type),
                    plot: card.type === 'plot'
                })}
            >
                {icons}
            </div>
            <div
                className={classNames('card-name-row', {
                    vertical: card.type === 'location'
                })}
            >
                {card.strength && <div className='card-strength'>{card.strength}</div>}
                {card.type === 'plot' && (
                    <div className='plot-stats'>
                        <div className='plot-income card-icon'>{card.plotStats.income}</div>
                        <div className='plot-initiative card-icon'>{card.plotStats.initiative}</div>
                        <div className='plot-claim card-icon'>{card.plotStats.claim}</div>
                    </div>
                )}
                {['character', 'location', 'plot'].includes(card.type) && (
                    <div className='card-name'>
                        {card.unique ? <span className='card-unique' /> : null} {card.name}
                    </div>
                )}
                {['character', 'location', 'plot'].includes(card.type) && (
                    <div
                        className={`card-faction thronesicon thronesicon-${card.faction} with-background`}
                    />
                )}
            </div>
            <div className='card-text'>
                <div className='card-traits'>
                    {card.traits.join('. ')}
                    {card.traits.length > 0 ? '.' : null}
                </div>
                <span className='text-inner' dangerouslySetInnerHTML={{ __html: cardText }} />{' '}
                {/* eslint-disable-line */}
                {['attachment'].includes(card.type) && (
                    <div className='card-name'>
                        {card.unique ? <span className='card-unique' /> : null} {card.name}
                    </div>
                )}
            </div>
            {card.type === 'plot' && <div className='plot-reserve'>{card.plotStats.reserve}</div>}
        </div>
    );
};

export default AltCard;
