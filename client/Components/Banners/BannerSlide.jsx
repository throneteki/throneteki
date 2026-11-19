import React from 'react';

const BannerSlide = ({ banner, imageUrl, onPlay, children }) => {
    const image = (
        <img src={imageUrl} alt={banner.title} className='block aspect-[6/1] w-full object-cover' />
    );

    let content = image;
    if (banner.linkUrl) {
        content = (
            <a href={banner.linkUrl} target='_blank' rel='noopener noreferrer' className='block'>
                {image}
            </a>
        );
    } else if (banner.eventId) {
        content = (
            <button type='button' className='block w-full' onClick={onPlay}>
                {image}
            </button>
        );
    }

    return (
        <div className='relative mx-auto w-full max-w-[calc(18vh*6)] overflow-hidden border border-gold-line shadow-[0_18px_40px_rgba(0,0,0,0.55)]'>
            {content}
            {children}
        </div>
    );
};

export default BannerSlide;
