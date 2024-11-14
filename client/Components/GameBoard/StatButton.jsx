import React from 'react';
import { Button, Image } from '@nextui-org/react';

const StatButton = ({ image, onClick }) => {
    return (
        <Button className='bg-transparent' onClick={onClick} isIconOnly size='sm'>
            <Image src={image} />
        </Button>
    );
};

export default StatButton;
