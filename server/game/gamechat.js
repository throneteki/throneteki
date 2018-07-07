const BaseCard = require('./basecard.js');
const Spectator = require('./spectator.js');

class GameChat {
    constructor() {
        this.messages = [];
    }

    addChatMessage(message) {
        let args = Array.from(arguments).slice(1);
        let formattedMessage = this.formatMessage(message, args);

        this.messages.push({ date: new Date(), message: formattedMessage });
    }

    getFormattedMessage(message) {
        let args = Array.from(arguments).slice(1);
        let argList = args.map(arg => {
            if(arg instanceof Spectator) {
                return { name: arg.name, argType: 'nonAvatarPlayer' };
            } else if(arg && arg.name && arg.argType === 'player') {
                return { name: arg.name, argType: arg.argType };
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

        this.messages.push({ date: new Date(), message: { alert: { type: type, message: formattedMessage } } });
    }

    formatMessage(format, args) {
        if(!format || typeof (format) !== 'string') {
            return '';
        }

        let messageFragments = format.split(/(\{\d+\})/);
        let returnedFraments = [];

        for(const fragment of messageFragments) {
            let argMatch = fragment.match(/\{(\d+)\}/);
            if(argMatch) {
                let arg = args[argMatch[1]];
                if(arg || arg === 0) {
                    if(Array.isArray(arg)) {
                        returnedFraments.push(this.formatArray(arg));
                    } else if(arg instanceof BaseCard) {
                        returnedFraments.push({ code: arg.code, label: arg.name, type: arg.getType(), argType: 'card' });
                    } else if(arg instanceof Spectator) {
                        returnedFraments.push({ name: arg.user.username, argType: 'player' });
                    } else {
                        returnedFraments.push(arg);
                    }
                }

                continue;
            }

            if(fragment) {
                returnedFraments.push(fragment);
            }
        }

        return returnedFraments;
    }

    formatArray(array) {
        if(array.length === 0) {
            return '';
        }

        let format;

        if(array.length === 1) {
            format = '{0}';
        } else if(array.length === 2) {
            format = '{0} and {1}';
        } else {
            let range = [...Array(array.length).keys()].map(i => '{' + i + '}');
            format = range.join(', ') + ', and {' + (array.length - 1) + '}';
        }

        return { message: this.formatMessage(format, array) };
    }
}

module.exports = GameChat;
