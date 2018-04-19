import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

class CardMenu extends React.Component {
    onMenuItemClick(menuItem) {
        if(this.props.onMenuItemClick) {
            this.props.onMenuItemClick(menuItem);
        }
    }

    render() {
        var menuIndex = 0;
        var menuItems = this.props.menu.map(menuItem => {
            return <div key={ menuIndex++ } onClick={ this.onMenuItemClick.bind(this, menuItem) }>{ menuItem.text }</div>;
        });

        return (
            <div className='panel menu'>
                { menuItems }
            </div>
        );
    }
}

CardMenu.displayName = 'CardMenu';
CardMenu.propTypes = {
    menu: PropTypes.array.isRequired,
    onMenuItemClick: PropTypes.func
};

export default CardMenu;
