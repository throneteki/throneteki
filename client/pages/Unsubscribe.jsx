import React from 'react';
import { Button } from '@heroui/react';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import { useUnsubscribeMutation } from '../redux/middleware/api';
import Page from './Page';

// Reached from the link in an email. Asks before unsubscribing, as link checkers open links in emails.
const Unsubscribe = ({ id, token }) => {
    const [unsubscribe, { isLoading, isSuccess, error }] = useUnsubscribeMutation();

    let content;
    if (!id || !token) {
        content = <AlertPanel variant='danger' message='This unsubscribe link is not valid' />;
    } else if (isSuccess) {
        content = (
            <AlertPanel
                variant='success'
                message="You won't get any more emails like this. You can turn them back on in your profile."
            />
        );
    } else {
        content = (
            <div className='flex flex-col items-center gap-3 py-2 text-center'>
                {error && (
                    <AlertPanel
                        variant='danger'
                        message={
                            (typeof error === 'string' ? error : error.data?.message) ||
                            'Something went wrong. Please try again.'
                        }
                    />
                )}
                <p className='m-0 leading-5'>
                    Stop occasional emails, such as your yearly page in the White Book? Emails about
                    your account, like password resets, will still be sent.
                </p>
                <Button
                    color='primary'
                    isLoading={isLoading}
                    onPress={() => unsubscribe({ id, token })}
                >
                    Stop these emails
                </Button>
            </div>
        );
    }

    return (
        <Page size='small'>
            <Panel title='Unsubscribe'>{content}</Panel>
        </Page>
    );
};

export default Unsubscribe;
