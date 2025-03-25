import { Card, CardBody, CardHeader } from '@heroui/react';
import classNames from 'classnames';
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
    let border = 'border-default';
    if (type === PanelType.Primary) {
        border = 'border-primary';
    } else if (type === PanelType.Info) {
        border = 'border-info';
    } else if (type === PanelType.Warning) {
        border = 'border-warning';
    } else if (type === PanelType.Danger) {
        border = 'border-danger';
    }
    const cardClass = classNames(className, 'shadow-lg border-2 bg-black/65', border, {
        'h-full': fullHeight
    });
    return (
        <Card className={cardClass} classNames={{ body: 'h-full overflow-y-auto' }}>
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
