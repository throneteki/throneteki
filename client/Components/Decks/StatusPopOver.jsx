import React, { useState, useEffect, useRef } from 'react';
import $ from 'jquery';
import ReactDOMServer from 'react-dom/server';

const StatusPopOver = ({ children, show, status }) => {
    const [showing, setShowing] = useState(false);
    const popoverRef = useRef(null);

    useEffect(() => {
        const popovers = $(popoverRef.current);

        if (!popovers || !popovers.popover) {
            return;
        }

        if (show && !showing) {
            popovers.popover();
            setShowing(true);
        } else if (!show && showing) {
            popovers.popover('destroy');
            setShowing(false);
        }
    }, [show, showing]);

    const content = ReactDOMServer.renderToString(children);

    return (
        <span
            ref={popoverRef}
            data-trigger='hover'
            data-html='true'
            data-toggle='popover'
            data-content={content}
        >
            {status}
        </span>
    );
};

export default StatusPopOver;
