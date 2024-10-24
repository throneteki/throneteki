import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@nextui-org/react';

function FaIconButton({ text, icon, ...rest }) {
    return (
        <Button {...rest} endContent={<FontAwesomeIcon icon={icon} />}>
            {text && <span className='pe-2'>{text}</span>}
        </Button>
    );
}

export default FaIconButton;
