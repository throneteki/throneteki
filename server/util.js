export function escapeRegex(regex) {
    return regex.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}

export function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
}

export function detectBinary(state, path = '', results = []) {
    const allowedTypes = ['Array', 'Boolean', 'Date', 'Number', 'Object', 'String'];

    if (!state) {
        return results;
    }

    let type = state.constructor.name;

    if (!allowedTypes.includes(type)) {
        results.push({ path: path, type: type });
    }

    if (type === 'Object') {
        for (let key in state) {
            detectBinary(state[key], `${path}.${key}`, results);
        }
    } else if (type === 'Array') {
        for (let i = 0; i < state.length; ++i) {
            detectBinary(state[i], `${path}[${i}]`, results);
        }
    }

    return results;
}

/**
 * Strips the parts of an event that should only be visible to event managers (e.g. the game
 * password applied to event games) so it can be sent to any client.
 */
export function getPublicEvent(event) {
    if (!event || !event.eventGameOptions) {
        return event;
    }

    // eslint-disable-next-line no-unused-vars
    const { password, ...eventGameOptions } = event.eventGameOptions;

    return {
        ...event,
        eventGameOptions: { ...eventGameOptions, hasPassword: !!password }
    };
}
