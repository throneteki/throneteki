import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import Panel from '../Site/Panel';
import { useUnlinkPatreonMutation, useUpdateAvatarMutation } from '../../redux/middleware/api';
import { setUser } from '../../redux/reducers/auth';

import PatreonImage from '../../assets/img/Patreon_Mark_Coral.jpg';

import { Avatar, Button, Input, Link, Switch } from '@heroui/react';
import { toast } from 'react-toastify';

const ProfileMain = ({ user, formProps }) => {
    const dispatch = useDispatch();
    const [unlinkPatreon, { isLoading: unlinkLoading }] = useUnlinkPatreonMutation();
    const [updateAvatar, { isLoading: avatarLoading }] = useUpdateAvatarMutation();

    const onUnlinkClick = useCallback(async () => {
        try {
            let response = await unlinkPatreon().unwrap();
            if (response?.user) {
                dispatch(setUser(response.user));
            }
            toast.success('Patreon unlinked successfully');
        } catch (err) {
            toast.error(
                err.message || 'An error occured unlinking from Patreon. Please try again later.'
            );
        }
    }, [dispatch, unlinkPatreon]);

    const onUpdateAvatarClick = useCallback(async () => {
        try {
            await updateAvatar(user.username).unwrap();
            toast.success('Avatar updated successfully');
        } catch (err) {
            toast.error(
                err.message || 'An error occured updating your avatar Please try again later.'
            );
        }
    }, [updateAvatar, user?.username]);

    const callbackUrl = useMemo(() => `${window.location.origin}/patreon`, []);

    const patreonState = useMemo(() => {
        if (!user?.patreon) {
            return undefined;
        }

        if (typeof user.patreon === 'string') {
            return {
                status: user.patreon,
                connected: ['linked', 'pledged'].includes(user.patreon),
                needsRelink: false
            };
        }

        return user.patreon;
    }, [user]);

    const patreonLinkUrl = useMemo(() => {
        const clientId = import.meta.env.VITE_PATREON_CLIENT_ID;
        if (!clientId) {
            return undefined;
        }

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: clientId,
            redirect_uri: callbackUrl,
            scope: 'identity identity.memberships'
        });

        return `https://www.patreon.com/oauth2/authorize?${params.toString()}`;
    }, [callbackUrl]);

    const isPatreonLinked = useMemo(() => {
        return ['linked', 'pledged', 'broken'].includes(patreonState?.status);
    }, [patreonState]);

    return (
        <Panel title={`${user.username}'s Profile`}>
            <div className='flex flex-col gap-2'>
                <div className='flex flex-col sm:flex-row gap-2'>
                    <Input
                        {...formProps.getFieldProps('email')}
                        label='Email'
                        isInvalid={formProps.errors.email && formProps.touched.email}
                        errorMessage={formProps.errors.email}
                    />
                    <Input
                        label='Password'
                        {...formProps.getFieldProps('password')}
                        isInvalid={formProps.errors.password && formProps.touched.password}
                        errorMessage={formProps.errors.password}
                        type='password'
                    />
                    <Input
                        label='Password (again)'
                        {...formProps.getFieldProps('passwordAgain')}
                        isInvalid={
                            formProps.errors.passwordAgain && formProps.touched.passwordAgain
                        }
                        errorMessage={formProps.errors.passwordAgain}
                        type='password'
                    />
                </div>
                <div className='flex flex-col md:flex-row gap-2'>
                    <div className='flex flex-col gap-1 w-full md:w-1/2'>
                        <label className='font-bold'>Avatar</label>
                        <p className='text-sm'>
                            You can update your avatar on this website through your{' '}
                            <Link href='https://gravatar.com/' size='sm'>
                                Gravatar
                            </Link>{' '}
                            account. Please ensure your email for Gravatar matches the above email.
                        </p>
                        <div className='flex flex-wrap gap-2 items-center'>
                            <Avatar src={`/img/avatar/${user.username}.png`} showFallback />
                            <Button
                                isLoading={avatarLoading}
                                type='button'
                                color='default'
                                isDisabled={!formProps.values.enableGravatar}
                                onPress={onUpdateAvatarClick}
                            >
                                Update avatar
                            </Button>
                            <Switch
                                {...formProps.getFieldProps('enableGravatar')}
                                isSelected={formProps.values.enableGravatar}
                            >
                                Enable Gravatar
                            </Switch>
                        </div>
                    </div>
                    <div className='flex flex-col gap-1 w-full md:w-1/2'>
                        <label className='font-bold'>Patreon</label>
                        <p className='text-sm'>
                            You can link your{' '}
                            <Link href='https://www.patreon.com/' size='sm'>
                                Patreon
                            </Link>{' '}
                            account to recieve certain benefits on this website. Thank you for your
                            support!
                        </p>
                        {patreonState?.needsRelink && (
                            <p className='text-sm text-warning'>
                                {patreonState.message ||
                                    'Your Patreon link has expired. Please relink your account.'}
                            </p>
                        )}
                        <div>
                            {!isPatreonLinked ? (
                                <Button
                                    color='default'
                                    href={patreonLinkUrl}
                                    as={Link}
                                    isDisabled={!patreonLinkUrl}
                                >
                                    <img src={PatreonImage} className='h-7' />
                                    Link Patreon account
                                </Button>
                            ) : patreonState?.needsRelink ? (
                                <div className='flex flex-wrap gap-2'>
                                    <Button
                                        color='default'
                                        href={patreonLinkUrl}
                                        as={Link}
                                        isDisabled={!patreonLinkUrl}
                                    >
                                        Relink Patreon account
                                    </Button>
                                    <Button
                                        isLoading={unlinkLoading}
                                        color='default'
                                        onPress={onUnlinkClick}
                                    >
                                        Unlink Patreon account
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    isLoading={unlinkLoading}
                                    color='default'
                                    onPress={onUnlinkClick}
                                >
                                    Unlink Patreon account
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Panel>
    );
};

export default ProfileMain;
