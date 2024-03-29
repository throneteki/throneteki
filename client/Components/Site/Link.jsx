import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import * as actions from '../../actions';

const mapStateToProps = (state, ownProps) => {
    return {
        href: ownProps.href
    };
};

class Link extends React.Component {
    constructor() {
        super();

        this.onClick = this.onClick.bind(this);
    }

    onClick(event) {
        event.preventDefault();
        this.props.navigate(this.props.href);
    }

    render() {
        return (<a className={ this.props.className } href={ this.props.href } onClick={ this.onClick }>{ this.props.children }</a>);
    }
}

Link.displayName = 'Link';
Link.propTypes = {
    children: PropTypes.string,
    className: PropTypes.string,
    href: PropTypes.string,
    navigate: PropTypes.func
};

export default connect(mapStateToProps, actions)(Link);
