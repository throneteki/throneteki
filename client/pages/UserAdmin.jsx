import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import Panel from '../Components/Site/Panel';
import {
    useAddAbuseBlockMutation,
    useBlockUserClusterMutation,
    useGetUserAbuseProfileQuery,
    useGetUserQuery,
    useRestrictUserMutation,
    useSaveUserMutation
} from '../redux/middleware/api';
import { sendClearUserSessions } from '../redux/reducers/lobby';
import {
    Button,
    Input,
    Link,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from '@heroui/react';
import { toast } from 'react-toastify';
import Page from './Page';

const defaultPermissions = {
    canEditNews: false,
    canManageUsers: false,
    canManagePermissions: false,
    canManageGames: false,
    canManageNodes: false,
    canModerateChat: false,
    canManageMotd: false,
    canManageBanlist: false,
    canManageEvents: false,
    isAdmin: false,
    isContributor: false,
    isSupporter: false
};

const availablePermissions = [
    { name: 'canEditNews', label: 'News Editor' },
    { name: 'canManageUsers', label: 'User Manager' },
    { name: 'canManagePermissions', label: 'Permissions Manager' },
    { name: 'canManageGames', label: 'Games Manager' },
    { name: 'canManageNodes', label: 'Node Manager' },
    { name: 'canModerateChat', label: 'Chat Moderator' },
    { name: 'canManageMotd', label: 'Motd Manager' },
    { name: 'canManageBanlist', label: 'Banlist Manager' },
    { name: 'canManageEvents', label: 'Events Manager' },
    { name: 'isAdmin', label: 'Site Admin' },
    { name: 'isContributor', label: 'Contributor' },
    { name: 'isSupporter', label: 'Supporter' }
];

const UserAdmin = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [searchUsername, setSearchUsername] = useState();
    const [permissions, setPermissions] = useState(defaultPermissions);
    const [currentUser, setCurrentUser] = useState();
    const [username, setUsername] = useState();

    const { data, isLoading, error, refetch } = useGetUserQuery(searchUsername, {
        skip: !searchUsername
    });
    const { data: abuseProfile } = useGetUserAbuseProfileQuery(searchUsername, {
        skip: !searchUsername
    });
    const [saveUser, { isLoading: isSaveLoading }] = useSaveUserMutation();
    const [restrictUser, { isLoading: isRestrictLoading }] = useRestrictUserMutation();
    const [blockUserCluster, { isLoading: isBlockClusterLoading }] = useBlockUserClusterMutation();
    const [addAbuseBlock, { isLoading: isBlockAddLoading }] = useAddAbuseBlockMutation();

    const [disabled, setDisabled] = useState(currentUser ? currentUser.disabled : false);
    const [verified, setVerified] = useState(currentUser ? currentUser.verified : false);

    const onFindClick = useCallback(() => {
        setSearchUsername(username);
    }, [username]);

    const onSaveClick = useCallback(async () => {
        let savedUser = { ...currentUser };

        savedUser.permissions = permissions;
        savedUser.disabled = disabled;
        savedUser.verified = verified;

        try {
            await saveUser(savedUser).unwrap();

            toast.success('User saved successfully.');
        } catch (err) {
            toast.error(err.message || 'An error occured saving the user. Please try again later.');
        }
    }, [currentUser, permissions, disabled, verified, saveUser]);

    const onClearClick = useCallback(() => {
        dispatch(sendClearUserSessions(currentUser.username));
    }, [currentUser, dispatch]);

    const onRestrictClick = useCallback(async () => {
        if (!currentUser) {
            return;
        }

        try {
            await restrictUser({
                username: currentUser.username,
                days: 7,
                reason: 'Restricted from user admin'
            }).unwrap();
            toast.success('User restricted successfully.');
        } catch (err) {
            toast.error(err.message || 'An error occured restricting the user.');
        }
    }, [currentUser, restrictUser]);

    const onBlockClusterClick = useCallback(async () => {
        if (!currentUser) {
            return;
        }

        try {
            await blockUserCluster({
                username: currentUser.username,
                reason: 'Blocked from user admin'
            }).unwrap();
            toast.success('User cluster blocked successfully.');
        } catch (err) {
            toast.error(err.message || 'An error occured blocking the user cluster.');
        }
    }, [blockUserCluster, currentUser]);

    const addCurrentSignalBlock = useCallback(
        async (scope, value) => {
            if (!value) {
                toast.error('No value available for that block.');
                return;
            }

            try {
                await addAbuseBlock({
                    scope,
                    value,
                    reason: `Manual ${scope} block from user admin`,
                    sourceUserId: currentUser?._id
                }).unwrap();
                toast.success(`${scope} block added successfully.`);
            } catch (err) {
                toast.error(err.message || 'An error occured adding the abuse block.');
            }
        },
        [addAbuseBlock, currentUser]
    );

    const onPermissionToggle = useCallback((field, value) => {
        setPermissions((prevPermissions) => ({
            ...prevPermissions,
            [field]: value
        }));
    }, []);

    const onLinkedUserClick = useCallback(
        (name) => {
            setSearchUsername(name);

            refetch();
        },
        [refetch]
    );
    const retPermissions = useMemo(
        () =>
            availablePermissions.map((permission) => (
                <Switch
                    key={permission.name}
                    name={'permissions.' + permission.name}
                    onValueChange={(value) => onPermissionToggle(permission.name, value)}
                    isSelected={permissions[permission.name]}
                >
                    {permission.label}
                </Switch>
            )),
        [onPermissionToggle, permissions]
    );

    const renderedUser = useMemo(() => {
        if (!currentUser) {
            return null;
        }

        return (
            <form className='form'>
                <div className='flex flex-col gap-2'>
                    <Panel title={`${currentUser.username} - User details`}>
                        <div className={'flex flex-col gap-2 md:flex-row'}>
                            <dl className='grid grid-cols-2'>
                                <dt className='font-bold'>Username</dt>
                                <dd>{currentUser.username}</dd>
                                <dt className='font-bold'>Email</dt>
                                <dd>{currentUser.email}</dd>
                                <dt className='font-bold'>Registered</dt>
                                <dd>{moment(currentUser.registered).format('YYYY-MM-DD HH:MM')}</dd>
                            </dl>
                            <div className='flex gap-2 md:flex-col'>
                                <Switch
                                    name='disabled'
                                    type='Switch'
                                    onValueChange={setDisabled}
                                    isSelected={disabled}
                                >
                                    Disabled
                                </Switch>
                                <Switch
                                    name='verified'
                                    onValueChange={setVerified}
                                    isSelected={verified}
                                >
                                    Verified
                                </Switch>
                            </div>
                        </div>
                    </Panel>
                    {abuseProfile && (
                        <Panel title='Abuse risk'>
                            <div className='flex flex-col gap-2'>
                                <dl className='grid grid-cols-2'>
                                    <dt className='font-bold'>Risk score</dt>
                                    <dd>{abuseProfile.riskScore}</dd>
                                    <dt className='font-bold'>Trust state</dt>
                                    <dd>{abuseProfile.trustState}</dd>
                                    <dt className='font-bold'>Restricted until</dt>
                                    <dd>
                                        {abuseProfile.restrictedUntil
                                            ? moment(abuseProfile.restrictedUntil).format(
                                                  'YYYY-MM-DD HH:mm'
                                              )
                                            : 'Not restricted'}
                                    </dd>
                                    <dt className='font-bold'>Flags</dt>
                                    <dd>
                                        {abuseProfile.riskFlags?.length
                                            ? abuseProfile.riskFlags.join(', ')
                                            : 'None'}
                                    </dd>
                                </dl>
                                <div className='flex flex-wrap gap-2'>
                                    <Button
                                        color='warning'
                                        isLoading={isRestrictLoading}
                                        onPress={onRestrictClick}
                                    >
                                        Restrict 7 days
                                    </Button>
                                    <Button
                                        color='danger'
                                        isLoading={isBlockClusterLoading}
                                        onPress={onBlockClusterClick}
                                    >
                                        Block Cluster
                                    </Button>
                                    <Button
                                        isLoading={isBlockAddLoading}
                                        onPress={() =>
                                            addCurrentSignalBlock(
                                                'ip',
                                                currentUser.lastLoginIp ||
                                                    currentUser.registerIpNormalized ||
                                                    currentUser.registerIp
                                            )
                                        }
                                    >
                                        Add Exact IP Block
                                    </Button>
                                    <Button
                                        isLoading={isBlockAddLoading}
                                        onPress={() =>
                                            addCurrentSignalBlock(
                                                'subnet',
                                                currentUser.lastLoginSubnet ||
                                                    currentUser.registerSubnet
                                            )
                                        }
                                    >
                                        Add Subnet Block
                                    </Button>
                                    <Button
                                        isLoading={isBlockAddLoading}
                                        onPress={() =>
                                            addCurrentSignalBlock(
                                                'fingerprint',
                                                currentUser.signupFingerprintHash
                                            )
                                        }
                                    >
                                        Add Fingerprint Block
                                    </Button>
                                </div>
                            </div>
                        </Panel>
                    )}
                    {abuseProfile?.linkedAccounts?.length > 0 && (
                        <Panel title='Possibly linked accounts'>
                            <Table isStriped aria-label='Linked Accounts Table'>
                                <TableHeader>
                                    <TableColumn>Username</TableColumn>
                                    <TableColumn>Evidence</TableColumn>
                                    <TableColumn>Status</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {(abuseProfile?.linkedAccounts || []).map((account) => {
                                        return (
                                            <TableRow key={account.username}>
                                                <TableCell>
                                                    <Link
                                                        className='cursor-pointer text-secondary-600'
                                                        onPress={() =>
                                                            onLinkedUserClick(account.username)
                                                        }
                                                    >
                                                        {account.username}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>{account.evidence.join(', ')}</TableCell>
                                                <TableCell>
                                                    {account.disabled
                                                        ? 'Disabled'
                                                        : account.trustState}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </Panel>
                    )}
                    {currentUser && currentUser.tokens && (
                        <Panel title='Sessions'>
                            <Table isStriped aria-label='Users Table'>
                                <TableHeader>
                                    <TableColumn>IP Address</TableColumn>
                                    <TableColumn>Last Used</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {currentUser.tokens.map((token, index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{token.ip}</TableCell>
                                                <TableCell>
                                                    {moment(token.lastUsed).format(
                                                        'YYYY-MM-DD HH:MM'
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </Panel>
                    )}
                    {user?.permissions.canManagePermissions ? (
                        <Panel title='Permissions'>
                            <div className='grid grid-cols-2 gap-1 md:grid-cols-3'>
                                {retPermissions}
                            </div>
                        </Panel>
                    ) : null}
                    <div>
                        <div className='flex gap-2'>
                            <Button color='primary' onPress={onClearClick}>
                                Clear sessions
                            </Button>
                            <Button isLoading={isSaveLoading} color='primary' onPress={onSaveClick}>
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        );
    }, [
        currentUser,
        abuseProfile,
        disabled,
        addCurrentSignalBlock,
        isBlockAddLoading,
        isBlockClusterLoading,
        isRestrictLoading,
        isSaveLoading,
        onBlockClusterClick,
        onClearClick,
        onLinkedUserClick,
        onRestrictClick,
        onSaveClick,
        retPermissions,
        user?.permissions.canManagePermissions,
        verified
    ]);

    useEffect(() => {
        if (error) {
            if (error.status === 404) {
                toast.error('User was not found.');
            } else {
                toast.error(error.message || 'An error occured loading the user.');
            }
        }
    }, [error]);

    useEffect(() => {
        if (data) {
            setCurrentUser(data.user);
            setPermissions({ ...defaultPermissions, ...data.user.permissions });
            setDisabled(data.user.disabled);
            setVerified(data.user.verified);
        }
    }, [data]);

    return (
        <Page>
            <Panel title='User administration'>
                <div className='flex flex-col md:flex-row gap-2 items-center'>
                    <Input
                        label='Username'
                        name='username'
                        onValueChange={setUsername}
                        value={username}
                        className='w-full md:w-1/3'
                    />
                    <Button
                        color='primary'
                        onPress={onFindClick}
                        isLoading={isLoading}
                        className='w-full md:w-auto'
                    >
                        Search
                    </Button>
                </div>
            </Panel>
            {renderedUser}
        </Page>
    );
};

export default UserAdmin;
