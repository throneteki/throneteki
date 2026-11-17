export const AcceptedImageFiles = 'image/png,image/jpeg,image/webp,image/gif,image/avif';

const toBlob = (canvas, type) => new Promise((resolve) => canvas.toBlob(resolve, type, 0.85));

export async function loadBitmap(file) {
    try {
        return await createImageBitmap(file);
    } catch {
        throw new Error('That file could not be read. Try a PNG, JPEG or WebP image.');
    }
}

export async function encodeCanvas(canvas) {
    let blob = await toBlob(canvas, 'image/webp');
    // Browsers that can't encode WebP fall back to PNG, which is much larger than JPEG for a photo
    if (!blob || blob.type !== 'image/webp') {
        blob = await toBlob(canvas, 'image/jpeg');
    }

    if (!blob) {
        throw new Error('That image could not be converted');
    }

    return blob;
}
