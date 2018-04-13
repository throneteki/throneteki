import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class CardZoom extends React.Component {
    render() {
        const zoomClass = classNames('card-large', {
            vertical: this.props.orientation === 'vertical',
            horizontal: this.props.orientation === 'horizontal'
        });

        return (
            <div className={ zoomClass }>
                { this.props.show ?
                    <div className='card-zoomed shadow'>
                        <span className='card-name'>{ this.props.cardName }</span>
                        <img className='image-large img-responsive' src={ this.props.imageUrl } />
                    </div>
                    : null }
            </div>);
    }
}

CardZoom.displayName = 'CardZoom';
CardZoom.propTypes = {
    cardName: PropTypes.string,
    imageUrl: PropTypes.string,
    orientation: PropTypes.oneOf(['horizontal', 'vertical']),
    show: PropTypes.bool
};

export default CardZoom;
