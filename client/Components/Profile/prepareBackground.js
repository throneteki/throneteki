import { MaxBackgroundBytes, MaxBackgroundDimension } from '../../../shared/backgrounds';
import { encodeCanvas, loadBitmap } from '../../imageEncoding';

const CoverWidth = 1920;
const CoverHeight = 1080;

export async function prepareBackground(file) {
    const bitmap = await loadBitmap(file);

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

    const blob = await encodeCanvas(canvas);

    if (blob.size > MaxBackgroundBytes) {
        throw new Error(
            `That image is too large, even after resizing. Backgrounds can be up to ${MaxBackgroundBytes / 1024 / 1024}MB.`
        );
    }

    return blob;
}
