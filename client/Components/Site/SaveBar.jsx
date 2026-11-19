import React from 'react';
import { Button, Spinner } from '@heroui/react';
import classNames from 'classnames';

const statusClassNames = {
    quiet: 'text-ink-faint',
    warning: 'text-warning',
    danger: 'text-danger'
};

const SaveBar = ({ status, tone = 'quiet', isDirty, isSaving, onDiscard, form }) => (
    <div className='flex flex-wrap items-center justify-end gap-x-3 gap-y-2'>
        <span
            aria-live='polite'
            className={classNames('w-full text-sm sm:mr-auto sm:w-auto', statusClassNames[tone])}
        >
            {status}
        </span>
        <Button isDisabled={!isDirty || isSaving} onPress={onDiscard} variant='tertiary'>
            Discard
        </Button>
        <Button
            type='submit'
            form={form}
            isDisabled={!isDirty}
            isPending={isSaving}
            variant='primary'
        >
            {isSaving && <Spinner color='current' size='sm' />}Save changes
        </Button>
    </div>
);

export default SaveBar;
