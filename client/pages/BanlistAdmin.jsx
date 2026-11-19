import React, { useMemo, useState } from 'react';
import moment from 'moment';
import { Button, Spinner, Table } from '@heroui/react';
import { toast } from 'react-toastify';

import Field from '../Components/Site/Field';
import Group from '../Components/Site/Group';
import LoadingSpinner from '../Components/Site/LoadingSpinner';
import Notice from '../Components/Site/Notice';
import SelectField from '../Components/Site/SelectField';
import {
    useAddAbuseBlockMutation,
    useGetAbuseBlocksQuery,
    useRemoveAbuseBlockMutation
} from '../redux/middleware/api';
import AdminPage from './AdminPage';

const Scopes = [
    {
        id: 'ip',
        label: 'IP address',
        placeholder: '203.0.113.7',
        effect: 'Stops sign-ups and logins from this address.'
    },
    {
        id: 'subnet',
        label: 'Subnet',
        placeholder: '203.0.113.0/24',
        effect: 'Raises the risk score of sign-ups from this range; it does not block on its own.'
    },
    {
        id: 'fingerprint',
        label: 'Browser fingerprint',
        placeholder: 'Fingerprint hash',
        effect: 'Stops sign-ups and logins from this browser.'
    },
    {
        id: 'email_domain',
        label: 'Email domain',
        placeholder: 'example.com',
        effect: 'Raises the risk score of sign-ups with this domain; it does not block on its own.'
    }
];

const Durations = [
    { id: 'never', label: 'Never', days: null },
    { id: '1', label: 'In 1 day', days: 1 },
    { id: '7', label: 'In 7 days', days: 7 },
    { id: '30', label: 'In 30 days', days: 30 },
    { id: '365', label: 'In a year', days: 365 }
];

const Views = [
    { id: 'active', label: 'Active' },
    { id: 'inactive', label: 'Ended' },
    { id: 'all', label: 'All' }
];

const blockState = (block) => {
    if (block.active === false) {
        return 'Deactivated';
    }

    if (block.expiresAt && moment(block.expiresAt).isBefore()) {
        return 'Expired';
    }

    return 'Active';
};

const scopeLabel = (scope) => Scopes.find((s) => s.id === scope)?.label ?? scope;

