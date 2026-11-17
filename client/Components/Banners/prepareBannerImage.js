import { BannerHeight, BannerWidth, MaxBannerBytes } from '../../../shared/banners';
import { encodeCanvas, loadBitmap } from '../../imageEncoding';

export async function prepareBannerImage(file) {
    const bitmap = await loadBitmap(file);

    const scale = Math.max(BannerWidth / bitmap.width, BannerHeight / bitmap.height);
    const sourceWidth = BannerWidth / scale;
    const sourceHeight = BannerHeight / scale;

    const canvas = document.createElement('canvas');
    canvas.width = BannerWidth;
    canvas.height = BannerHeight;
    canvas
        .getContext('2d')
        .drawImage(
            bitmap,
            (bitmap.width - sourceWidth) / 2,
            (bitmap.height - sourceHeight) / 2,
            sourceWidth,
            sourceHeight,
            0,
            0,
            BannerWidth,
            BannerHeight
        );
    bitmap.close();

    const blob = await encodeCanvas(canvas);

    if (blob.size > MaxBannerBytes) {
        throw new Error(
            `That image is too large, even after resizing. Banner images can be up to ${MaxBannerBytes / 1024 / 1024}MB.`
        );
    }

    return { image: blob, upscaled: scale > 1 };
}
