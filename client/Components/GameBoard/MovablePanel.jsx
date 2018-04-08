import React from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';

import { ItemTypes } from '../../constants';
import PopupDefaults from './PopupDefaults';

const panelSource = {
    beginDrag(props) {
        return {
            name: `${props.name}-${props.side}`
        };
    },
    endDrag(props, monitor) {
        const offset = monitor.getSourceClientOffset();
        const style = {
            left: offset.x,
            top: offset.y,
            position: 'fixed'
        };

        localStorage.setItem(`${props.name}-${props.side}`, JSON.stringify(style));
    }
};

function collect(connect, monitor) {
    return {
        connectDragPreview: connect.dragPreview(),
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
        dragOffset: monitor.getSourceClientOffset()
    };
}

class MovablePanel extends React.Component {
    constructor(props) {
        super(props);

        const key = `${props.name}-${props.side}`;
        const savedStyle = localStorage.getItem(key);
        const style = (savedStyle && JSON.parse(savedStyle)) || PopupDefaults[key];

        this.state = {
            position: Object.assign({}, style)
        };
    }

    componentWillReceiveProps(props) {
        if(props.isDragging) {
            this.setState({
                position: {
                    position: 'fixed',
                    left: props.dragOffset.x,
                    top: props.dragOffset.y
                }
            });
        }
    }

    render() {
        let style = this.state.position;

        let content = (<div className='popup' style={ style }>
            {
                this.props.connectDragSource(
                    <div className='panel-title' onClick={ event => event.stopPropagation() }>
                        <span className='text-center'>{ this.props.title }</span>
                        <span className='pull-right'>
                            <a className='close-button glyphicon glyphicon-remove' onClick={ this.props.onCloseClick } />
                        </span>
                    </div>)
            }
            { this.props.children }
        </div >);

        return content;
    }
}

MovablePanel.displayName = 'MovablePanel';
MovablePanel.propTypes = {
    children: PropTypes.node,
    connectDragPreview: PropTypes.func,
    connectDragSource: PropTypes.func,
    dragOffset: PropTypes.object,
    isDragging: PropTypes.bool,
    name: PropTypes.string.isRequired,
    onCloseClick: PropTypes.func,
    side: PropTypes.oneOf(['top', 'bottom']),
    title: PropTypes.string
};

export default DragSource(ItemTypes.PANEL, panelSource, collect)(MovablePanel);
