import flatten from '../Array.js';
class Message {
    static fragment(format, ...args) {
        if(args.length === 1 && !format.includes('{0}')) {
            return new Message({ format, args: args[0] });
        }

        return new Message({ format, args });
    }

    static format(format, ...args) {
        return this.fragment(format, ...args).flatten();
    }

    constructor({ format, args }) {
        this.format = format;
        this.args = args;
    }

    flatten() {
        let messageFragments = this.format.split(/(\{\w+\})/);
        let returnedFraments = [];

        for(const fragment of messageFragments) {
            let argMatch = fragment.match(/\{(\w+)\}/);
            if(argMatch) {
                let arg = this.args[argMatch[1]];
                if(arg || arg === 0) {
                    returnedFraments.push(this.formatArg(arg));
                }
            } else if(fragment) {
                returnedFraments.push(fragment);
            }
        }

        return flatten(returnedFraments);
    }

    formatArg(arg) {
        const BaseCard = require('./basecard');
        const Spectator = require('./spectator');

        if(Array.isArray(arg)) {
            return this.formatArray(arg);
        } else if(arg instanceof BaseCard) {
            if(arg.facedown) {
                return 'a facedown card';
            }
            return { code: arg.code, label: arg.name, type: arg.getType(), argType: 'card' };
        } else if(arg instanceof Spectator) {
            return { name: arg.name, argType: 'nonAvatarPlayer' };
        } else if(arg instanceof Message) {
            return arg.flatten();
        }

        return arg;
    }

    formatArray(arg) {
        if(arg.length === 0) {
            return '';
        }

        const result = [this.formatArg(arg[0])];
        for(let i = 1; i < arg.length; ++i) {
            result.push(i === arg.length - 1 ? ', and ' : ', ');
            result.push(this.formatArg(arg[i]));
        }
        return result;
    }
}

export default Message;
