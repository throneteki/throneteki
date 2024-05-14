import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class DraftCard extends React.Component {
    constructor() {
        super();

        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);

        this.state = {
            showMenu: false
        };
    }

    onMouseOver(card) {
        if (this.props.onMouseOver) {
            this.props.onMouseOver(card);
        }
    }

    onMouseOut() {
        if (this.props.onMouseOut) {
            this.props.onMouseOut();
        }
    }

    onClick(event, card) {
        if (this.props.onClick) {
            this.props.onClick(card);
        }
    }

    getCard() {
        if (!this.props.card) {
            return <div />;
        }

        let cardClass = classNames(
            'card',
            `card-type-${this.props.card.type}`,
            this.props.className,
            this.sizeClass,
            this.statusClass,
            {
                'custom-card': this.props.card.code && this.props.card.code.startsWith('custom'),
                horizontal: this.props.orientation !== 'vertical',
                vertical: this.props.orientation === 'vertical'
            }
        );
        let imageClass = classNames('card-image', this.sizeClass, {
            horizontal: this.props.card.type === 'plot',
            vertical: this.props.card.type !== 'plot'
        });

        let image = <img className={imageClass} src={this.imageUrl} />;

        return (
            <div className='card-frame'>
                <div
                    className={cardClass}
                    onMouseOver={this.onMouseOver.bind(this, this.props.card)}
                    onMouseOut={this.onMouseOut}
                    onClick={(ev) => this.onClick(ev, this.props.card)}
                >
                    <div>
                        <span className='card-name'>{this.props.card.name}</span>
                        {image}
                    </div>
                </div>
            </div>
        );
    }

    get imageUrl() {
        let image = `${this.props.card.code}.png`;

        return '/img/cards/' + image;
    }

    get sizeClass() {
        return {
            [this.props.size]: this.props.size !== 'normal'
        };
    }

    get statusClass() {
        if (!this.props.selected) {
            return;
        }

        if (this.props.selected) {
            return 'selected';
        }
    }

    render() {
        if (this.props.wrapped) {
            return (
                <div className='card-wrapper' style={this.props.style}>
                    {this.getCard()}
                </div>
            );
        }

        return this.getCard();
    }
}

DraftCard.displayName = 'Card';
DraftCard.propTypes = {
    card: PropTypes.shape({
        code: PropTypes.string,
        name: PropTypes.string
    }).isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    orientation: PropTypes.oneOf(['horizontal', 'kneeled', 'vertical']),
    selected: PropTypes.bool,
    size: PropTypes.string,
    style: PropTypes.object,
    wrapped: PropTypes.bool
};
DraftCard.defaultProps = {
    orientation: 'vertical',
    wrapped: true
};

export default DraftCard;
