import React, { useMemo, useState } from 'react';
import moment from 'moment';
import ReactTable from '../Table/ReactTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faDownload,
    faFileCirclePlus,
    faHeart,
    faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { useDispatch } from 'react-redux';
import { navigate } from '../../redux/reducers/navigation';
import {
    useAddDeckMutation,
    useDeleteDecksMutation,
    useGetDecksQuery,
    useToggleDeckFavouriteMutation
} from '../../redux/middleware/api';
import CardImage from '../Images/CardImage';

import './DeckList.css';
import AlertPanel, { AlertType } from '../Site/AlertPanel';
import DeckStatus from './DeckStatus';
import ConfirmDialog from '../Site/ConfirmDialog';
import { toast } from 'react-toastify';
import CardHoverable from '../Images/CardHoverable';
import FactionFilter from '../Table/FactionFilter';
import { Constants } from '../../constants';
import ImportDeckModal from './ImportDeckModal';

const DeckList = ({ restrictedList, onDeckSelected, readOnly }) => {
    const dispatch = useDispatch();

    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedRows, setSelectedRows] = useState(new Set([]));
    const [showConfirm, setShowConfirm] = useState(false);
    const [addDeck, { isLoading: isAddLoading }] = useAddDeckMutation();
    const [deleteDecks, { isLoading: isDeleteLoading }] = useDeleteDecksMutation();
    const [toggleFavourite] = useToggleDeckFavouriteMutation();
    const [factionFilter, setFactionFilter] = useState([]);
    const [showImportModal, setShowImportModal] = useState(false);
    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                cell: (info) => {
                    return <span className='cursor-pointer'>{info.getValue()}</span>;
                },
                meta: {
                    colWidth: '50%',
                    className: 'min-w-34'
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
                        agendas.push(agenda.code);
                    }

                    for (const agenda of info.row.original.bannerCards) {
                        agendas.push(agenda.code);
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

                    return <div className='flex flex-col sm:flex-row gap-0.5'>{content}</div>;
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
                    className: 'max-lg:hidden'
                },
                enableColumnFilter: false
            },
            {
                accessorKey: 'status',
                cell: (info) => (
                    <div className='justify-content-center flex'>
                        {restrictedList && (
                            <div onPointerDown={(e) => e.stopPropagation()}>
                                <DeckStatus
                                    compact={'max-md'}
                                    status={info.row.original.status[restrictedList]}
                                />
                            </div>
                        )}
                    </div>
                ),
                header: 'Validity',
                meta: {
                    colWidth: '5%'
                },
                enableColumnFilter: false,
                enableSorting: false
            },
            /*  {
                accessorKey: 'winRate',
                cell: (info) => {
                    return (
                        <span>
                            {info.getValue()}
                            {`${info.getValue() ? '%' : ''}`}
                        </span>
                    );
                },
                header: 'Win Rate',
                meta: {
                    colWidth: '10%'
                },
                enableColumnFilter: false
            }*/ {
                accessorKey: 'isFavourite',
                cell: (info) => (
                    <div
                        className='justify-center flex text-danger h-full'
                        role={readOnly ? 'false' : 'button'}
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
                    className: 'max-sm:hidden'
                },
                enableColumnFilter: false
            }
        ],
        [factionFilter, readOnly, restrictedList, toggleFavourite]
    );
    const buttons = readOnly
        ? []
        : [
              {
                  color: 'default',
                  icon: <FontAwesomeIcon icon={faFileCirclePlus} />,
                  label: 'New',
                  onPress: () => dispatch(navigate('/decks/new'))
              },
              {
                  color: 'default',
                  icon: <FontAwesomeIcon icon={faDownload} />,
                  label: 'Import',
                  onPress: () => setShowImportModal(true)
              },
              {
                  color: 'danger',
                  icon: <FontAwesomeIcon icon={faTrashAlt} />,
                  label: 'Delete',
                  disabled: selectedIds.length === 0,
                  isLoading: isDeleteLoading,
                  onPress: () => setShowConfirm(true)
              }
          ];

    return (
        <>
            <ReactTable
                buttons={buttons}
                dataLoadFn={useGetDecksQuery}
                dataLoadArg={restrictedList ? { restrictedList: restrictedList } : null}
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
                emptyContent={
                    <AlertPanel variant={AlertType.Info}>
                        You have no decks or none have been found using the specific filter. Create
                        or import a new deck above, or clear the filter
                    </AlertPanel>
                }
                remote
                disableSelection={readOnly}
                columns={columns}
                onRowClick={(row) => onDeckSelected && onDeckSelected(row.original)}
                onRowSelectionChange={(ids) => setSelectedIds(ids.map((r) => r.original._id))}
                selectedRows={selectedRows}
                classNames={{
                    td: 'max-sm:px-2',
                    th: 'max-sm:px-2'
                }}
                isStriped={false}
            />
            <ConfirmDialog
                isOpen={showConfirm}
                message={`Are you sure you want to delete ${selectedIds.length === 1 ? 'this deck' : 'these decks'}?`}
                onOpenChange={setShowConfirm}
                onCancel={() => setShowConfirm(false)}
                onOk={async () => {
                    try {
                        await deleteDecks(selectedIds).unwrap();

                        setSelectedRows(new Set([]));
                        setSelectedIds([]);

                        toast.success('Deck(s) deleted successfully');
                    } catch (err) {
                        toast.error('An error occurred deleting decks');
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
                        toast.error('An error occurred adding deck');
                    }
                }}
                isLoading={isAddLoading}
            />
        </>
    );
};

export default DeckList;
