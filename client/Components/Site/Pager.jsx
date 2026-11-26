import React from 'react';
import { Pagination } from '@heroui/react';

const pageWindow = (page, total) => {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages = [1];
    const start = Math.max(2, page - 1);
    const end = Math.min(total - 1, page + 1);
    if (start > 2) {
        pages.push('start-gap');
    }
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    if (end < total - 1) {
        pages.push('end-gap');
    }
    pages.push(total);

    return pages;
};

const Pager = ({ page, total, onChange, className, size = 'sm' }) => {
    if (!total || total < 1) {
        return null;
    }

    return (
        <Pagination size={size} className={className}>
            <Pagination.Content>
                <Pagination.Item>
                    <Pagination.Previous
                        aria-label='Previous page'
                        isDisabled={page <= 1}
                        onPress={() => onChange(page - 1)}
                    >
                        <Pagination.PreviousIcon />
                    </Pagination.Previous>
                </Pagination.Item>
                {pageWindow(page, total).map((p) =>
                    typeof p === 'number' ? (
                        <Pagination.Item key={p}>
                            <Pagination.Link isActive={p === page} onPress={() => onChange(p)}>
                                {p}
                            </Pagination.Link>
                        </Pagination.Item>
                    ) : (
                        <Pagination.Item key={p}>
                            <Pagination.Ellipsis />
                        </Pagination.Item>
                    )
                )}
                <Pagination.Item>
                    <Pagination.Next
                        aria-label='Next page'
                        isDisabled={page >= total}
                        onPress={() => onChange(page + 1)}
                    >
                        <Pagination.NextIcon />
                    </Pagination.Next>
                </Pagination.Item>
            </Pagination.Content>
        </Pagination>
    );
};

export default Pager;
