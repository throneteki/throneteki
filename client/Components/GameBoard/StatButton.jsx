import React from 'react';
import { Button } from '@heroui/react';

const StatButton = ({ image, onClick }) => {
    return (
        <Button className='bg-transparent' onPress={onClick} isIconOnly size='sm' variant='ghost'>
            <img src={image} alt='' />
        </Button>
    );
};

export default StatButton;
