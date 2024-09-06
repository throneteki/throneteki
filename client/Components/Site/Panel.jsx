import { Card, CardBody, CardHeader } from '@nextui-org/react';
import React from 'react';

const PanelType = Object.freeze({
    Default: 'default',
    Primary: 'primary',
    Info: 'info',
    Warning: 'warning',
    Danger: 'danger'
});

const Panel = ({
    className,
    type = PanelType.Primary,
    title,
    titleClass,
    children,
    fullHeight = true
}) => {
    return (
        <Card
            className={`${className} border-2 bg-opacity-65 border-${type} ${
                fullHeight ? 'h-full' : ''
            } shadow-lg`}
            classNames={{ body: 'h-full overflow-y-auto' }}
        >
            {title && (
                <CardHeader
                    className={`${titleClass} justify-center bg-${type} rounded-none font-bold`}
                >
                    {title}
                </CardHeader>
            )}
            <CardBody>{children}</CardBody>
        </Card>
    );
};

export default Panel;
