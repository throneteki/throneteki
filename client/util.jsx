import { Link } from '@heroui/react';
import React from 'react';
import { cardSizes } from './constants';

const urlMatchingRegex = new RegExp(
    /(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?/,
    'ig'
);

export function tryParseJSON(jsonString) {
    try {
        var retObject = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object",
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
        if (retObject && typeof retObject === 'object') {
            return retObject;
        }
    } catch (e) {
        return false;
    }
    return false;
}

export function getMessageWithLinks(message) {
    const links = message.match(urlMatchingRegex);
    const retMessage = [];

    if (!links || links.length === 0) {
        return message;
    }

    let lastIndex = 0;
    let linkCount = 0;

    for (const link of links) {
        const index = message.indexOf(link);

        retMessage.push(message.substring(lastIndex, index));
        retMessage.push(
            <Link key={linkCount++} href={link}>
                {link}
            </Link>
        );

        lastIndex += index + link.length;
    }

    retMessage.push(message.substr(lastIndex, message.length - lastIndex));

    return retMessage;
}

export function getCardDimensions(cardSize) {
    const classSize = standardiseCardSize(cardSize);

    const dimensions = cardSizes[classSize];
    return { width: dimensions[0], height: dimensions[1] };
}

export function standardiseCardSize(cardSize) {
    // If given cardsize is legacy, convert to new
    switch (cardSize) {
        case 'small':
            return 'sm';
        case 'normal':
            return 'md';
        case 'large':
            return 'lg';
        case 'x-large':
            return 'xl';
        case '2x-large':
            return '2xl';
        case '3x-large':
            return '3xl';
        case '4x-large':
            return '4xl';
        // case 'auto': {
        //     window.innerWidth
        // }
    }
    throw Error(`Card Size '${cardSize}' does not exist`);
}

export const cardClass = (size, orientation = 'vertical') => {
    const classes = ['card'];
    if (orientation !== 'vertical') {
        // Can be 'vertical', 'horizontal' or 'rotated' (which is vertical, knelt)
        classes.push(orientation);
    }
    classes.push(standardiseCardSize(size));
    return classes.join('-');
};
