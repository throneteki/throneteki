import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import classNames from 'classnames';
import { Button, Spinner, Table } from '@heroui/react';
import { toast } from 'react-toastify';

import Field from '../Components/Site/Field';
import Group from '../Components/Site/Group';
import SettingSwitch from '../Components/Site/SettingSwitch';
import SaveBar from '../Components/Site/SaveBar';
import ConfirmDialog from '../Components/Site/ConfirmDialog';
import UserAvatar from '../Components/Site/UserAvatar';
import {
    useAddAbuseBlockMutation,
    useBlockUserClusterMutation,
    useGetUserAbuseProfileQuery,
    useGetUserQuery,
    useRestrictUserMutation,
    useUnrestrictUserMutation,
    useSaveUserMutation
} from '../redux/middleware/api';
import { sendClearUserSessions } from '../redux/reducers/lobby';
import AdminPage from './AdminPage';

const Roles = [
    { name: 'isAdmin', label: 'Site admin', hint: 'Name shows in red' },
    { name: 'isContributor', label: 'Contributor', hint: 'Name shows in blue' },
    { name: 'isSupporter', label: 'Supporter', hint: 'Name shows in green' }
];

const AdminAreas = [
    { name: 'canEditNews', label: 'News' },
    { name: 'canManageMotd', label: 'Message of the day' },
    { name: 'canManageBanners', label: 'Banners' },
    { name: 'canManageEvents', label: 'Events' },
    { name: 'canManageUsers', label: 'Users' },
    { name: 'canManagePermissions', label: 'Permissions', hint: 'Can change these switches' },
    { name: 'canManageBanlist', label: 'Ban list' },
    { name: 'canManageProblemReports', label: 'Problem reports' },
    { name: 'canManageNodes', label: 'Game nodes' },
    { name: 'canManageGames', label: 'Games', hint: 'Remove games and watch private ones' },
    { name: 'canModerateChat', label: 'Chat moderator', hint: 'Remove lobby messages' }
];

const defaultPermissions = Object.fromEntries(
    [...Roles, ...AdminAreas].map((permission) => [permission.name, false])
);

const TrustStates = {
    trusted: 'Trusted',
    new: 'New',
    restricted: 'Restricted',
    banned_evasion_review: 'Banned, under review'
};

const formatTime = (time) => moment(time).format('D MMM YYYY, H:mm');
const errorMessage = (err, fallback) => err?.data?.message || err?.message || fallback;

const Tag = ({ tone = 'quiet', children }) => (
    <span
        className={classNames('rounded-full border px-2.5 py-0.5 text-xs', {
            'border-edge text-ink-dim': tone === 'quiet',
            'border-success/40 text-success': tone === 'good',
            'border-warning/40 text-warning': tone === 'warning',
            'border-danger/40 text-danger': tone === 'danger'
        })}
    >
        {children}
    </span>
);

const switchRow = 'flex w-full items-stretch border-b border-gold-hair';

