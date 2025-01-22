import React from 'react';
import { Pagination } from "@heroui/react";

const TablePagination = ({ currentPage, pageCount, setCurrentPage }) => {
    return (
        <>
            <Pagination
                classNames={{ base: 'p-3' }}
                total={pageCount}
                showControls
                initialPage={currentPage}
                onChange={setCurrentPage}
            ></Pagination>
        </>
    );
};

export default TablePagination;
