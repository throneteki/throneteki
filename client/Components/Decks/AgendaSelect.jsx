import React, { useMemo, useState } from 'react';
import CardImage from '../Images/CardImage';
import AlertPanel from '../Site/AlertPanel';
import { Button } from '@nextui-org/react';
import { useGetCardsQuery } from '../../redux/middleware/api';
import LoadingSpinner from '../Site/LoadingSpinner';

const AgendaSelect = ({ onBackClick, onNextClick }) => {
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

    if (isLoading) {
        return <LoadingSpinner />;
    } else if (isError) {
        return (
            <AlertPanel variant='danger'>
                An error occurred loading data from the server. Please try again later.
            </AlertPanel>
        );
    }

    return (
        <>
            <div className='mb-2'>
                <Button color='default' className='mr-2' onClick={() => onBackClick()}>
                    Back
                </Button>
                <Button color='primary' onClick={() => onNextClick(selectedAgendas)}>
                    Next
                </Button>
            </div>
            <div className='grid h-[75vh] grid-cols-8 overflow-y-auto '>
                {agendas.map((agenda) => (
                    <div key={agenda.code} className='m-4 flex content-center'>
                        <div
                            role={canSelectAgenda(agenda.code) ? 'button' : undefined}
                            onClick={() => {
                                if (!canSelectAgenda(agenda.code)) {
                                    return;
                                }

                                const isSelected = selectedAgendas.some(
                                    (a) => a.code === agenda.code
                                );

                                setAgendas(
                                    isSelected
                                        ? selectedAgendas.filter((a) => a.code !== agenda.code)
                                        : selectedAgendas.concat(agenda)
                                );
                            }}
                        >
                            <div className='text-center'>
                                <CardImage
                                    imageUrl={`/img/cards/${agenda.code}.png`}
                                    size='lg'
                                    selected={selectedAgendas.some((a) => a.code === agenda.code)}
                                />
                                {agenda.label}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default AgendaSelect;
