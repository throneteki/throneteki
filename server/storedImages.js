import bodyParser from 'body-parser';
import { SupportedImageTypes } from './imageInfo.js';

export const ImageTokenPattern = /^[a-f0-9]{32}$/;

export const readImageBody = (limit) => bodyParser.raw({ type: SupportedImageTypes, limit });

// Each upload gets a new random token, so the response for a token never changes and can be
// cached for good
export function sendStoredImage(res, image) {
    if (!image) {
        return res.status(404).send({ success: false, message: 'Not found' });
    }

    res.set({
        'Content-Type': image.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'"
    });
    res.send(image.image);
}
