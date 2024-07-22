import React from 'react';

import NewsItem from './NewsItem';

const News = ({ news }) => {
    const icons = ['military', 'intrigue', 'power'];

    let iconIndex = 0;
    const newsItems = news.map((newsItem) => {
        const retNews = (
            <NewsItem
                key={newsItem.datePublished}
                icon={icons[iconIndex++]}
                date={newsItem.datePublished}
                text={newsItem.text}
            />
        );
        if (iconIndex === 3) {
            iconIndex = 0;
        }

        return retNews;
    });

    if (newsItems.length === 0) {
        return (
            <div className='news-container'>
                <div className='military-container'>There is no site news at the moment</div>
            </div>
        );
    }

    return <div className='news-container'>{newsItems}</div>;
};

export default News;
