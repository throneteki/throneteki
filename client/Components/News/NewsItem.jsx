import React from 'react';
import moment from 'moment';

import './NewsItem.css';
import { getMessageWithLinks } from '../../util';

const icons = {
    military: '\ue605',
    intrigue: '\ue602',
    power: '\ue607'
};

const NewsItem = ({ newsItem, icon }) => {
    const parts = getMessageWithLinks(newsItem.text);

    return (
        <div className='flex gap-2 border-b-1 border-dotted border-primary pb-1 pt-1 text-secondary first:border-t-1 first:bg-primary/20 first:text-white'>
            <div className={`font-[thronesdb] ${icon} w-5 text-center`}>{icons[icon]}</div>
            <div>
                {`${moment(newsItem.datePublished).format('YYYY-MM-DD')} - ${newsItem.poster} - `}
                {parts}
            </div>
        </div>
    );
};

export default NewsItem;
