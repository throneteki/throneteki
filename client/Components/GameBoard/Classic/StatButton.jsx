import React from 'react';
import { Button, Image } from '@heroui/react';

const StatButton = ({ image, onClick }) => {
    return (
        <Button className='bg-transparent' onPress={onClick} isIconOnly size='sm'>
            <Image src={image} />
        </Button>
    );
};

export default StatButton;
