import React, { useState } from 'react';
import moment from 'moment';
import { Button } from '@heroui/react';
import Dialog from '../Site/Dialog';
import NewsItem from './NewsItem';
import { getMessageWithLinks } from '../../util';

const News = ({ news }) => {
    const [isOpen, setIsOpen] = useState(false);
    const latest = news[0];

    return (
        <section
            aria-label='News'
            className='flex items-center gap-3 border border-gold-line bg-frame px-4 py-3 sm:gap-4 sm:px-5'
        >
            <div className='flex min-w-0 flex-1 items-baseline gap-3 max-sm:flex-col max-sm:gap-0.5'>
                <h2 className='shrink-0 font-display text-sm font-semibold text-gold'>News</h2>
                {latest ? (
                    <p className='line-clamp-2 min-w-0 text-sm text-ink-dim [overflow-wrap:anywhere]'>
                        <span className='me-2 text-xs text-ink-faint'>
                            {moment(latest.datePublished).format('D MMM')}
                        </span>
                        {getMessageWithLinks(latest.text)}
                    </p>
                ) : (
                    <p className='text-sm text-ink-faint'>No news at the moment.</p>
                )}
            </div>
            {news.length > 0 && (
                <Button
                    size='sm'
                    variant='tertiary'
                    className='shrink-0'
                    onPress={() => setIsOpen(true)}
                >
                    All news
                </Button>
            )}
            <Dialog isOpen={isOpen} onOpenChange={setIsOpen} title='News'>
                <ul className='flex flex-col'>
                    {news.map((newsItem, index) => (
                        <NewsItem
                            key={newsItem._id ?? index}
                            newsItem={newsItem}
                            isLatest={index === 0}
                        />
                    ))}
                </ul>
            </Dialog>
        </section>
    );
};

export default News;
