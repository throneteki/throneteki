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

        this.messages.push({
            date: new Date(),
            message: formattedMessage,
            structuredMessage: Message.structured(format, ...args)
        });
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

        this.messages.push({
            date: new Date(),
            message: formattedMessage,
            structuredMessage: this.getStructuredMessage(message, args)
        });
    }

    addAlert(type, message, ...args) {
        let formattedMessage = this.getFormattedMessage(message, ...args);

        this.messages.push({
            date: new Date(),
            message: { alert: { type: type, message: formattedMessage } },
            structuredMessage: {
                alert: { type, message: this.getStructuredMessage(message, args) }
            }
        });
    }

    getStructuredMessage(message, args) {
        let argList = args.map((arg) => {
            if (arg instanceof Spectator) {
                return { name: arg.name, argType: 'nonAvatarPlayer', role: arg.role };
            } else if (arg && arg.name && arg.argType === 'player') {
                return { name: arg.name, argType: arg.argType, role: arg.role };
            }

            return arg;
        });

        return Message.structured(message, ...argList);
    }

    formatMessage(format, args) {
        if (!format || typeof format !== 'string') {
            return '';
        }

        return Message.format(format, ...args);
    }
}

export default GameChat;
