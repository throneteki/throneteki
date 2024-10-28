import React from 'react';
import NewsItem from './NewsItem';
import AlertPanel from '../Site/AlertPanel';

const News = ({ news }) => {
    const icons = ['military', 'intrigue', 'power'];

    let iconIndex = 0;
    const renderedNews = news.map((newsItem, newsIndex) => {
        return <NewsItem key={newsIndex} icon={icons[iconIndex++ % 3]} newsItem={newsItem} />;
    });

    if (renderedNews.length === 0) {
        renderedNews.push(
            <AlertPanel key={0} variant='info'>
                There is no site news at the moment
            </AlertPanel>
        );
    }

    return <div className='overflow-y-auto'>{renderedNews}</div>;
};

export default News;
