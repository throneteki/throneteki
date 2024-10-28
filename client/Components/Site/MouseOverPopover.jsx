import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';

const MouseOverPopover = ({ children, ...props }) => {
    const [showPopup, setShowPopup] = useState(false);

    const popoverTrigger = children.find(({ type }) => type === PopoverTrigger);
    const popoverContent = children.find(({ type }) => type === PopoverContent);
    return (
        <Popover {...props} isOpen={showPopup} onOpenChange={(open) => setShowPopup(open)}>
            <PopoverTrigger>
                <div onMouseOver={() => setShowPopup(true)} onMouseOut={() => setShowPopup(false)}>
                    {popoverTrigger.props.children}
                </div>
            </PopoverTrigger>
            {popoverContent}
        </Popover>
    );
};

export default MouseOverPopover;
