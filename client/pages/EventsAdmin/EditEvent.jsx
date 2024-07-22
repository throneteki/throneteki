import React from 'react';
import EventEditor from './EventEditor';

const EditEvent = ({ eventId }) => {
    // useEffect(() => {
    //     if (eventSaved) {
    //         dispatch(navigate('/events'));
    //     }
    // }, [dispatch, eventSaved]);

    return <EventEditor eventId={eventId} />;
};

export default EditEvent;
