import Spectator from './spectator.js';
import Message from './Message.js';

class GameChat {
    constructor() {
        this.messages = [];
    }

    addChatMessage(format, player, message) {
        let args = [
            { name: player.name, argType: 'player', role: player.user && player.user.role },
            message
        ];
        let formattedMessage = this.formatMessage(format, args);

        this.messages.push({ date: new Date(), message: formattedMessage });
    }

    getFormattedMessage(message) {
        let args = Array.from(arguments).slice(1);
        let argList = args.map((arg) => {
            if (arg instanceof Spectator) {
                return { name: arg.name, argType: 'nonAvatarPlayer', role: arg.role };
            } else if (arg && arg.name && arg.argType === 'player') {
                return { name: arg.name, argType: arg.argType, role: arg.role };
            }

            return arg;
        });

        return this.formatMessage(message, argList);
    }

    addMessage(message, ...args) {
        let formattedMessage = this.getFormattedMessage(message, ...args);

        this.messages.push({ date: new Date(), message: formattedMessage });
    }

    addAlert(type, message, ...args) {
        let formattedMessage = this.getFormattedMessage(message, ...args);

        this.messages.push({
            date: new Date(),
            message: { alert: { type: type, message: formattedMessage } }
        });
    }

    formatMessage(format, args) {
        if (!format || typeof format !== 'string') {
            return '';
        }

        return Message.format(format, ...args);
    }
}

export default GameChat;
