import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';

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
        let component = this.state.expanded ? (
            <div className='sidebar expanded' key='sidebar-expanded'>
                <div>
                    <a href='#' className='btn pull-right' onClick={this.onBurgerClick}>
                        <span className='glyphicon glyphicon-remove' />
                    </a>
                    {this.props.children}
                </div>
            </div>
        ) : (
            <div className='sidebar collapsed' key='sidebar'>
                <div>
                    <a href='#' className='btn' onClick={this.onBurgerClick}>
                        <span className='glyphicon glyphicon-menu-hamburger' />
                    </a>
                </div>
            </div>
        );

        return (
            <CSSTransitionGroup
                transitionName='sidebar'
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}
            >
                {component}
            </CSSTransitionGroup>
        );
    }
}

SideBar.displayName = 'SideBar';
SideBar.propTypes = {
    children: PropTypes.node
};

export default SideBar;