const BanlistAdmin = () => {
    const { data: abuseBlocks, isLoading, isError } = useGetAbuseBlocksQuery();
    const [addAbuseBlock, { isLoading: isAdding }] = useAddAbuseBlockMutation();
    const [removeAbuseBlock] = useRemoveAbuseBlockMutation();
    const [scope, setScope] = useState('ip');
    const [value, setValue] = useState('');
    const [reason, setReason] = useState('');
    const [duration, setDuration] = useState('never');
    const [view, setView] = useState('active');
    const [search, setSearch] = useState('');
    const [removingId, setRemovingId] = useState();

    const onAdd = async () => {
        const days = Durations.find((d) => d.id === duration)?.days;
        try {
            await addAbuseBlock({
                scope,
                value,
                reason,
                expiresAt: days ? moment().add(days, 'days').toISOString() : undefined
            }).unwrap();
            toast.success('Block added');
            setValue('');
            setReason('');
        } catch (err) {
            toast.error(err.data?.message || 'The block could not be added. Try again later.');
        }
    };

    const onDeactivate = async (id) => {
        setRemovingId(id);
        try {
            await removeAbuseBlock(id).unwrap();
            toast.success('Block deactivated');
        } catch (err) {
            toast.error(
                err.data?.message || 'The block could not be deactivated. Try again later.'
            );
        } finally {
            setRemovingId(undefined);
        }
    };

    const blocks = useMemo(() => {
        const term = search.trim().toLowerCase();

        return (abuseBlocks || []).filter((block) => {
            const isActive = blockState(block) === 'Active';
            if ((view === 'active' && !isActive) || (view === 'inactive' && isActive)) {
                return false;
            }

            return (
                !term ||
                [block.value || block.ip, block.reason, block.createdBy || block.user]
                    .filter(Boolean)
                    .some((field) => field.toLowerCase().includes(term))
            );
        });
    }, [abuseBlocks, search, view]);

    const activeCount = (abuseBlocks || []).filter((b) => blockState(b) === 'Active').length;

    let list;
    if (isLoading) {
        list = <LoadingSpinner className='py-10' />;
    } else if (isError) {
        list = <Notice kind='error'>The blocks couldn&apos;t be loaded.</Notice>;
    } else {
        list = (
            <Table variant='secondary'>
                <Table.ScrollContainer>
                    <Table.Content aria-label='Blocks'>
                        <Table.Header>
                            <Table.Column isRowHeader>Value</Table.Column>
                            <Table.Column>Type</Table.Column>
                            <Table.Column>Reason</Table.Column>
                            <Table.Column>Added</Table.Column>
                            <Table.Column>Ends</Table.Column>
                            <Table.Column>
                                <span className='sr-only'>Actions</span>
                            </Table.Column>
                        </Table.Header>
                        <Table.Body
                            renderEmptyState={() => (
                                <p className='py-6 text-center text-sm text-ink-dim'>
                                    {search ? 'No blocks match.' : 'No blocks here.'}
                                </p>
                            )}
                        >
                            {blocks.map((block) => {
                                const state = blockState(block);
                                const isActive = state === 'Active';

                                return (
                                    <Table.Row key={block._id} id={block._id}>
                                        <Table.Cell
                                            className={
                                                isActive
                                                    ? 'font-mono text-sm text-ink'
                                                    : 'font-mono text-sm text-ink-faint line-through'
                                            }
                                        >
                                            {block.value || block.ip}
                                        </Table.Cell>
                                        <Table.Cell className='whitespace-nowrap text-ink-dim'>
                                            {scopeLabel(block.scope)}
                                        </Table.Cell>
                                        <Table.Cell className='text-ink-dim'>
                                            {block.reason || (
                                                <span className='text-ink-faint'>None given</span>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell className='whitespace-nowrap text-sm text-ink-dim'>
                                            {moment(block.createdAt || block.added).format(
                                                'D MMM YYYY'
                                            )}
                                            <span className='block text-xs text-ink-faint'>
                                                {block.createdBy || block.user}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell className='whitespace-nowrap text-sm text-ink-dim'>
                                            {isActive
                                                ? block.expiresAt
                                                    ? moment(block.expiresAt).format('D MMM YYYY')
                                                    : 'Never'
                                                : state}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {isActive && (
                                                <div className='flex justify-end'>
                                                    <Button
                                                        size='sm'
                                                        variant='ghost'
                                                        className='text-danger'
                                                        isPending={removingId === block._id}
                                                        onPress={() => onDeactivate(block._id)}
                                                    >
                                                        {removingId === block._id && (
                                                            <Spinner color='current' size='sm' />
                                                        )}
                                                        Deactivate
                                                    </Button>
                                                </div>
                                            )}
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            })}
                        </Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>
        );
    }

    const { placeholder, effect } = Scopes.find((s) => s.id === scope) ?? {};

    return (
        <AdminPage
            section='banlist'
            title='Ban list'
            description={`Blocks on addresses, browsers and email domains that keep abusive accounts out. ${activeCount} active.`}
        >
            <Group title='Add a block' description={effect}>
                <form
                    className='grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-[12rem_minmax(0,1fr)_minmax(0,1.4fr)_10rem_auto]'
                    onSubmit={(event) => {
                        event.preventDefault();
                        onAdd();
                    }}
                >
                    <SelectField
                        label='Type'
                        value={scope}
                        onChange={(next) => next && setScope(next)}
                        items={Scopes}
                    />
                    <Field
                        label='Value'
                        value={value}
                        onValueChange={setValue}
                        placeholder={placeholder}
                        inputClassName='font-mono'
                    />
                    <Field
                        label='Reason'
                        value={reason}
                        onValueChange={setReason}
                        placeholder='Shown to other admins'
                    />
                    <SelectField
                        label='Ends'
                        value={duration}
                        onChange={(next) => next && setDuration(next)}
                        items={Durations}
                    />
                    <Button
                        type='submit'
                        variant='primary'
                        className='self-end'
                        isDisabled={!value.trim()}
                        isPending={isAdding}
                    >
                        {isAdding && <Spinner color='current' size='sm' />}
                        Add block
                    </Button>
                </form>
            </Group>
            <Group title='Blocks'>
                <div className='mb-3 flex flex-wrap items-center gap-3'>
                    <div role='group' aria-label='Show' className='flex gap-1.5'>
                        {Views.map((item) => (
                            <button
                                key={item.id}
                                type='button'
                                aria-pressed={view === item.id}
                                onClick={() => setView(item.id)}
                                className={
                                    view === item.id
                                        ? 'rounded-full border border-gold-line bg-gold/10 px-3 py-0.5 text-sm text-ink'
                                        : 'rounded-full border border-white/10 px-3 py-0.5 text-sm text-ink-faint hover:text-ink-dim'
                                }
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <Field
                        aria-label='Search blocks'
                        placeholder='Search values, reasons and admins'
                        value={search}
                        onValueChange={setSearch}
                        className='ms-auto w-full sm:w-72'
                    />
                </div>
                {list}
            </Group>
        </AdminPage>
    );
};

export default BanlistAdmin;
