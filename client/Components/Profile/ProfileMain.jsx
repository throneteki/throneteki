import React, { useCallback, useMemo } from 'react';
import Panel from '../Site/Panel';
import { useUnlinkPatreonMutation, useUpdateAvatarMutation } from '../../redux/middleware/api';

import PatreonImage from '../../assets/img/Patreon_Mark_Coral.jpg';

import { Avatar, Button, Input, Link, Switch } from '@nextui-org/react';
import { toast } from 'react-toastify';

const ProfileMain = ({ user, formProps }) => {
    const [unlinkPatreon, { isLoading: unlinkLoading }] = useUnlinkPatreonMutation();
    const [updateAvatar, { isLoading: avatarLoading }] = useUpdateAvatarMutation();

    const onUnlinkClick = useCallback(async () => {
        try {
            await unlinkPatreon().unwrap();
            toast.success('Patreon unlinked successfully');
        } catch (err) {
            toast.error(
                err.message || 'An error occured unlinking from Patreon. Please try again later.'
            );
        }
    }, [unlinkPatreon]);

    const onUpdateAvatarClick = useCallback(
        async (event) => {
            event.preventDefault();

            try {
                await updateAvatar(user.username).unwrap();
                toast.success('Avatar updated successfully');
            } catch (err) {
                toast.error(
                    err.message || 'An error occured updating your avatar Please try again later.'
                );
            }
        },
        [updateAvatar, user?.username]
    );

    const callbackUrl =
        import.meta.env.MODE === 'production'
            ? 'https://theironthrone.net/patreon'
            : 'http://localhost:4000/patreon';

    const isPatreonLinked = useMemo(() => {
        return user && ['linked', 'pledged'].includes(user.patreon);
    }, [user]);

    return (
        <Panel title='Profile'>
            <div className='md:flex'>
                <Input
                    {...formProps.getFieldProps('email')}
                    label='Email'
                    isInvalid={formProps.errors.email && formProps.touched.email}
                    errorMessage={formProps.errors.email}
                />
                <Input
                    className='md:ml-2 mt-2 md:mt-0'
                    label='Password'
                    {...formProps.getFieldProps('password')}
                    isInvalid={formProps.errors.password && formProps.touched.password}
                    errorMessage={formProps.errors.password}
                    type='password'
                />
                <Input
                    className='md:ml-2 mt-2 md:mt-0'
                    label='Password (again)'
                    {...formProps.getFieldProps('passwordAgain')}
                    isInvalid={formProps.errors.passwordAgain && formProps.touched.passwordAgain}
                    errorMessage={formProps.errors.passwordAgain}
                    type='password'
                />
            </div>
            <div className='mt-2'>
                <div className='flex gap-2 flex-col lg:grid lg:grid-cols-3 lg:items-center'>
                    <div>
                        <span className='font-bold'>Avatar</span>
                        <div className='flex'>
                            <Avatar src={`/img/avatar/${user.username}.png`} showFallback />
                            <Button
                                isLoading={avatarLoading}
                                type='button'
                                className='ml-2'
                                color='secondary'
                                onClick={onUpdateAvatarClick}
                            >
                                Update avatar
                            </Button>
                        </div>
                    </div>

                    <div>
                        <Switch
                            className='md:ml-2 mt-2 md:mt-0'
                            {...formProps.getFieldProps('enableGravatar')}
                            isSelected={formProps.values.enableGravatar}
                        >
                            Enable Gravatar integration
                        </Switch>
                    </div>
                    <div>
                        <span className='font-bold'>Patreon</span>
                        <div>
                            {!isPatreonLinked ? (
                                <Button
                                    color='secondary'
                                    href={`https://www.patreon.com/oauth2/authorize?response_type=code&client_id=317bxGpXD7sAOlyFKp6D-LOBRX731lLK-2YYQSFfBmJCrVSiJI77eUgRoLoN2KoI&redirect_uri=${callbackUrl}`}
                                    as={Link}
                                >
                                    <img src={PatreonImage} className='h-7' />
                                    Link Patreon account
                                </Button>
                            ) : (
                                <Button
                                    isLoading={unlinkLoading}
                                    color='secondary'
                                    onClick={onUnlinkClick}
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
