import React from 'react';
import moment from 'moment';

import './NewsItem.css';

const urlMatchingRegex = new RegExp(
    /(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?/,
    'ig'
);

function getMessageWithLinks(message) {
    const tokens = message.split(/\s/);

    let i = 0;
    const parts = tokens.map((token) => {
        if (token.match(urlMatchingRegex)) {
            return (
                <a key={`link-${i++}`} href={token} target='_blank' rel='noopener noreferrer'>
                    {token}
                </a>
            );
        }

        return token + ' ';
    });

    return parts;
}

const icons = {
    military: '\ue605',
    intrigue: '\ue602',
    power: '\ue607'
};

const NewsItem = ({ newsItem, icon }) => {
    const parts = getMessageWithLinks(newsItem.text);

    return (
        <div className='flex border-b-1 border-dotted border-primary pb-1 pt-1 text-secondary first:border-t-1 first:bg-primary first:bg-opacity-20 first:text-white'>
            <div className={`news-icon font-[thronesdb] ${icon} w-5 text-center`}>
                {icons[icon]}
            </div>
            &nbsp;
            {`${moment(newsItem.datePublished).format('YYYY-MM-DD')} - ${newsItem.poster} - `}
            {parts}
        </div>
    );
};

export default NewsItem;
