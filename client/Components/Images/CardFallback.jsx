import React from 'react';
import { CardBlank, CardPreview } from '@agot/card-preview';
import { useGetCardsQuery } from '../../redux/middleware/api';

export const failedWatermark = { top: 'Image', middle: 'FAILED', bottom: 'to load' };
export const slowWatermark = { top: 'Image', middle: 'LOADING', bottom: 'slowly' };

// The same plain card the preview draws when a card has no faction and no type, with only the watermark on it
const blankCard = {
    background: 'white',
    boxSizing: 'border-box',
    border: '12px solid white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#e5e7eb',
    fontWeight: 700,
    fontSize: 14
};

// Used for card backs and other things that are not cards, and while the card details are still on their way
const BlankFallback = ({ watermark }) => (
    <div className='absolute inset-0 overflow-hidden'>
        <CardBlank styles={{ inner: blankCard }}>
            <span>{watermark.top}</span>
            <span style={{ fontSize: 36, lineHeight: 1 }}>{watermark.middle}</span>
            <span>{watermark.bottom}</span>
        </CardBlank>
    </div>
);

// Mounted only once an image has failed or is slow, so the card list is only fetched when it is needed
const CardFallback = ({ code, orientation = 'vertical', watermark = failedWatermark }) => {
    const isBack = code?.startsWith('cardback');
    const { data: cards } = useGetCardsQuery({}, { skip: isBack });
    const card = cards?.[code];

    if (!card) {
        return <BlankFallback watermark={watermark} />;
    }

    return (
        <div className='absolute inset-0 overflow-hidden'>
            <CardPreview card={{ ...card, watermark }} orientation={orientation} />
        </div>
    );
};

export default CardFallback;
