import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import AltCard from '../GameBoard/AltCard';

function CardHoverPreview({ card }) {
    return (
        <div className={ classNames('hover-card', { 'horizontal': card.type === 'plot'}) }>
            <img className='hover-image' src={ '/img/cards/' + card.code + '.png' } />
            <AltCard card={ card } />
        </div>);
}

CardHoverPreview.displayName = 'CardHoverPreview';
CardHoverPreview.propTypes = {
    card: PropTypes.object
};

export default CardHoverPreview;
