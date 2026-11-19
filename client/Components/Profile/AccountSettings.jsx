import React from 'react';
import Field from '../Site/Field';
import Group from '../Site/Group';
import SettingSwitch from '../Site/SettingSwitch';

export const isEmailChanged = (email, currentEmail) =>
    (email || '').trim().toLowerCase() !== (currentEmail || '').trim().toLowerCase();

const AccountSettings = ({ user, formProps }) => {
    const { values, errors, touched, getFieldProps, setFieldValue } = formProps;
    const fieldError = (name) => (touched[name] && errors[name]) || undefined;
    const needsCurrentPassword = !!values.password || isEmailChanged(values.email, user.email);

    return (
        <>
            <Group title='Email'>
                <div className='flex flex-col gap-4'>
                    <Field
                        {...getFieldProps('email')}
                        type='email'
                        label='Email address'
                        autoComplete='email'
                        className='sm:max-w-md'
                        isInvalid={!!fieldError('email')}
                        errorMessage={fieldError('email')}
                    />
                    <div>
                        <SettingSwitch
                            label='Email me occasional updates'
                            hint='Such as my yearly page in the White Book.'
                            isSelected={values.emailUpdates}
                            onValueChange={(isSelected) =>
                                setFieldValue('emailUpdates', isSelected)
                            }
                        />
                    </div>
                </div>
            </Group>
            <Group
                title='Change password'
                description='Leave these blank to keep your current password.'
            >
                <div className='grid gap-4 sm:grid-cols-2'>
                    <Field
                        {...getFieldProps('password')}
                        type='password'
                        label='New password'
                        autoComplete='new-password'
                        isInvalid={!!fieldError('password')}
                        errorMessage={fieldError('password')}
                    />
                    <Field
                        {...getFieldProps('passwordAgain')}
                        type='password'
                        label='New password (again)'
                        autoComplete='new-password'
                        isInvalid={!!fieldError('passwordAgain')}
                        errorMessage={fieldError('passwordAgain')}
                    />
                </div>
            </Group>
            {needsCurrentPassword && (
                <Group
                    title='Current password'
                    description='Enter your current password to save a new email address or password.'
                >
                    <Field
                        {...getFieldProps('currentPassword')}
                        type='password'
                        label='Current password'
                        autoComplete='current-password'
                        className='sm:max-w-sm'
                        isInvalid={!!fieldError('currentPassword')}
                        errorMessage={fieldError('currentPassword')}
                    />
                </Group>
            )}
        </>
    );
};

export default AccountSettings;
