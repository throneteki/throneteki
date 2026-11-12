import { useSyncExternalStore } from 'react';
import { Constants } from './constants';

const maxActive = 4;
// Images that nothing is waiting for yet leave the connections free for the ones that are shown
const maxBackground = 2;
export const background = 1;
const maxEntries = 300;

const status = new Map();
const inflight = new Map();
const queue = [];
const listeners = new Set();
let active = 0;
let activeBackground = 0;

const emit = () => listeners.forEach((listener) => listener());

const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

export const cardImageSrc = (code) =>
    Constants.FactionsImagePaths[code] || `/img/cards/${code}.png`;

export const getImageStatus = (src) => status.get(src);

export const markImage = (src, value) => {
    if (status.get(src) === value) {
        return;
    }

    status.delete(src);
    status.set(src, value);
    if (status.size > maxEntries) {
        status.delete(status.keys().next().value);
    }
    emit();
};

export const useImageStatus = (src) => useSyncExternalStore(subscribe, () => status.get(src));

const decodeImage = (src, priority) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.fetchPriority = priority === background ? 'low' : 'high';
        image.src = src;
        if (typeof image.decode === 'function') {
            image.decode().then(resolve, reject);
        } else {
            image.onload = resolve;
            image.onerror = reject;
        }
    });

const nextInQueue = () => {
    const urgent = queue.findIndex((entry) => entry.priority !== background);
    if (urgent >= 0) {
        return urgent;
    }

    return activeBackground < maxBackground && queue.length > 0 ? 0 : -1;
};

const pump = () => {
    for (let index = nextInQueue(); active < maxActive && index >= 0; index = nextInQueue()) {
        const [{ src, resolve, priority }] = queue.splice(index, 1);
        active++;
        if (priority === background) {
            activeBackground++;
        }

        const finish = (value) => {
            active--;
            if (priority === background) {
                activeBackground--;
            }
            inflight.delete(src);
            markImage(src, value);
            resolve();
            pump();
        };

        decodeImage(src, priority).then(
            () => finish('loaded'),
            () => finish('error')
        );
    }
};

export const preloadImage = (src, priority) => {
    if (status.has(src)) {
        return Promise.resolve();
    }
    if (inflight.has(src)) {
        return inflight.get(src);
    }

    const promise = new Promise((resolve) => {
        queue.push({ src, resolve, priority });
    });
    inflight.set(src, promise);
    pump();

    return promise;
};

export const preloadCards = (codes, priority) => {
    if (typeof navigator !== 'undefined' && navigator.connection?.saveData) {
        return;
    }

    codes.forEach((code) => preloadImage(cardImageSrc(code), priority));
};
