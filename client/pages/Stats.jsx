import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import MonthlyStats from '../Components/Stats/MonthlyStats';
import { useGetMonthlyStatsQuery } from '../redux/middleware/api';
import Page from './Page';

const monthName = (value) =>
    new Date(`${value}-01T00:00:00Z`).toLocaleDateString(undefined, {
        timeZone: 'UTC',
        month: 'long',
        year: 'numeric'
    });

const Stats = () => {
    const user = useSelector((state) => state.auth.user);
    // Undefined asks the server for the latest month with games
    const [month, setMonth] = useState(undefined);
    const { data, error, isFetching } = useGetMonthlyStatsQuery(month, { skip: !user });

    if (!user) {
        return (
            <AlertPanel variant='danger' message='You need to be logged in to view your stats' />
        );
    }

    const months = data?.months || [];
    const shownMonth = data?.month;
    const index = months.indexOf(shownMonth);
    // Months are newest first
    const newer = index > 0 ? months[index - 1] : undefined;
    const older = index >= 0 && index < months.length - 1 ? months[index + 1] : undefined;

    let content;
    if (error) {
        content = (
            <AlertPanel
                variant='danger'
                message={
                    (typeof error === 'string' ? error : error.data?.message) ||
                    'Your stats could not be loaded.'
                }
            />
        );
    } else if (!data) {
        content = <p className='py-6 text-center'>Loading...</p>;
    } else if (!shownMonth) {
        content = (
            <p className='py-6 text-center'>
                Your stats will appear here once you have finished a game.
            </p>
        );
    } else {
        content = <MonthlyStats month={shownMonth} stats={data.stats} />;
    }

    return (
        <Page>
            <Panel title='Your Stats'>
                <div className='flex flex-col gap-4'>
                    {months.length > 0 && (
                        <div className='flex flex-wrap items-center justify-center gap-2'>
                            <Button
                                aria-label='Older month'
                                isDisabled={!older || isFetching}
                                isIconOnly
                                size='sm'
                                variant='light'
                                onPress={() => setMonth(older)}
                            >
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </Button>
                            <select
                                aria-label='Month'
                                className='rounded-md border border-default-300 bg-default-100 px-2 py-1'
                                value={shownMonth}
                                onChange={(event) => setMonth(event.target.value)}
                            >
                                {months.map((value) => (
                                    <option key={value} value={value}>
                                        {monthName(value)}
                                    </option>
                                ))}
                            </select>
                            <Button
                                aria-label='Newer month'
                                isDisabled={!newer || isFetching}
                                isIconOnly
                                size='sm'
                                variant='light'
                                onPress={() => setMonth(newer)}
                            >
                                <FontAwesomeIcon icon={faChevronRight} />
                            </Button>
                        </div>
                    )}
                    <div className={isFetching ? 'opacity-60 transition-opacity' : ''}>
                        {content}
                    </div>
                </div>
            </Panel>
        </Page>
    );
};

export default Stats;
