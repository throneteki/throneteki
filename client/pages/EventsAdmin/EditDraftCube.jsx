import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import DraftCubeEditor from './DraftCubeEditor';

class EditDraftCube extends React.Component {
    componentWillMount() {
        const { loadDraftCubeEditor, draftCubeId } = this.props;

        loadDraftCubeEditor(draftCubeId);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.draftCubeSaved) {
            newProps.navigate('/events');
        }
    }

    render() {
        const { apiState, cards, draftCubeId, draftCubes, navigate, packs, saveDraftCube } =
            this.props;

        if (!cards || !packs || !draftCubes) {
            return <div>Please wait while loading from the server...</div>;
        }

        return (
            <DraftCubeEditor
                {...{
                    apiState,
                    cards,
                    draftCube: draftCubes.find((draftCube) => draftCube._id === draftCubeId),
                    navigate,
                    packs,
                    onDraftCubeSave: saveDraftCube
                }}
            />
        );
    }
}

EditDraftCube.displayName = 'EditDraftCube';
EditDraftCube.propTypes = {
    apiState: PropTypes.object,
    cards: PropTypes.object,
    draftCubeId: PropTypes.string,
    draftCubes: PropTypes.array,
    loadDraftCubeEditor: PropTypes.func,
    navigate: PropTypes.func,
    packs: PropTypes.array,
    saveDraftCube: PropTypes.func
};

function mapStateToProps(state) {
    return {
        apiState: state.api.SAVE_EVENT,
        cards: state.cards.cards,
        draftCubes: state.events.draftCubes,
        draftCubeSaved: state.events.draftCubeSaved,
        loading: state.api.loading,
        packs: state.cards.packs,
        restrictedLists: state.cards.restrictedList
    };
}

export default connect(mapStateToProps, actions)(EditDraftCube);
