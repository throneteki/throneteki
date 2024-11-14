import React, { useCallback } from 'react';
import classNames from 'classnames';

const DraftCard = ({
    card,
    className,
    onClick,
    onMouseOut,
    onMouseOver,
    orientation = 'vertical',
    selected,
    size,
    style,
    wrapped = true
}) => {
    const imageUrl = `/img/cards/${card.code}.png`;

    const sizeClass = {
        [size]: size !== 'normal'
    };

    const statusClass = selected ? 'selected' : undefined;

    const handleMouseOver = useCallback(() => {
        if (onMouseOver) {
            onMouseOver(card);
        }
    }, [onMouseOver, card]);

    const handleMouseOut = useCallback(() => {
        if (onMouseOut) {
            onMouseOut();
        }
    }, [onMouseOut]);

    const handleClick = useCallback(() => {
        if (onClick) {
            onClick(card);
        }
    }, [onClick, card]);

    const getCard = () => {
        if (!card) {
            return <div />;
        }

        const cardClass = classNames(
            'card',
            `card-type-${card.type}`,
            className,
            sizeClass,
            statusClass,
            {
                'custom-card': card.code && card.code.startsWith('custom'),
                horizontal: orientation !== 'vertical',
                vertical: orientation === 'vertical'
            }
        );
        const imageClass = classNames('card-image', sizeClass, {
            horizontal: card.type === 'plot',
            vertical: card.type !== 'plot'
        });

        const image = <img className={imageClass} src={imageUrl} />;

        return (
            <div className='card-frame'>
                <div
                    className={cardClass}
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                    onClick={handleClick}
                >
                    <div>
                        <span className='card-name'>{card.name}</span>
                        {image}
                    </div>
                </div>
            </div>
        );
    };

    if (wrapped) {
        return (
            <div className='card-wrapper' style={style}>
                {getCard()}
            </div>
        );
    }

    return getCard();
};

export default DraftCard;
