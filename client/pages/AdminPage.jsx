import React from 'react';
import { useSelector } from 'react-redux';
import BannerNav from '../Components/Site/BannerNav';
import Frame from '../Components/Site/Frame';
import Page from './Page';
import { AdminSections } from '../menus';

const AdminPage = ({
    section,
    title,
    description,
    actions,
    footer,
    bodyClassName,
    frameRef,
    children
}) => {
    const permissions = useSelector((state) => state.auth.user?.permissions);
    const items = AdminSections.filter((item) => permissions?.[item.permission]).map((item) => ({
        ...item,
        label: item.title
    }));

    return (
        <Page size='wide' className='max-w-[1240px]'>
            <div>
                {items.length > 1 && (
                    <BannerNav label='Admin sections' items={items} current={section} />
                )}
                <Frame
                    ref={frameRef}
                    title={title}
                    description={description}
                    actions={actions}
                    footer={footer}
                    bodyClassName={bodyClassName}
                >
                    {children}
                </Frame>
            </div>
        </Page>
    );
};

export default AdminPage;
