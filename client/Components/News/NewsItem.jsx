import React from 'react';
import moment from 'moment';

import { getMessageWithLinks } from '../../util';

const NewsItem = ({ text, icon, date }) => {
    let parts = getMessageWithLinks(text);

    return (
        <div className='news-item'>
            <span className={`thronesicon thronesicon-${icon}`} />
            &nbsp;{moment(date).format('YYYY-MM-DD') + ' - '}
            {parts}
        </div>
    );
};

export default NewsItem;
