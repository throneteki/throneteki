import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import Form from '../Components/Form/Form';
import Checkbox from '../Components/Form/Checkbox';
import Panel from '../Components/Site/Panel';
import { useGetUserQuery, useSaveUserMutation } from '../redux/middleware/api';
import AlertPanel from '../Components/Site/AlertPanel';
import { sendClearUserSessions } from '../redux/reducers/lobby';

const defaultPermissions = {
    canEditNews: false,
    canManageUsers: false,
    canManagePermissions: false,
    canManageGames: false,
    canManageNodes: false,
    canModerateChat: false,
    canManageMotd: false,
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

    const { data, isLoading, error, refetch } = useGetUserQuery(searchUsername, {
        skip: !searchUsername
    });
    const [saveUser, { isLoading: isSaveLoading }] = useSaveUserMutation();

    const [disabled, setDisabled] = useState(currentUser ? currentUser.disabled : false);
    const [verified, setVerified] = useState(currentUser ? currentUser.verified : false);
    const [successMessage, setSuccessMessage] = useState(undefined);
    const [errorMessage, setErrorMessage] = useState(undefined);

    const onFindClick = useCallback((state) => {
        setSearchUsername(state.username);
    }, []);

    const onSaveClick = useCallback(
        async (event) => {
            setSuccessMessage();

            event.preventDefault();

            let savedUser = { ...currentUser };

            savedUser.permissions = permissions;
            savedUser.disabled = disabled;
            savedUser.verified = verified;

            try {
                await saveUser(savedUser).unwrap();

                setSuccessMessage('User saved successfully.');

                setTimeout(() => {
                    setSuccessMessage();
                }, 5000);
            } catch (err) {
                setErrorMessage(err || 'An error occured saving the user. Please try again later.');
            }
        },
        [currentUser, permissions, disabled, verified, saveUser]
    );

    const onClearClick = useCallback(
        (event) => {
            event.preventDefault();

            dispatch(sendClearUserSessions(currentUser.username));
        },
        [currentUser, dispatch]
    );

    const onPermissionToggle = useCallback((field, event) => {
        setPermissions((prevPermissions) => ({
            ...prevPermissions,
            [field]: event.target.checked
        }));
    }, []);

    const onDisabledChanged = useCallback((event) => {
        setDisabled(event.target.checked);
    }, []);

    const onVerifiedChanged = useCallback((event) => {
        setVerified(event.target.checked);
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
                <Checkbox
                    key={permission.name}
                    name={'permissions.' + permission.name}
                    label={permission.label}
                    fieldClass='col-xs-4'
                    type='checkbox'
                    onChange={(event) => onPermissionToggle(permission.name, event)}
                    checked={permissions[permission.name]}
                />
            )),
        [onPermissionToggle, permissions]
    );

    const renderedUser = useMemo(() => {
        if (!currentUser) {
            return null;
        }

        return (
            <div>
                <form className='form'>
                    <Panel title={`${currentUser.username} - User details`}>
                        <dl className='dl-horizontal'>
                            <dt>Username:</dt>
                            <dd>{currentUser.username}</dd>
                            <dt>Email:</dt>
                            <dd>{currentUser.email}</dd>
                            <dt>Registered:</dt>
                            <dd>{moment(currentUser.registered).format('YYYY-MM-DD HH:MM')}</dd>
                        </dl>

                        <Checkbox
                            name={'disabled'}
                            label='Disabled'
                            fieldClass='col-xs-4'
                            type='checkbox'
                            onChange={onDisabledChanged}
                            checked={disabled}
                        />
                        <Checkbox
                            name={'verified'}
                            label='Verified'
                            fieldClass='col-xs-4'
                            type='checkbox'
                            onChange={onVerifiedChanged}
                            checked={verified}
                        />
                    </Panel>
                    {data?.linkedAccounts && (
                        <Panel title='Possibly linked accounts'>
                            <ul className='list'>
                                {data.linkedAccounts.map((name) => {
                                    return (
                                        <li key={name}>
                                            <a onClick={() => onLinkedUserClick(name)}>{name}</a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </Panel>
                    )}
                    {currentUser && currentUser.tokens && (
                        <Panel title='Sessions'>
                            <table className='table table-striped'>
                                <thead>
                                    <tr>
                                        <th>IP Address</th>
                                        <th>Last Used</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUser.tokens.map((token, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{token.ip}</td>
                                                <td>
                                                    {moment(token.lastUsed).format(
                                                        'YYYY-MM-DD HH:MM'
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </Panel>
                    )}
                    {user?.permissions.canManagePermissions ? (
                        <Panel title='Permissions'>
                            <div>{retPermissions}</div>
                        </Panel>
                    ) : null}
                    <button
                        type='button'
                        className='btn btn-primary col-xs-3'
                        onClick={onClearClick}
                    >
                        Clear sessions
                    </button>
                    <button
                        type='button'
                        className='btn btn-primary col-xs-3'
                        onClick={onSaveClick}
                    >
                        Save {isSaveLoading && <span className='spinner button-spinner' />}
                    </button>
                </form>
            </div>
        );
    }, [
        currentUser,
        data?.linkedAccounts,
        disabled,
        isSaveLoading,
        onClearClick,
        onDisabledChanged,
        onLinkedUserClick,
        onSaveClick,
        onVerifiedChanged,
        retPermissions,
        user?.permissions.canManagePermissions,
        verified
    ]);

    useEffect(() => {
        if (error) {
            if (error.status === 404) {
                setErrorMessage('User was not found.');
            } else {
                setErrorMessage(error.data?.message || 'An error occured loading the user.');
            }
        }
    }, [error]);

    useEffect(() => {
        if (data) {
            setCurrentUser(data.user);
            setPermissions(data.user.permissions);
            setDisabled(data.user.disabled);
            setVerified(data.user.verified);
        }
    }, [data]);

    return (
        <div className='col-sm-offset-2 col-sm-8'>
            <Panel title='User administration'>
                {errorMessage && <AlertPanel type='error' message={errorMessage} />}
                {successMessage && <AlertPanel type='success' message={successMessage} />}
                <Form
                    name='userAdmin'
                    apiLoading={isLoading}
                    buttonClass='col-sm-offset-4 col-sm-3'
                    buttonText='Search'
                    onSubmit={onFindClick}
                />
            </Panel>
            {renderedUser}
        </div>
    );
};

export default UserAdmin;
