import { Jimp } from 'jimp';
import { readImageInfo } from '../../server/imageInfo.js';

function webp(chunk, payload) {
    const body = Buffer.concat([Buffer.from('WEBP'), Buffer.from(chunk), payload]);
    const header = Buffer.alloc(8);
    header.write('RIFF', 0, 'ascii');
    header.writeUInt32LE(body.length, 4);

    return Buffer.concat([header, body]);
}

describe('readImageInfo()', function () {
    it('should read the size of a PNG', async function () {
        const image = await new Jimp({ width: 320, height: 180 }).getBuffer('image/png');

        expect(readImageInfo(image)).toEqual({ type: 'image/png', width: 320, height: 180 });
    });

    it('should read the size of a JPEG', async function () {
        const image = await new Jimp({ width: 200, height: 150 }).getBuffer('image/jpeg');

        expect(readImageInfo(image)).toEqual({ type: 'image/jpeg', width: 200, height: 150 });
    });

    it('should read the size of a lossy WebP', function () {
        const payload = Buffer.alloc(18);
        payload.set([0x9d, 0x01, 0x2a], 7);
        payload.writeUInt16LE(1920, 10);
        payload.writeUInt16LE(1080, 12);

        expect(readImageInfo(webp('VP8 ', payload))).toEqual({
            type: 'image/webp',
            width: 1920,
            height: 1080
        });
    });

    it('should read the size of a lossless WebP', function () {
        const payload = Buffer.alloc(14);
        payload[4] = 0x2f;
        payload.writeUInt32LE((640 - 1) | ((480 - 1) << 14), 5);

        expect(readImageInfo(webp('VP8L', payload))).toEqual({
            type: 'image/webp',
            width: 640,
            height: 480
        });
    });

    it('should read the size of an extended WebP', function () {
        const payload = Buffer.alloc(14);
        payload.writeUIntLE(3840 - 1, 8, 3);
        payload.writeUIntLE(2160 - 1, 11, 3);

        expect(readImageInfo(webp('VP8X', payload))).toEqual({
            type: 'image/webp',
            width: 3840,
            height: 2160
        });
    });

    it('should reject data that is not an image', function () {
        expect(
            readImageInfo(Buffer.from('<html><script>alert(1)</script></html>'))
        ).toBeUndefined();
        expect(readImageInfo(Buffer.alloc(0))).toBeUndefined();
        expect(readImageInfo({})).toBeUndefined();
    });

    it('should reject an image whose header is cut short', async function () {
        const image = await new Jimp({ width: 200, height: 150 }).getBuffer('image/jpeg');

        expect(readImageInfo(image.subarray(0, 12))).toBeUndefined();
        expect(readImageInfo(Buffer.from([0x89, 0x50, 0x4e, 0x47]))).toBeUndefined();
    });
});
