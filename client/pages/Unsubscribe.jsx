import React from 'react';
import { Button, Spinner } from '@heroui/react';

import Frame from '../Components/Site/Frame';
import Notice from '../Components/Site/Notice';
import { useUnsubscribeMutation } from '../redux/middleware/api';
import Page from './Page';

// Reached from the link in an email. Asks before unsubscribing, as link checkers open links in emails.
const Unsubscribe = ({ id, token }) => {
    const [unsubscribe, { isLoading, isSuccess, error }] = useUnsubscribeMutation();

    let content;
    if (!id || !token) {
        content = <Notice kind='error'>This unsubscribe link is not valid.</Notice>;
    } else if (isSuccess) {
        content = (
            <Notice kind='success'>
                You won&apos;t get any more emails like this. You can turn them back on in your
                profile.
            </Notice>
        );
    } else {
        content = (
            <div className='flex flex-col gap-4'>
                {error && (
                    <Notice kind='error'>
                        {(typeof error === 'string' ? error : error.data?.message) ||
                            'Something went wrong. Please try again.'}
                    </Notice>
                )}
                <p className='text-ink-dim'>
                    Stop occasional emails, such as your yearly page in the White Book? Emails about
                    your account, like password resets, will still be sent.
                </p>
                <Button
                    className='w-full'
                    isPending={isLoading}
                    onPress={() => unsubscribe({ id, token })}
                    variant='primary'
                >
                    {isLoading && <Spinner color='current' size='sm' />}Stop these emails
                </Button>
            </div>
        );
    }

    return (
        <Page size='narrow'>
            <Frame title='Unsubscribe'>{content}</Frame>
        </Page>
    );
};

export default Unsubscribe;
