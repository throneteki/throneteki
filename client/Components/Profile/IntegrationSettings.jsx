import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, buttonVariants, Chip, Link, Spinner } from '@heroui/react';
import UserAvatar from '../Site/UserAvatar';
import { toast } from 'react-toastify';
import { useUnlinkPatreonMutation, useUpdateAvatarMutation } from '../../redux/middleware/api';
import { avatarUpdated, setUser } from '../../redux/reducers/auth';
import { getOAuthState, PatreonStateKey } from '../../util';
import PatreonImage from '../../assets/img/Patreon_Mark_Coral.jpg';
import Group from '../Site/Group';
import SettingSwitch from '../Site/SettingSwitch';

const getPatreonLinkUrl = () => {
    const clientId = import.meta.env.VITE_PATREON_CLIENT_ID;
    if (!clientId) {
        return undefined;
    }

    const state = getOAuthState(PatreonStateKey);
    if (!state) {
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
                err.data?.message ||
                    err.message ||
                    'An error occured unlinking from Patreon. Please try again later.'
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
                err.data?.message ||
                    err.message ||
                    'An error occured updating your avatar. Please try again later.'
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
            <Group
                title='Avatar'
                description={
                    <>
                        Your avatar comes from the{' '}
                        <Link
                            href='https://gravatar.com/'
                            className='text-gold'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            Gravatar
                        </Link>{' '}
                        account for the email address on your profile.
                    </>
                }
            >
                <SettingSwitch
                    label='Use my Gravatar'
                    hint='Otherwise you get the default avatar.'
                    isSelected={formProps.values.enableGravatar}
                    onValueChange={(isSelected) =>
                        formProps.setFieldValue('enableGravatar', isSelected)
                    }
                />
                <div className='flex flex-wrap items-center gap-3 border-b border-gold-hair px-0.5 py-3'>
                    <UserAvatar username={user.username} version={avatarVersion} />
                    <span className='min-w-48 flex-1 text-sm text-ink-faint'>{avatarHint}</span>
                    <Button
                        size='sm'
                        isPending={avatarLoading}
                        isDisabled={!user.enableGravatar || gravatarChanged}
                        onPress={onRefreshAvatarClick}
                        variant='tertiary'
                    >
                        {avatarLoading && <Spinner color='current' size='sm' />}Refresh avatar
                    </Button>
                </div>
            </Group>
            <Group
                title='Patreon'
                description={
                    <>
                        Link your{' '}
                        <Link
                            href='https://www.patreon.com/'
                            className='text-gold'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            Patreon
                        </Link>{' '}
                        account to receive supporter benefits on this site. Thank you for your
                        support! Linking and unlinking happen straight away.
                    </>
                }
            >
                <div className='flex flex-wrap items-center gap-3 border-y border-gold-hair px-0.5 py-3'>
                    <img src={PatreonImage} alt='' className='h-8 rounded-sm' />
                    <div className='flex min-w-48 flex-1 flex-col gap-1'>
                        <span>
                            {isPatreonLinked ? (
                                <Chip
                                    size='sm'
                                    variant='soft'
                                    color={patreonState?.needsRelink ? 'warning' : 'success'}
                                >
                                    {patreonState?.needsRelink ? 'Link expired' : 'Linked'}
                                </Chip>
                            ) : (
                                <Chip size='sm' variant='soft'>
                                    Not linked
                                </Chip>
                            )}
                        </span>
                        {patreonState?.needsRelink && (
                            <span className='text-sm text-warning'>
                                {patreonState.message ||
                                    'Your Patreon link has expired. Please relink your account.'}
                            </span>
                        )}
                    </div>
                    <div className='flex flex-wrap gap-2'>
                        {(!isPatreonLinked || patreonState?.needsRelink) && (
                            <a
                                href={patreonLinkUrl}
                                aria-disabled={!patreonLinkUrl || undefined}
                                className={buttonVariants({
                                    size: 'sm',
                                    variant: isPatreonLinked ? 'primary' : 'tertiary'
                                })}
                            >
                                {isPatreonLinked ? 'Relink' : 'Link Patreon account'}
                            </a>
                        )}
                        {isPatreonLinked && (
                            <Button
                                size='sm'
                                isPending={unlinkLoading}
                                onPress={onUnlinkClick}
                                variant='tertiary'
                            >
                                {unlinkLoading && <Spinner color='current' size='sm' />}Unlink
                            </Button>
                        )}
                    </div>
                </div>
            </Group>
        </>
    );
};

export default IntegrationSettings;
