import { MaxBackgroundBytes, MaxBackgroundDimension } from '../../../shared/backgrounds';

export const AcceptedBackgroundFiles = 'image/png,image/jpeg,image/webp,image/gif,image/avif';

const CoverWidth = 1920;
const CoverHeight = 1080;

const toBlob = (canvas, type) => new Promise((resolve) => canvas.toBlob(resolve, type, 0.85));

export async function prepareBackground(file) {
    let bitmap;
    try {
        bitmap = await createImageBitmap(file);
    } catch {
        throw new Error('That file could not be read. Try a PNG, JPEG or WebP image.');
    }

    const scale = Math.min(
        1,
        Math.max(CoverWidth / bitmap.width, CoverHeight / bitmap.height),
        MaxBackgroundDimension / bitmap.width,
        MaxBackgroundDimension / bitmap.height
    );

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    let blob = await toBlob(canvas, 'image/webp');
    // Browsers that can't encode WebP fall back to PNG, which is much larger than JPEG for a photo
    if (!blob || blob.type !== 'image/webp') {
        blob = await toBlob(canvas, 'image/jpeg');
    }

    if (!blob) {
        throw new Error('That image could not be converted');
    }

    if (blob.size > MaxBackgroundBytes) {
        throw new Error(
            `That image is too large, even after resizing. Backgrounds can be up to ${MaxBackgroundBytes / 1024 / 1024}MB.`
        );
    }

    return blob;
}
