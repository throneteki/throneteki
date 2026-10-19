import Event from './event.js';
import { Events, Notifications } from './Constants/Events.js';

const Suffixes = new Set([
    'aggregate',
    'cancelinterrupt',
    'forcedinterrupt',
    'forcedreaction',
    'interrupt',
    'reaction',
    'whenrevealed'
]);
const KnownNames = new Set(Notifications);

function isInternal(name) {
    return name.startsWith('_');
}

function splitName(fullName) {
    const [name, ...suffixes] = fullName.split(':');
    return { name, suffixes };
}

export function checkEventName(fullName) {
    if (typeof fullName !== 'string') {
        return;
    }

    const { name, suffixes } = splitName(fullName);
    if (isInternal(name)) {
        return;
    }

    if (!Events[name] && !KnownNames.has(fullName)) {
        throw new Error(
            `Unknown event '${fullName}'. Add it to server/game/Constants/Events.js if it is new.`
        );
    }

    const badSuffix = suffixes.find((suffix) => !Suffixes.has(suffix));
    if (badSuffix) {
        throw new Error(`Unknown event window '${badSuffix}' in '${fullName}'.`);
    }
}

export function checkEventParams(event) {
    const { name, suffixes } = splitName(event.name);
    const definition = Events[name];
    if (isInternal(name) || !definition || suffixes.includes('aggregate')) {
        return;
    }

    const optional = definition.optional || {};
    const keys = Object.keys(event.params || {});
    const missing = Object.keys(definition.params).filter((key) => !keys.includes(key));
    const unknown = keys.filter((key) => !(key in definition.params) && !(key in optional));

    if (missing.length > 0 || unknown.length > 0) {
        const problems = [
            missing.length > 0 && `missing ${missing.join(', ')}`,
            unknown.length > 0 && `unexpected ${unknown.join(', ')}`
        ].filter(Boolean);
        throw new Error(
            `Event '${name}' has the wrong parameters (${problems.join('; ')}). ` +
                'Its entry is in server/game/Constants/Events.js.'
        );
    }
}

export class EventValidator {
    constructor() {
        this.checked = new WeakSet();
    }

    checkListener(name) {
        checkEventName(name);
    }

    checkEmit(name, payload) {
        checkEventName(name);

        if (payload instanceof Event && !this.checked.has(payload)) {
            this.checked.add(payload);
            checkEventParams(payload);
        }
    }
}
