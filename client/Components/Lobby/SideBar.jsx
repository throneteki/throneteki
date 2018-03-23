import React from 'react';
import PropTypes from 'prop-types';

class SideBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false
        };

        this.onBurgerClick = this.onBurgerClick.bind(this);
    }

    onBurgerClick() {
        this.setState({ expanded: !this.state.expanded });
    }

    render() {
        if(this.state.expanded) {
            return (
                <div className='sidebar expanded'>
                    <div>
                        <a href='#' className='btn pull-right' onClick={ this.onBurgerClick }>
                            <span className='glyphicon glyphicon-remove' />
                        </a>
                        { this.props.children }
                    </div>
                </div>);
        }

        return (<div className={ 'sidebar' }>
            <div>
                <a href='#' className='btn' onClick={ this.onBurgerClick }>
                    <span className='glyphicon glyphicon-menu-hamburger' />
                </a>
            </div>
        </div>);
    }
}

SideBar.displayName = 'SideBar';
SideBar.propTypes = {
    children: PropTypes.node
};

export default SideBar;
