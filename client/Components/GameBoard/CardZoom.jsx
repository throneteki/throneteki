import React from 'react';
import PropTypes from 'prop-types';

class CardZoom extends React.Component {
    render() {
        let zoomClass = this.props.orientation === 'vertical' ? 'card-large' : 'card-large-horizontal';

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
