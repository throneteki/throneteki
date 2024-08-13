import React from 'react';
import { Pagination } from '@nextui-org/react';

const TablePagination = ({ currentPage, pageCount, setCurrentPage }) => {
    return (
        <>
            <Pagination
                classNames={{ base: 'p-3' }}
                total={Math.min(pageCount, 5)}
                showControls
                initialPage={currentPage}
                onChange={setCurrentPage}
            ></Pagination>
        </>
    );
};

export default TablePagination;
