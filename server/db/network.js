import net from 'net';

export function toInet(value) {
    return typeof value === 'string' && net.isIP(value) ? value : null;
}

export function toCidr(value) {
    if (typeof value !== 'string') {
        return null;
    }

    const [address, prefix, extra] = value.split('/');
    const version = net.isIP(address);
    const bits = Number(prefix);

    if (
        !version ||
        extra !== undefined ||
        !/^\d+$/.test(prefix || '') ||
        bits > (version === 4 ? 32 : 128)
    ) {
        return null;
    }

    return value;
}
