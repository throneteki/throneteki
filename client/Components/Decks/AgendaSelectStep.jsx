import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import CardImage from '../Images/CardImage';
import { Button } from '@heroui/react';
import { useGetCardsQuery } from '../../redux/middleware/api';
import LoadingSpinner from '../Site/LoadingSpinner';
import CardHoverable from '../Images/CardHoverable';
import Frame from '../Site/Frame';
import Notice from '../Site/Notice';

const AgendaSelectStep = ({ onBackClick, onNextClick }) => {
    const { data, isLoading, isError } = useGetCardsQuery({});
    const [selectedAgendas, setAgendas] = useState([]);
    const agendas = useMemo(() => {
        if (!data) {
            return [];
        }

        const agendas = Object.values(data).filter((c) => c.type === 'agenda');

        return agendas.sort((a, b) => a.label.localeCompare(b.label));
    }, [data]);

    const canSelectAgenda = (agendaCode) => {
        if (selectedAgendas.some((a) => a.code === agendaCode)) {
            return true;
        }

        if (selectedAgendas.length > 2) {
            return false;
        }

        if (selectedAgendas.length > 0 && selectedAgendas.some((a) => a.code === '06018')) {
            const card = agendas.find((a) => a.code === agendaCode);

            return card?.traits.some((t) => t === 'Banner');
        }

        return selectedAgendas.length == 0;
    };

    let content;
    if (isLoading) {
        content = <LoadingSpinner />;
    } else if (isError) {
        content = (
            <Notice kind='error'>
                The agendas couldn&apos;t be loaded. Please try again later.
            </Notice>
        );
    } else {
        content = (
            <div className='grid max-h-[70vh] grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] justify-items-center gap-3 overflow-y-auto p-1'>
                {agendas.map((agenda) => {
                    const isSelected = selectedAgendas.some((a) => a.code === agenda.code);
                    const isSelectable = canSelectAgenda(agenda.code);

                    return (
                        <button
                            key={agenda.code}
                            type='button'
                            aria-pressed={isSelected}
                            aria-label={agenda.label}
                            disabled={!isSelectable}
                            className={classNames(
                                'rounded-sm transition-opacity duration-150',
                                isSelected
                                    ? 'outline-3 outline-offset-2 outline-accent'
                                    : 'outline-none',
                                { 'cursor-not-allowed opacity-35': !isSelectable }
                            )}
                            onClick={() =>
                                setAgendas(
                                    isSelected
                                        ? selectedAgendas.filter((a) => a.code !== agenda.code)
                                        : selectedAgendas.concat(agenda)
                                )
                            }
                        >
                            <CardHoverable code={agenda.code}>
                                <CardImage code={agenda.code} size='large' />
                            </CardHoverable>
                        </button>
                    );
                })}
            </div>
        );
    }

    const description =
        selectedAgendas.length === 0
            ? 'Choose an agenda, or go on without one. Alliance lets you add two Banners.'
            : `Chosen: ${selectedAgendas.map((a) => a.label).join(', ')}.`;

    return (
        <Frame
            title='Choose an agenda'
            description={description}
            actions={
                <>
                    <Button onPress={() => onBackClick()} variant='tertiary'>
                        Back
                    </Button>
                    <Button onPress={() => onNextClick(selectedAgendas)} variant='primary'>
                        Next
                    </Button>
                </>
            }
        >
            {content}
        </Frame>
    );
};

export default AgendaSelectStep;
