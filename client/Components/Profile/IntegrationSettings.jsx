import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Button, Chip, Link } from '@heroui/react';
import { toast } from 'react-toastify';
import { useUnlinkPatreonMutation, useUpdateAvatarMutation } from '../../redux/middleware/api';
import { avatarUpdated, setUser } from '../../redux/reducers/auth';
import { PatreonStateKey } from '../../util';
import PatreonImage from '../../assets/img/Patreon_Mark_Coral.jpg';
import SettingsGroup from './SettingsGroup';
import SettingSwitch from './SettingSwitch';

const getPatreonLinkUrl = () => {
    const clientId = import.meta.env.VITE_PATREON_CLIENT_ID;
    if (!clientId) {
        return undefined;
    }

    // Ties the OAuth callback to this browser session so a link started elsewhere is rejected
    let state;
    try {
        state = window.sessionStorage.getItem(PatreonStateKey);
        if (!state) {
            state = Array.from(window.crypto.getRandomValues(new Uint8Array(16)), (byte) =>
                byte.toString(16).padStart(2, '0')
            ).join('');
            window.sessionStorage.setItem(PatreonStateKey, state);
        }
    } catch {
        return undefined;
    }

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        redirect_uri: `${window.location.origin}/patreon`,
        scope: 'identity identity.memberships',
        state
    });

    return `https://www.patreon.com/oauth2/authorize?${params.toString()}`;
};

const getPatreonState = (patreon) => {
    if (!patreon) {
        return undefined;
    }

    if (typeof patreon === 'string') {
        return {
            status: patreon,
            connected: ['linked', 'pledged'].includes(patreon),
            needsRelink: false
        };
    }

    return patreon;
};

const IntegrationSettings = ({ user, formProps }) => {
    const dispatch = useDispatch();
    const [unlinkPatreon, { isLoading: unlinkLoading }] = useUnlinkPatreonMutation();
    const [updateAvatar, { isLoading: avatarLoading }] = useUpdateAvatarMutation();
    const avatarVersion = useSelector((state) => state.auth.avatarVersion);

    const patreonLinkUrl = useMemo(() => getPatreonLinkUrl(), []);
    const patreonState = getPatreonState(user.patreon);
    const isPatreonLinked = ['linked', 'pledged', 'broken'].includes(patreonState?.status);
    const gravatarChanged = formProps.values.enableGravatar !== !!user.enableGravatar;

    const onUnlinkClick = useCallback(async () => {
        try {
            const response = await unlinkPatreon().unwrap();
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

    const onRefreshAvatarClick = useCallback(async () => {
        try {
            await updateAvatar(user.username).unwrap();
            dispatch(avatarUpdated());
            toast.success('Avatar updated successfully');
        } catch (err) {
            toast.error(
                err.message || 'An error occured updating your avatar. Please try again later.'
            );
        }
    }, [dispatch, updateAvatar, user.username]);

    let avatarHint = 'Changed your picture on Gravatar? Refresh to pick it up here.';
    if (gravatarChanged) {
        avatarHint = 'Save your changes to update your avatar.';
    } else if (!user.enableGravatar) {
        avatarHint = 'You are using the default avatar.';
    }

    return (
        <>
            <SettingsGroup
                title='Avatar'
                description={
                    <>
                        Your avatar comes from the{' '}
                        <Link href='https://gravatar.com/' size='sm' isExternal>
                            Gravatar
                        </Link>{' '}
                        account for the email address on your profile.
                    </>
                }
            >
                <SettingSwitch
                    label='Use my Gravatar'
                    description='Otherwise you get the default avatar.'
                    isSelected={formProps.values.enableGravatar}
                    onValueChange={(isSelected) =>
                        formProps.setFieldValue('enableGravatar', isSelected)
                    }
                />
                <div className='flex flex-wrap items-center gap-3 px-3 py-2.5'>
                    <Avatar
                        src={`/img/avatar/${user.username}.png?v=${avatarVersion}`}
                        showFallback
                    />
                    <span className='min-w-48 flex-1 text-small text-default-500'>
                        {avatarHint}
                    </span>
                    <Button
                        size='sm'
                        variant='flat'
                        isLoading={avatarLoading}
                        isDisabled={!user.enableGravatar || gravatarChanged}
                        onPress={onRefreshAvatarClick}
                    >
                        Refresh avatar
                    </Button>
                </div>
            </SettingsGroup>
            <SettingsGroup
                title='Patreon'
                description={
                    <>
                        Link your{' '}
                        <Link href='https://www.patreon.com/' size='sm' isExternal>
                            Patreon
                        </Link>{' '}
                        account to receive supporter benefits on this site. Thank you for your
                        support! Linking and unlinking happen straight away.
                    </>
                }
            >
                <div className='flex flex-wrap items-center gap-3 px-3 py-2.5'>
                    <img src={PatreonImage} alt='' className='h-8 rounded-small' />
                    <div className='flex min-w-48 flex-1 flex-col gap-1'>
                        <span>
                            {isPatreonLinked ? (
                                <Chip
                                    size='sm'
                                    variant='flat'
                                    color={patreonState?.needsRelink ? 'warning' : 'success'}
                                >
                                    {patreonState?.needsRelink ? 'Link expired' : 'Linked'}
                                </Chip>
                            ) : (
                                <Chip size='sm' variant='flat'>
                                    Not linked
                                </Chip>
                            )}
                        </span>
                        {patreonState?.needsRelink && (
                            <span className='text-small text-warning'>
                                {patreonState.message ||
                                    'Your Patreon link has expired. Please relink your account.'}
                            </span>
                        )}
                    </div>
                    <div className='flex flex-wrap gap-2'>
                        {(!isPatreonLinked || patreonState?.needsRelink) && (
                            <Button
                                size='sm'
                                color={isPatreonLinked ? 'warning' : 'default'}
                                variant='flat'
                                href={patreonLinkUrl}
                                as={Link}
                                isDisabled={!patreonLinkUrl}
                            >
                                {isPatreonLinked ? 'Relink' : 'Link Patreon account'}
                            </Button>
                        )}
                        {isPatreonLinked && (
                            <Button
                                size='sm'
                                variant='flat'
                                isLoading={unlinkLoading}
                                onPress={onUnlinkClick}
                            >
                                Unlink
                            </Button>
                        )}
                    </div>
                </div>
            </SettingsGroup>
        </>
    );
};

export default IntegrationSettings;
