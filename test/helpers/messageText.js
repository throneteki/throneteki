import Message from '../../server/game/Message.js';

export function messageText(message) {
    return Message.format('{0}', message)
        .map((part) => (part && typeof part === 'object' ? (part.label ?? part.name) : part))
        .join('');
}