const UserAdmin = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [searchText, setSearchText] = useState('');
    const [searchUsername, setSearchUsername] = useState();
    const [permissions, setPermissions] = useState(defaultPermissions);
    const [disabled, setDisabled] = useState(false);
    const [verified, setVerified] = useState(false);
    const [confirming, setConfirming] = useState();

    const { data, isFetching, error } = useGetUserQuery(searchUsername, {
        skip: !searchUsername
    });
    const { data: abuseProfile } = useGetUserAbuseProfileQuery(searchUsername, {
        skip: !searchUsername
    });
    const [saveUser, { isLoading: isSaving }] = useSaveUserMutation();
    const [restrictUser, { isLoading: isRestricting }] = useRestrictUserMutation();
    const [unrestrictUser, { isLoading: isUnrestricting }] = useUnrestrictUserMutation();
    const [blockUserCluster] = useBlockUserClusterMutation();
    const [addAbuseBlock] = useAddAbuseBlockMutation();

    const currentUser = data?.user && data.user.username === searchUsername ? data.user : null;
    const savedPermissions = { ...defaultPermissions, ...currentUser?.permissions };

    const reset = () => {
        setPermissions(savedPermissions);
        setDisabled(!!currentUser?.disabled);
        setVerified(!!currentUser?.verified);
    };

    useEffect(() => {
        if (data?.user) {
            setPermissions({ ...defaultPermissions, ...data.user.permissions });
            setDisabled(!!data.user.disabled);
            setVerified(!!data.user.verified);
        }
    }, [data]);

    useEffect(() => {
        if (error) {
            toast.error(
                error.status === 404
                    ? `There is no user called ${searchUsername}.`
                    : errorMessage(error, 'The user could not be loaded.')
            );
        }
    }, [error, searchUsername]);

    const isDirty =
        !!currentUser &&
        (disabled !== !!currentUser.disabled ||
            verified !== !!currentUser.verified ||
            Object.keys(permissions).some(
                (name) => !!permissions[name] !== !!savedPermissions[name]
            ));

    const run = async (action, success, failure) => {
        try {
            await action().unwrap();
            toast.success(success);
        } catch (err) {
            toast.error(errorMessage(err, failure));
        }
    };

    const onSave = () =>
        run(
            () => saveUser({ ...currentUser, permissions, disabled, verified }),
            'User saved',
            'The user could not be saved. Try again later.'
        );

    const signals = currentUser && [
        {
            scope: 'ip',
            label: 'IP address',
            value:
                currentUser.lastLoginIp ||
                currentUser.registerIpNormalized ||
                currentUser.registerIp
        },
        {
            scope: 'subnet',
            label: 'Subnet',
            value: currentUser.lastLoginSubnet || currentUser.registerSubnet
        },
        {
            scope: 'fingerprint',
            label: 'Browser fingerprint',
            value: currentUser.signupFingerprintHash
        }
    ];

    const isRestricted = abuseProfile?.trustState === 'restricted';
    const canEditPermissions = user?.permissions?.canManagePermissions;

    const renderSwitches = (list) =>
        list.map((permission) => (
            <SettingSwitch
                key={permission.name}
                label={permission.label}
                hint={permission.hint}
                isSelected={permissions[permission.name]}
                onValueChange={(value) =>
                    setPermissions((previous) => ({ ...previous, [permission.name]: value }))
                }
                className={switchRow}
            />
        ));

    return (
        <AdminPage
            section='users'
            title='Users'
            description='Look up an account to change its permissions, verify or disable it, or deal with abuse.'
            footer={
                currentUser && (
                    <SaveBar
                        status={isDirty ? 'You have unsaved changes' : 'No unsaved changes'}
                        tone={isDirty ? 'warning' : 'quiet'}
                        isDirty={isDirty}
                        isSaving={isSaving}
                        onDiscard={reset}
                        form='user-admin-form'
                    />
                )
            }
        >
            <form
                className='flex max-w-xl items-end gap-2'
                onSubmit={(event) => {
                    event.preventDefault();
                    setSearchUsername(searchText.trim());
                }}
            >
                <Field
                    label='Username'
                    value={searchText}
                    onValueChange={setSearchText}
                    className='flex-1'
                    autoComplete='off'
                />
                <Button
                    type='submit'
                    variant='primary'
                    isDisabled={!searchText.trim()}
                    isPending={isFetching}
                >
                    {isFetching && <Spinner color='current' size='sm' />}
                    Find
                </Button>
            </form>

            {!currentUser && !isFetching && (
                <p className='py-6 text-center text-sm text-ink-dim'>
                    Search for a username to see the account.
                </p>
            )}

            {currentUser && (
                <form
                    id='user-admin-form'
                    className='contents'
                    onSubmit={(event) => {
                        event.preventDefault();
                        onSave();
                    }}
                >
                    <section className='flex flex-wrap items-center gap-4 border-y border-gold-hair py-4'>
                        <UserAvatar username={currentUser.username} size='lg' />
                        <div className='min-w-0 flex-1'>
                            <h3 className='truncate font-display text-xl font-semibold text-ink'>
                                {currentUser.username}
                            </h3>
                            <p className='truncate text-sm text-ink-dim'>
                                {currentUser.email}
                                <span className='text-ink-faint'>
                                    {' '}
                                    · joined {moment(currentUser.registered).format('D MMM YYYY')}
                                </span>
                            </p>
                        </div>
                        <div className='flex flex-wrap gap-1.5'>
                            {currentUser.disabled && <Tag tone='danger'>Disabled</Tag>}
                            {!currentUser.verified && <Tag tone='warning'>Not verified</Tag>}
                            {abuseProfile?.trustState && (
                                <Tag
                                    tone={
                                        abuseProfile.trustState === 'trusted'
                                            ? 'good'
                                            : abuseProfile.trustState === 'new'
                                              ? 'quiet'
                                              : 'danger'
                                    }
                                >
                                    {TrustStates[abuseProfile.trustState] ??
                                        abuseProfile.trustState}
                                </Tag>
                            )}
                        </div>
                    </section>

                    <Group title='Account'>
                        <div className='grid grid-cols-1 gap-x-8 border-t border-gold-hair md:grid-cols-2'>
                            <SettingSwitch
                                label='Verified'
                                hint='The email address has been confirmed'
                                isSelected={verified}
                                onValueChange={setVerified}
                                className={switchRow}
                            />
                            <SettingSwitch
                                label='Disabled'
                                hint="Can't log in"
                                isSelected={disabled}
                                onValueChange={setDisabled}
                                className={switchRow}
                            />
                        </div>
                    </Group>

                    {canEditPermissions && (
                        <Group
                            title='Permissions'
                            description='Roles change how the name looks; admin areas open sections of this admin area.'
                        >
                            <div className='flex flex-col gap-5'>
                                <div className='grid grid-cols-1 gap-x-8 border-t border-gold-hair md:grid-cols-3'>
                                    {renderSwitches(Roles)}
                                </div>
                                <div className='grid grid-cols-1 gap-x-8 border-t border-gold-hair md:grid-cols-2 xl:grid-cols-3'>
                                    {renderSwitches(AdminAreas)}
                                </div>
                            </div>
                        </Group>
                    )}

                    {abuseProfile && (
                        <Group
                            title='Abuse'
                            description='These act straight away; they are not part of Save changes.'
                        >
                            <dl className='grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4'>
                                <div>
                                    <dt className='text-ink-faint'>Risk score</dt>
                                    <dd className='text-lg tabular-nums text-ink'>
                                        {abuseProfile.riskScore}
                                    </dd>
                                </div>
                                <div>
                                    <dt className='text-ink-faint'>Trust</dt>
                                    <dd className='text-ink'>
                                        {TrustStates[abuseProfile.trustState] ??
                                            abuseProfile.trustState}
                                    </dd>
                                </div>
                                <div>
                                    <dt className='text-ink-faint'>Restricted until</dt>
                                    <dd className='text-ink'>
                                        {abuseProfile.restrictedUntil
                                            ? formatTime(abuseProfile.restrictedUntil)
                                            : 'Not restricted'}
                                    </dd>
                                </div>
                                <div className='col-span-2 sm:col-span-1'>
                                    <dt className='text-ink-faint'>Flags</dt>
                                    <dd className='flex flex-wrap gap-1 pt-0.5'>
                                        {abuseProfile.riskFlags?.length ? (
                                            abuseProfile.riskFlags.map((flag) => (
                                                <Tag key={flag}>{flag.replace(/_/g, ' ')}</Tag>
                                            ))
                                        ) : (
                                            <span className='text-ink'>None</span>
                                        )}
                                    </dd>
                                </div>
                            </dl>

                            <div className='mt-5 flex flex-col gap-4'>
                                <div className='flex flex-wrap items-center gap-2'>
                                    {isRestricted ? (
                                        <Button
                                            variant='tertiary'
                                            isPending={isUnrestricting}
                                            onPress={() =>
                                                run(
                                                    () =>
                                                        unrestrictUser({
                                                            username: currentUser.username,
                                                            reason: 'Unrestricted from user admin'
                                                        }),
                                                    'Restriction lifted',
                                                    'The restriction could not be lifted.'
                                                )
                                            }
                                        >
                                            Lift restriction
                                        </Button>
                                    ) : (
                                        <Button
                                            variant='tertiary'
                                            isPending={isRestricting}
                                            onPress={() => setConfirming('restrict')}
                                        >
                                            Restrict for 7 days
                                        </Button>
                                    )}
                                    <Button
                                        variant='ghost'
                                        className='text-danger'
                                        onPress={() => setConfirming('cluster')}
                                    >
                                        Block cluster
                                    </Button>
                                </div>
                                <ul className='border-t border-gold-hair'>
                                    {signals.map((signal) => (
                                        <li
                                            key={signal.scope}
                                            className='flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-gold-hair py-2'
                                        >
                                            <span className='w-40 text-sm text-ink-dim'>
                                                {signal.label}
                                            </span>
                                            <span className='min-w-0 flex-1 truncate font-mono text-sm text-ink'>
                                                {signal.value || (
                                                    <span className='font-sans text-ink-faint'>
                                                        Not known
                                                    </span>
                                                )}
                                            </span>
                                            <Button
                                                size='sm'
                                                variant='ghost'
                                                className='text-danger'
                                                isDisabled={!signal.value}
                                                onPress={() =>
                                                    run(
                                                        () =>
                                                            addAbuseBlock({
                                                                scope: signal.scope,
                                                                value: signal.value,
                                                                reason: `Manual ${signal.scope} block from user admin`,
                                                                sourceUserId: currentUser._id
                                                            }),
                                                        `${signal.label} blocked`,
                                                        'The block could not be added.'
                                                    )
                                                }
                                            >
                                                Block
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Group>
                    )}

                    {abuseProfile?.linkedAccounts?.length > 0 && (
                        <Group
                            title='Possibly linked accounts'
                            description='Accounts that share an address, subnet or browser with this one.'
                        >
                            <Table variant='secondary'>
                                <Table.ScrollContainer>
                                    <Table.Content aria-label='Possibly linked accounts'>
                                        <Table.Header>
                                            <Table.Column isRowHeader>Account</Table.Column>
                                            <Table.Column>Shares</Table.Column>
                                            <Table.Column>Status</Table.Column>
                                        </Table.Header>
                                        <Table.Body>
                                            {abuseProfile.linkedAccounts.map((account) => (
                                                <Table.Row
                                                    key={account.username}
                                                    id={account.username}
                                                >
                                                    <Table.Cell>
                                                        <button
                                                            type='button'
                                                            className='text-gold underline decoration-gold-line underline-offset-2 hover:decoration-gold'
                                                            onClick={() => {
                                                                setSearchText(account.username);
                                                                setSearchUsername(account.username);
                                                            }}
                                                        >
                                                            {account.username}
                                                        </button>
                                                    </Table.Cell>
                                                    <Table.Cell className='text-ink-dim'>
                                                        {account.evidence
                                                            .map((item) =>
                                                                item.replace(/^shared /, '')
                                                            )
                                                            .join(', ')}
                                                    </Table.Cell>
                                                    <Table.Cell className='text-ink-dim'>
                                                        {account.disabled
                                                            ? 'Disabled'
                                                            : (TrustStates[account.trustState] ??
                                                              account.trustState)}
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table.Content>
                                </Table.ScrollContainer>
                            </Table>
                        </Group>
                    )}

                    {currentUser.tokens && (
                        <Group title='Sessions'>
                            {currentUser.tokens.length === 0 ? (
                                <p className='text-sm text-ink-dim'>Not logged in anywhere.</p>
                            ) : (
                                <Table variant='secondary'>
                                    <Table.ScrollContainer>
                                        <Table.Content aria-label='Sessions'>
                                            <Table.Header>
                                                <Table.Column isRowHeader>IP address</Table.Column>
                                                <Table.Column>Last used</Table.Column>
                                            </Table.Header>
                                            <Table.Body>
                                                {currentUser.tokens.map((token, index) => (
                                                    <Table.Row key={index} id={index}>
                                                        <Table.Cell className='font-mono text-sm'>
                                                            {token.ip}
                                                        </Table.Cell>
                                                        <Table.Cell className='text-ink-dim'>
                                                            {formatTime(token.lastUsed)}
                                                        </Table.Cell>
                                                    </Table.Row>
                                                ))}
                                            </Table.Body>
                                        </Table.Content>
                                    </Table.ScrollContainer>
                                </Table>
                            )}
                            <Button
                                variant='tertiary'
                                className='mt-3'
                                onPress={() => {
                                    dispatch(sendClearUserSessions(currentUser.username));
                                    toast.success(`${currentUser.username} has been logged out`);
                                }}
                            >
                                Log out everywhere
                            </Button>
                        </Group>
                    )}
                </form>
            )}

            <ConfirmDialog
                isOpen={confirming === 'restrict'}
                title={currentUser && `Restrict ${currentUser.username} for 7 days?`}
                message="They won't be able to start or join games, or chat in the lobby, until it ends."
                okLabel='Restrict'
                cancelLabel='Cancel'
                onOpenChange={(open) => !open && setConfirming(undefined)}
                onCancel={() => setConfirming(undefined)}
                onOk={() => {
                    setConfirming(undefined);
                    run(
                        () =>
                            restrictUser({
                                username: currentUser.username,
                                days: 7,
                                reason: 'Restricted from user admin'
                            }),
                        `${currentUser.username} is restricted for 7 days`,
                        'The user could not be restricted.'
                    );
                }}
            />
            <ConfirmDialog
                isOpen={confirming === 'cluster'}
                isDestructive
                title={currentUser && `Block ${currentUser.username}'s cluster?`}
                message='This blocks their IP address, subnet, browser fingerprint and email domain, disables the account and logs it out everywhere.'
                okLabel='Block cluster'
                cancelLabel='Cancel'
                onOpenChange={(open) => !open && setConfirming(undefined)}
                onCancel={() => setConfirming(undefined)}
                onOk={() => {
                    setConfirming(undefined);
                    run(
                        () =>
                            blockUserCluster({
                                username: currentUser.username,
                                reason: 'Blocked from user admin'
                            }),
                        `${currentUser.username}'s cluster is blocked`,
                        'The cluster could not be blocked.'
                    );
                }}
            />
        </AdminPage>
    );
};

export default UserAdmin;
