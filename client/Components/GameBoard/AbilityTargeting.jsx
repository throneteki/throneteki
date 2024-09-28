import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback } from 'react';

const AbilityTargeting = ({
    onMouseOver: onMouseOverProp,
    onMouseOut: onMouseOutProp,
    targets,
    source
}) => {
    const onMouseOver = useCallback(
        (event, card) => {
            if (card && onMouseOverProp) {
                onMouseOverProp(card);
            }
        },
        [onMouseOverProp]
    );

    const onMouseOut = useCallback(
        (event, card) => {
            if (card && onMouseOutProp) {
                onMouseOutProp(card);
            }
        },
        [onMouseOutProp]
    );

    const renderSimpleCard = useCallback(
        (card) => {
            return (
                <div
                    className='target-card vertical'
                    onMouseOut={(event) => onMouseOut(event, card)}
                    onMouseOver={(event) => onMouseOver(event, card)}
                >
                    <img
                        className='target-card-image vertical'
                        alt={card.name}
                        src={
                            '/img/cards/' +
                            (card.facedown
                                ? card.shadowPosition
                                    ? 'cardback_shadow.png'
                                    : 'cardback.png'
                                : card.code + '.png')
                        }
                    />
                    {card.shadowPosition ? (
                        <div className='target-card-shadow-position'>
                            {'#' + card.shadowPosition}
                        </div>
                    ) : null}
                </div>
            );
        },
        [onMouseOut, onMouseOver]
    );

    let targetCards = targets.map((target) => renderSimpleCard(target));

    return (
        <div className='flex items-center content-between mb-2 gap-1 mx-2'>
            {renderSimpleCard(source)}
            <FontAwesomeIcon icon={faArrowRight} />
            {targetCards}
        </div>
    );
};

export default AbilityTargeting;
