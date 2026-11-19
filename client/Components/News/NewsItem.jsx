import React from 'react';
import moment from 'moment';
import classNames from 'classnames';

import { getMessageWithLinks } from '../../util';

const NewsItem = ({ newsItem, isLatest, className }) => (
    <li
        className={classNames(
            'flex flex-col gap-1 border-b border-gold-hair py-3 first:pt-0 last:border-b-0',
            className
        )}
    >
        <span className='text-xs text-ink-faint'>
            {moment(newsItem.datePublished).format('D MMM YYYY')}, {newsItem.poster}
        </span>
        <p
            className={classNames(
                'text-sm leading-relaxed [overflow-wrap:anywhere]',
                isLatest ? 'text-ink' : 'text-ink-dim'
            )}
        >
            {getMessageWithLinks(newsItem.text)}
        </p>
    </li>
);

export default NewsItem;
