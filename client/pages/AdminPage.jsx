import React from 'react';
import { useSelector } from 'react-redux';
import BannerNav from '../Components/Site/BannerNav';
import Frame from '../Components/Site/Frame';
import Page from './Page';

export const AdminSections = [
    { key: 'news', label: 'News', path: '/news', permission: 'canEditNews' },
    { key: 'motd', label: 'Message', path: '/admin/motd', permission: 'canManageMotd' },
    { key: 'banners', label: 'Banners', path: '/admin/banners', permission: 'canManageBanners' },
    { key: 'events', label: 'Events', path: '/events', permission: 'canManageEvents' },
    { key: 'users', label: 'Users', path: '/users', permission: 'canManageUsers' },
    { key: 'banlist', label: 'Ban list', path: '/banlist', permission: 'canManageBanlist' },
    {
        key: 'reports',
        label: 'Reports',
        path: '/admin/problem-reports',
        permission: 'canManageProblemReports'
    },
    { key: 'nodes', label: 'Nodes', path: '/nodes', permission: 'canManageNodes' }
];

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
    const items = AdminSections.filter((item) => permissions?.[item.permission]);

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
