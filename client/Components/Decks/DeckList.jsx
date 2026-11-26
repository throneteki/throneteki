import React, { useMemo, useState } from 'react';
import moment from 'moment';
import ReactTable from '../Table/ReactTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCloudArrowDown,
    faDownload,
    faFileCirclePlus,
    faHeart,
    faLock,
    faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { useDispatch } from 'react-redux';
import { navigate } from '../../redux/reducers/navigation';
import {
    useAddDeckMutation,
    useDeleteDecksMutation,
    useGetCardsQuery,
    useGetDecksQuery,
    useToggleDeckFavouriteMutation
} from '../../redux/middleware/api';
import { Checkbox } from '@heroui/react';
import CardImage from '../Images/CardImage';

import DeckStatus from './DeckStatus';
import ConfirmDialog from '../Site/ConfirmDialog';
import { toast } from 'react-toastify';
import CardHoverable from '../Images/CardHoverable';
import FactionFilter from '../Table/FactionFilter';
import { Constants } from '../../constants';
import ImportDeckModal from './ImportDeckModal';

const DeckList = ({
    format,
    variant,
    legality,
    eventId,
    deckLoadFn = useGetDecksQuery,
    onDeckSelected,
    readOnly
}) => {
    const dispatch = useDispatch();

    const [selectedIds, setSelectedIds] = useState([]);
    const [isLockedDeckSelected, setIsLockedDeckSelected] = useState(false);
    const [selectedRows, setSelectedRows] = useState(new Set([]));
    const [showConfirm, setShowConfirm] = useState(false);
    const [addDeck, { isLoading: isAddLoading }] = useAddDeckMutation();
    const [deleteDecks, { isLoading: isDeleteLoading }] = useDeleteDecksMutation();
    const [toggleFavourite] = useToggleDeckFavouriteMutation();
    const [factionFilter, setFactionFilter] = useState([]);
    const [showImportModal, setShowImportModal] = useState(false);
    const { data: cards } = useGetCardsQuery({});

    const agendaText = (deck) => {
        const label = (code) => cards?.[code]?.label ?? code;

        if (!deck.agenda) {
            return 'No agenda';
        }

        const banners = (deck.bannerCards || []).map((code) =>
            label(code).replace(/^Banner of the /, '')
        );

        return banners.length > 0
            ? `${label(deck.agenda)}: ${banners.join(', ')}`
            : label(deck.agenda);
    };

    const renderDeckCard = (row, { isSelected, toggleSelected }) => {
        const deck = row.original;
        const record = deck.record;

        return (
            <div className='relative flex items-center gap-3 py-3'>
                {!readOnly && (
                    <Checkbox
                        className='relative z-10'
                        aria-label={`Select ${deck.name}`}
                        isSelected={isSelected}
                        onChange={toggleSelected}
                    >
                        <Checkbox.Content>
                            <Checkbox.Control>
                                <Checkbox.Indicator />
                            </Checkbox.Control>
                        </Checkbox.Content>
                    </Checkbox>
                )}
                <CardImage size='small' code={deck.faction.value} className='shrink-0' />
                <div className='flex min-w-0 flex-1 flex-col gap-1'>
                    <span className='flex items-center gap-2 text-base text-ink'>
                        <button
                            type='button'
                            className='truncate text-left after:absolute after:inset-0'
                            onClick={() => onDeckSelected && onDeckSelected(deck)}
                        >
                            {deck.name}
                        </button>
                        {deck.locked && (
                            <FontAwesomeIcon
                                className='shrink-0 text-xs text-ink-faint'
                                icon={faLock}
                                title='Locked for an event'
                            />
                        )}
                    </span>
                    <span className='truncate text-sm text-ink-dim'>{agendaText(deck)}</span>
                    <span className='flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-faint'>
                        <span className='relative z-10'>
                            <DeckStatus deck={deck} showDeckDetails={false} />
                        </span>
                        {record && (
                            <span className='tabular-nums'>
                                {record.wins}-{record.games - record.wins}
                            </span>
                        )}
                        <span>{moment(deck.lastUpdated).local().format('D MMM YYYY')}</span>
                    </span>
                </div>
                {readOnly ? (
                    deck.isFavourite && (
                        <FontAwesomeIcon className='shrink-0 text-gold' icon={faHeart} />
                    )
                ) : (
                    <button
                        type='button'
                        className='relative z-10 grid h-10 w-10 shrink-0 place-items-center text-gold'
                        aria-pressed={!!deck.isFavourite}
                        aria-label={`Favourite ${deck.name}`}
                        onClick={() => toggleFavourite(deck._id)}
                    >
                        <FontAwesomeIcon icon={deck.isFavourite ? faHeart : faHeartRegular} />
                    </button>
                )}
            </div>
        );
    };
    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                cell: (info) => {
                    return (
                        <span className='flex cursor-pointer items-center gap-2 text-ink'>
                            {info.getValue()}
                            {info.row.original.locked && (
                                <FontAwesomeIcon
                                    className='ml-auto text-ink-faint'
                                    icon={faLock}
                                    title='Locked for an event'
                                />
                            )}
                        </span>
                    );
                },
                meta: {
                    colWidth: '42%',
                    className: 'min-w-34',
                    sortLabels: { asc: 'Name, A to Z', desc: 'Name, Z to A' }
                }
            },
            {
                id: 'faction.name',
                accessorFn: (row) => row.faction,
                cell: (info) => {
                    const faction = info.getValue();
                    return (
                        <div
                            className='flex justify-center align-middle'
                            onPointerDown={(e) => e.stopPropagation()}
                        >
                            <CardHoverable code={faction.value}>
                                <CardImage size='small' code={faction.value} />
                            </CardHoverable>
                        </div>
                    );
                },
                filterFn: 'arrIncludesSome',
                meta: {
                    colWidth: '5%',
                    groupingFilter: () => (
                        <FactionFilter filter={factionFilter} setFilter={setFactionFilter} />
                    )
                },
                header: 'Faction',
                enableSorting: false
            },
            {
                accessorFn: (row) => row.agenda,
                id: 'agenda.label',
                cell: (info) => {
                    const agenda = info.getValue();
                    const agendas = [];

                    if (agenda) {
                        agendas.push(agenda);
                    }

                    if (info.row.original.bannerCards) {
                        for (const agenda of info.row.original.bannerCards) {
                            agendas.push(agenda);
                        }
                    }

                    const content =
                        agendas.length === 0 ? (
                            <>None</>
                        ) : (
                            agendas.map((code) => {
                                return (
                                    <div key={code} onPointerDown={(e) => e.stopPropagation()}>
                                        <CardHoverable code={code}>
                                            <CardImage size='small' code={code} />
                                        </CardHoverable>
                                    </div>
                                );
                            })
                        );

                    return <div className='flex sm:gap-0.5 max-sm:[&>*+*]:-ml-6'>{content}</div>;
                },
                meta: {
                    colWidth: '15%'
                },
                header: 'Agenda(s)',
                enableColumnFilter: false,
                enableSorting: false
            },
            {
                accessorKey: 'lastUpdated',
                cell: (info) => moment(info.getValue()).local().format('YYYY-MM-DD'),
                header: 'Updated',
                meta: {
                    colWidth: '15%',
                    className: 'max-lg:hidden',
                    sortLabels: { desc: 'Recently updated', asc: 'Least recently updated' }
                },
                enableColumnFilter: false
            },
            {
                accessorKey: 'status',
                cell: (info) => (
                    <div className='justify-content-center flex'>
                        <div onPointerDown={(e) => e.stopPropagation()}>
                            <DeckStatus compact='max-md' deck={info.row.original} />
                        </div>
                    </div>
                ),
                header: 'Validity',
                meta: {
                    colWidth: '5%'
                },
                enableColumnFilter: false,
                enableSorting: false
            },
            {
                id: 'record',
                accessorFn: (deck) => deck.record,
                cell: (info) => {
                    const record = info.getValue();
                    if (!record) {
                        return null;
                    }

                    return (
                        <span
                            className='whitespace-nowrap tabular-nums'
                            title={`${record.games} games with this deck`}
                        >
                            {record.wins}-{record.games - record.wins}
                        </span>
                    );
                },
                header: 'Record',
                meta: {
                    colWidth: '8%',
                    className: 'max-md:hidden'
                },
                enableColumnFilter: false,
                enableSorting: false
            },
            {
                accessorKey: 'thronesDbUuid',
                cell: (info) =>
                    info.getValue() ? (
                        <div className='flex justify-center'>
                            <a
                                className='text-ink-dim hover:text-gold'
                                href={`https://thronesdb.com/deck/view/${info.getValue()}`}
                                target='_blank'
                                rel='noreferrer'
                                title='View on ThronesDB'
                                aria-label='View on ThronesDB'
                                onPointerDown={(event) => event.stopPropagation()}
                                onClick={(event) => event.stopPropagation()}
                            >
                                <FontAwesomeIcon icon={faCloudArrowDown} />
                            </a>
                        </div>
                    ) : null,
                header: 'ThronesDB',
                meta: {
                    colWidth: '5%',
                    className: 'max-sm:hidden'
                },
                enableColumnFilter: false,
                enableSorting: false
            },
            {
                accessorKey: 'isFavourite',
                cell: (info) => (
                    <div
                        className='flex h-full justify-center text-gold'
                        role={readOnly ? undefined : 'button'}
                        aria-label={
                            info.getValue() ? 'Remove from favourites' : 'Add to favourites'
                        }
                        onPointerDown={async (event) => {
                            event.stopPropagation();

                            if (readOnly) {
                                return;
                            }

                            await toggleFavourite(info.row.original._id);
                        }}
                    >
                        <FontAwesomeIcon icon={info.getValue() ? faHeart : faHeartRegular} />
                    </div>
                ),
                header: 'Favourite',
                meta: {
                    colWidth: '5%',
                    className: 'max-sm:hidden',
                    sortLabels: { desc: 'Favourites first' }
                },
                enableColumnFilter: false
            }
        ],
        [factionFilter, readOnly, toggleFavourite]
    );
    const buttons = readOnly
        ? []
        : [
              {
                  color: 'primary',
                  icon: <FontAwesomeIcon icon={faFileCirclePlus} />,
                  label: 'New deck',
                  onPress: () => dispatch(navigate('/decks/new'))
              },
              {
                  color: 'default',
                  icon: <FontAwesomeIcon icon={faDownload} />,
                  label: 'Import',
                  onPress: () => setShowImportModal(true)
              },
              {
                  color: 'default',
                  icon: <FontAwesomeIcon icon={faCloudArrowDown} />,
                  label: 'From ThronesDB',
                  onPress: () => dispatch(navigate('/decks/thronesdb'))
              },
              {
                  color: 'danger',
                  icon: <FontAwesomeIcon icon={faTrashAlt} />,
                  label: 'Delete',
                  disabled: selectedIds.length === 0 || isLockedDeckSelected,
                  isLoading: isDeleteLoading,
                  onPress: () => setShowConfirm(true)
              }
          ];

    return (
        <>
            <ReactTable
                buttons={buttons}
                dataLoadFn={deckLoadFn}
                dataLoadArg={{ format, variant, legality, eventId }}
                defaultColumnFilters={{
                    'faction.name': Constants.Factions.filter(({ value }) =>
                        factionFilter.includes(value)
                    ).map(({ name }) => name)
                }}
                defaultSort={[
                    {
                        id: 'lastUpdated',
                        desc: true
                    }
                ]}
                emptyContent='No decks match. Create or import a deck, or clear the filters.'
                remote
                disableSelection={readOnly}
                columns={columns}
                onRowClick={(row) => onDeckSelected && onDeckSelected(row.original)}
                onRowSelectionChange={(rows) => {
                    setSelectedIds(rows.map((r) => r.original._id));
                    setIsLockedDeckSelected(rows.some((r) => r.original.locked));
                }}
                selectedRows={selectedRows}
                renderCard={renderDeckCard}
            />
            <ConfirmDialog
                isOpen={showConfirm}
                isDestructive
                title={selectedIds.length === 1 ? 'Delete this deck?' : 'Delete these decks?'}
                message="Deleted decks can't be recovered."
                okLabel='Delete'
                cancelLabel='Cancel'
                onOpenChange={setShowConfirm}
                onCancel={() => setShowConfirm(false)}
                onOk={async () => {
                    try {
                        await deleteDecks(selectedIds).unwrap();

                        setSelectedRows(new Set([]));
                        setSelectedIds([]);
                        setIsLockedDeckSelected(false);

                        toast.success('Deck(s) deleted successfully');
                    } catch (err) {
                        toast.error(err.data?.message || 'An error occurred deleting decks');
                    }
                }}
            />
            <ImportDeckModal
                isOpen={showImportModal}
                onOpenChange={(open) => setShowImportModal(open)}
                onProcessed={async (deck) => {
                    try {
                        await addDeck(deck).unwrap();

                        setShowImportModal(false);

                        toast.success('Deck imported successfully');
                    } catch (err) {
                        toast.error('An error occurred while importing deck');
                    }
                }}
                isLoading={isAddLoading}
            />
        </>
    );
};

export default DeckList;
