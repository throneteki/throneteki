import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import Frame from '../Components/Site/Frame';
import LoadingSpinner from '../Components/Site/LoadingSpinner';
import Notice from '../Components/Site/Notice';
import SelectField from '../Components/Site/SelectField';
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
            <Page size='narrow'>
                <Frame title='Your stats'>
                    <Notice kind='warning'>Log in to see your stats.</Notice>
                </Frame>
            </Page>
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
            <Notice kind='error'>
                {(typeof error === 'string' ? error : error.data?.message) ||
                    'Your stats could not be loaded. Try again in a moment.'}
            </Notice>
        );
    } else if (!data) {
        content = <LoadingSpinner className='py-10' />;
    } else if (!shownMonth) {
        content = (
            <p className='py-10 text-center text-sm text-ink-dim'>
                Your stats will appear here once you have finished a game.
            </p>
        );
    } else {
        content = <MonthlyStats month={shownMonth} stats={data.stats} />;
    }

    const monthPicker = months.length > 0 && (
        <div className='flex items-center gap-1'>
            <Button
                aria-label='Older month'
                isDisabled={!older || isFetching}
                isIconOnly
                size='sm'
                onPress={() => setMonth(older)}
                variant='ghost'
            >
                <FontAwesomeIcon icon={faChevronLeft} />
            </Button>
            <SelectField
                aria-label='Month'
                className='w-44'
                value={shownMonth}
                onChange={(value) => value && setMonth(value)}
                items={months.map((value) => ({ id: value, label: monthName(value) }))}
            />
            <Button
                aria-label='Newer month'
                isDisabled={!newer || isFetching}
                isIconOnly
                size='sm'
                onPress={() => setMonth(newer)}
                variant='ghost'
            >
                <FontAwesomeIcon icon={faChevronRight} />
            </Button>
        </div>
    );

    return (
        <Page>
            <Frame
                title='Your stats'
                description="Your games month by month. They're only for you: nobody else can see them."
                actions={monthPicker}
            >
                <div className={isFetching ? 'opacity-60 transition-opacity' : undefined}>
                    {content}
                </div>
            </Frame>
        </Page>
    );
};

export default Stats;
