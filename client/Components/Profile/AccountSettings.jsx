import React from 'react';
import { Input } from '@heroui/react';
import SettingsGroup from './SettingsGroup';
import SettingSwitch from './SettingSwitch';

export const isEmailChanged = (email, currentEmail) =>
    (email || '').trim().toLowerCase() !== (currentEmail || '').trim().toLowerCase();

const AccountSettings = ({ user, formProps }) => {
    const { values, errors, touched, getFieldProps, setFieldValue } = formProps;
    const fieldError = (name) => (touched[name] && errors[name]) || undefined;
    const needsCurrentPassword = !!values.password || isEmailChanged(values.email, user.email);

    return (
        <>
            <SettingsGroup title='Email'>
                <div className='p-3'>
                    <Input
                        {...getFieldProps('email')}
                        type='email'
                        label='Email address'
                        autoComplete='email'
                        isInvalid={!!fieldError('email')}
                        errorMessage={fieldError('email')}
                    />
                </div>
                <SettingSwitch
                    label='Email me occasional updates'
                    description='Such as my yearly page in the White Book.'
                    isSelected={values.emailUpdates}
                    onValueChange={(isSelected) => setFieldValue('emailUpdates', isSelected)}
                />
            </SettingsGroup>
            <SettingsGroup
                title='Change password'
                description='Leave these blank to keep your current password.'
            >
                <div className='grid gap-3 p-3 sm:grid-cols-2'>
                    <Input
                        {...getFieldProps('password')}
                        type='password'
                        label='New password'
                        autoComplete='new-password'
                        isInvalid={!!fieldError('password')}
                        errorMessage={fieldError('password')}
                    />
                    <Input
                        {...getFieldProps('passwordAgain')}
                        type='password'
                        label='New password (again)'
                        autoComplete='new-password'
                        isInvalid={!!fieldError('passwordAgain')}
                        errorMessage={fieldError('passwordAgain')}
                    />
                </div>
            </SettingsGroup>
            {needsCurrentPassword && (
                <SettingsGroup
                    title='Current password'
                    description='Enter your current password to save a new email address or password.'
                >
                    <div className='p-3 sm:max-w-sm'>
                        <Input
                            {...getFieldProps('currentPassword')}
                            type='password'
                            label='Current password'
                            autoComplete='current-password'
                            isInvalid={!!fieldError('currentPassword')}
                            errorMessage={fieldError('currentPassword')}
                        />
                    </div>
                </SettingsGroup>
            )}
        </>
    );
};

export default AccountSettings;
