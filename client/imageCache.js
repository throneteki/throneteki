import { useSyncExternalStore } from 'react';
import { Constants } from './constants';

const maxActive = 4;
const maxEntries = 300;

const status = new Map();
const inflight = new Map();
const queue = [];
const listeners = new Set();
let active = 0;

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

const decodeImage = (src) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.src = src;
        if (typeof image.decode === 'function') {
            image.decode().then(resolve, reject);
        } else {
            image.onload = resolve;
            image.onerror = reject;
        }
    });

const pump = () => {
    while (active < maxActive && queue.length > 0) {
        const { src, resolve } = queue.shift();
        active++;

        const finish = (value) => {
            active--;
            inflight.delete(src);
            markImage(src, value);
            resolve();
            pump();
        };

        decodeImage(src).then(
            () => finish('loaded'),
            () => finish('error')
        );
    }
};

export const preloadImage = (src) => {
    if (status.has(src)) {
        return Promise.resolve();
    }
    if (inflight.has(src)) {
        return inflight.get(src);
    }

    const promise = new Promise((resolve) => {
        queue.push({ src, resolve });
    });
    inflight.set(src, promise);
    pump();

    return promise;
};

export const preloadCards = (codes) => {
    if (typeof navigator !== 'undefined' && navigator.connection?.saveData) {
        return;
    }

    codes.forEach((code) => preloadImage(cardImageSrc(code)));
};
