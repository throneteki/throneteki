const PngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function readPng(buffer) {
    if (buffer.length < 24 || !buffer.subarray(0, 8).equals(PngSignature)) {
        return undefined;
    }

    if (buffer.toString('ascii', 12, 16) !== 'IHDR') {
        return undefined;
    }

    return { type: 'image/png', width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

const JpegFrameMarkers = new Set([
    0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf
]);

function readJpeg(buffer) {
    if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
        return undefined;
    }

    let offset = 2;
    while (offset + 4 <= buffer.length) {
        if (buffer[offset] !== 0xff) {
            return undefined;
        }

        const marker = buffer[offset + 1];
        if (marker === 0xff) {
            offset++;
            continue;
        }

        if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
            offset += 2;
            continue;
        }

        const length = buffer.readUInt16BE(offset + 2);
        if (JpegFrameMarkers.has(marker)) {
            if (offset + 9 > buffer.length) {
                return undefined;
            }

            return {
                type: 'image/jpeg',
                width: buffer.readUInt16BE(offset + 7),
                height: buffer.readUInt16BE(offset + 5)
            };
        }

        offset += 2 + length;
    }

    return undefined;
}

function readWebp(buffer) {
    if (
        buffer.length < 30 ||
        buffer.toString('ascii', 0, 4) !== 'RIFF' ||
        buffer.toString('ascii', 8, 12) !== 'WEBP'
    ) {
        return undefined;
    }

    const chunk = buffer.toString('ascii', 12, 16);

    if (chunk === 'VP8 ') {
        if (buffer[23] !== 0x9d || buffer[24] !== 0x01 || buffer[25] !== 0x2a) {
            return undefined;
        }

        return {
            type: 'image/webp',
            width: buffer.readUInt16LE(26) & 0x3fff,
            height: buffer.readUInt16LE(28) & 0x3fff
        };
    }

    if (chunk === 'VP8L') {
        if (buffer[20] !== 0x2f) {
            return undefined;
        }

        const bits = buffer.readUInt32LE(21);

        return {
            type: 'image/webp',
            width: (bits & 0x3fff) + 1,
            height: ((bits >>> 14) & 0x3fff) + 1
        };
    }

    if (chunk === 'VP8X') {
        return {
            type: 'image/webp',
            width: buffer.readUIntLE(24, 3) + 1,
            height: buffer.readUIntLE(27, 3) + 1
        };
    }

    return undefined;
}

export const SupportedImageTypes = ['image/png', 'image/jpeg', 'image/webp'];

export function readImageInfo(buffer) {
    if (!Buffer.isBuffer(buffer)) {
        return undefined;
    }

    const info = readPng(buffer) || readJpeg(buffer) || readWebp(buffer);

    if (!info || info.width < 1 || info.height < 1) {
        return undefined;
    }

    return info;
}
