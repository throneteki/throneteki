import React, { useMemo, useState } from 'react';
import moment from 'moment';
import ReactTable from '../Table/ReactTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faDownload,
    faFileCirclePlus,
    //faHeart,
    faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
//import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { useDispatch } from 'react-redux';
import { navigate } from '../../redux/reducers/navigation';
import { toastr } from 'react-redux-toastr';
import { useDeleteDecksMutation, useGetDecksQuery } from '../../redux/middleware/api';
// import TableGroupFilter from '../Table/TableGroupFilter';
import FactionImage from '../Images/FactionImage';
import { Constants } from '../../constants';
import CardImage from '../Images/CardImage';
import DeckStatusLabel from './DeckStatusLabel';

import './DeckList.css';

const DeckList = ({ restrictedList, onDeckSelected, readOnly }) => {
    const dispatch = useDispatch();

    const [selectedIds, setSelectedIds] = useState([]);
    const [mousePos, setMousePosition] = useState({ x: 0, y: 0 });
    const [zoomCard, setZoomCard] = useState(null);
    const [deleteDecks, { isLoading: isDeleteLoading }] = useDeleteDecksMutation();

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                cell: (info) => {
                    return info.getValue();
                },
                meta: {
                    colWidth: '55%'
                }
            },
            {
                id: 'faction.name',
                accessorFn: (row) => row.faction,
                cell: (info) => {
                    const faction = info.getValue();
                    return (
                        <div className='flex content-center'>
                            <FactionImage
                                faction={faction.value}
                                onMouseOver={() =>
                                    setZoomCard(Constants.FactionsImagePaths[faction.value])
                                }
                                onMouseMove={(event) => {
                                    let y = event.clientY;
                                    const yPlusHeight = y + 420;

                                    if (yPlusHeight >= window.innerHeight) {
                                        y -= yPlusHeight - window.innerHeight;
                                    }

                                    setMousePosition({ x: event.clientX, y: y });
                                }}
                                onMouseOut={() => setZoomCard(null)}
                            />
                        </div>
                    );
                },
                meta: {
                    colWidth: '10%'
                    // groupingFilter: (table, onToggle) => {
                    //     return (
                    //         <TableGroupFilter
                    //             onOkClick={(filter) => {
                    //                 if (filter.length > 0) {
                    //                     table.getColumn('faction.name').setFilterValue(filter);
                    //                 }

                    //                 onToggle();
                    //             }}
                    //             onCancelClick={() => onToggle()}
                    //             fetchData={useGetFilterOptionsForDecksQuery}
                    //             filter={table.getColumn('faction.name').getFilterValue()}
                    //             args={{
                    //                 column: 'faction.name',
                    //                 columnFilters: table.getColumn('faction.name').getFilterValue()
                    //             }}
                    //         />
                    //     );
                    // }
                },
                header: 'Faction'
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
                            agendas.map((agenda) => {
                                return (
                                    <span
                                        key={agenda}
                                        onMouseOver={() => setZoomCard(`/img/cards/${agenda}.png`)}
                                        onMouseMove={(event) => {
                                            let y = event.clientY;
                                            const yPlusHeight = y + 420;

                                            if (yPlusHeight >= window.innerHeight) {
                                                y -= yPlusHeight - window.innerHeight;
                                            }

                                            setMousePosition({ x: event.clientX, y: y });
                                        }}
                                        onMouseOut={() => setZoomCard(null)}
                                    >
                                        <CardImage
                                            className='mr-1'
                                            imageUrl={`/img/cards/${agenda}.png`}
                                        />
                                    </span>
                                );
                            })
                        );

                    return <div className='flex'>{content}</div>;
                },
                meta: {
                    colWidth: '10%'
                },
                header: 'Agenda(s)',
                enableColumnFilter: false,
                enableSorting: false
            },
            // {
            //     accessorKey: 'created',
            //     cell: (info) => moment(info.getValue()).local().format('YYYY-MM-DD'),

            //     header: 'Created',
            //     meta: {
            //         colWidth: '15%'
            //     },
            //     enableColumnFilter: false
            // },
            {
                accessorKey: 'lastUpdated',
                cell: (info) => moment(info.getValue()).local().format('YYYY-MM-DD'),
                header: 'Updated',
                meta: {
                    colWidth: '15%'
                },
                enableColumnFilter: false
            },
            {
                accessorKey: 'status',
                cell: (info) => (
                    <div className='justify-content-center flex'>
                        {restrictedList && (
                            <DeckStatusLabel status={info.row.original.status[restrictedList]} />
                        )}
                    </div>
                ),
                header: 'Validity',
                meta: {
                    colWidth: '10%'
                },
                enableColumnFilter: false,
                enableSorting: false
            }
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
            },
            {
                accessorKey: 'isFavourite',
                cell: (info) => (
                    <div
                        className='justify-content-center flex text-danger'
                        role={readOnly ? 'false' : 'button'}
                        onClick={async (event) => {
                            event.stopPropagation();

                            if (readOnly) {
                                return;
                            }

                            await toggleFavourite(info.row.original.id);
                        }}
                    >
                        <FontAwesomeIcon icon={info.getValue() ? faHeart : faHeartRegular} />
                    </div>
                ),
                header: 'Favourite',
                meta: {
                    colWidth: '10%'
                },
                enableColumnFilter: false
            }*/
        ],
        [restrictedList]
    );
    const buttons = readOnly
        ? []
        : [
              {
                  color: 'default',
                  icon: <FontAwesomeIcon icon={faFileCirclePlus} />,
                  label: 'New',
                  onClick: () => dispatch(navigate('/decks/new'))
              },
              {
                  color: 'default',
                  icon: <FontAwesomeIcon icon={faDownload} />,
                  label: 'Import',
                  onClick: () => dispatch(navigate('/decks/import'))
              },
              {
                  color: 'danger',
                  icon: <FontAwesomeIcon icon={faTrashAlt} />,
                  label: 'Delete',
                  disabled: selectedIds.length === 0,
                  isLoading: isDeleteLoading,
                  onClick: () => {
                      toastr.confirm(
                          `Are you sure you want to delete ${
                              selectedIds.length === 1 ? 'this deck' : 'these decks'
                          }?`,
                          {
                              okText: 'Yes',
                              cancelText: 'Cancel',
                              onOk: async () => {
                                  try {
                                      const response = await deleteDecks(selectedIds).unwrap();

                                      if (!response.success) {
                                          //    setError(response.message);
                                      } else {
                                          //   setSuccess(t('Deck added successfully.'));
                                      }
                                  } catch (err) {
                                      //   const apiError = err as ApiError;
                                      /* setError(
                                    t(
                                        apiError.data.message ||
                                            'An error occured adding the deck. Please try again later.'
                                    )
                                );*/
                                  }
                              }
                          }
                      );
                  }
              }
          ];

    return (
        <div className='h-[75vh]'>
            <ReactTable
                buttons={buttons}
                dataLoadFn={useGetDecksQuery}
                dataLoadArg={restrictedList ? { restrictedList: restrictedList } : null}
                defaultSort={{
                    column: 'lastUpdated',
                    direction: 'descending'
                }}
                remote
                disableSelection={readOnly}
                columns={columns}
                onRowClick={(row) => onDeckSelected && onDeckSelected(row.original)}
                onRowSelectionChange={(ids) => setSelectedIds(ids.map((r) => r.original.id))}
            />
            {zoomCard && (
                <div
                    className='decklist-card-zoom fixed left-0 top-0 z-50'
                    style={{ left: mousePos.x + 5 + 'px', top: mousePos.y + 'px' }}
                >
                    <CardImage imageUrl={zoomCard} size='lg' />
                </div>
            )}
        </div>
    );
};

export default DeckList;
