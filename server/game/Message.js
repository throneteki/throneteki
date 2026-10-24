import { flatten } from '../Array.js';
import BaseCard from './basecard.js';
import Spectator from './spectator.js';

class Message {
    static fragment(format, ...args) {
        if (args.length === 1 && !format.includes('{0}')) {
            return new Message({ format, args: args[0] });
        }

        return new Message({ format, args });
    }

    static format(format, ...args) {
        return this.fragment(format, ...args).flatten();
    }

    static structured(format, ...args) {
        return this.fragment(format, ...args).toStructured();
    }

    constructor({ format, args }) {
        this.format = format;
        this.args = args;
    }

    flatten() {
        let messageFragments = this.format.split(/(\{\w+\})/);
        let returnedFraments = [];

        for (const fragment of messageFragments) {
            let argMatch = fragment.match(/\{(\w+)\}/);
            if (argMatch) {
                let arg = this.args[argMatch[1]];
                if (arg || arg === 0) {
                    returnedFraments.push(this.formatArg(arg));
                }
            } else if (fragment) {
                returnedFraments.push(fragment);
            }
        }

        return flatten(returnedFraments);
    }

    toStructured() {
        return { format: this.format, args: this.snapshot(this.args) };
    }

    snapshot(value, depth = 0) {
        if (
            value === null ||
            value === undefined ||
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean'
        ) {
            return value;
        }
        if (depth > 8) {
            return '[nested value]';
        }
        if (Array.isArray(value)) {
            return value.map((item) => this.snapshot(item, depth + 1));
        }
        if (value instanceof BaseCard) {
            return value.facedown
                ? 'a facedown card'
                : { code: value.code, label: value.name, type: value.getType(), argType: 'card' };
        }
        if (value instanceof Spectator) {
            return { name: value.name, argType: 'nonAvatarPlayer' };
        }
        if (value instanceof Message) {
            return value.toStructured();
        }
        if (Object.getPrototypeOf(value) === Object.prototype) {
            const displayKeys = ['name', 'argType', 'role', 'code', 'label', 'type', 'link'];
            return Object.fromEntries(
                displayKeys
                    .filter((key) => Object.hasOwn(value, key))
                    .map((key) => [key, this.snapshot(value[key], depth + 1)])
            );
        }
        return String(value);
    }

    formatArg(arg) {
        if (Array.isArray(arg)) {
            return this.formatArray(arg);
        } else if (arg instanceof BaseCard) {
            if (arg.facedown) {
                return 'a facedown card';
            }
            return { code: arg.code, label: arg.name, type: arg.getType(), argType: 'card' };
        } else if (arg instanceof Spectator) {
            return { name: arg.name, argType: 'nonAvatarPlayer' };
        } else if (arg instanceof Message) {
            return arg.flatten();
        }

        return arg;
    }

    formatArray(arg) {
        if (arg.length === 0) {
            return '';
        }

        const result = [this.formatArg(arg[0])];
        const lastSeparator = arg.length === 2 ? ' and ' : ', and ';
        for (let i = 1; i < arg.length; ++i) {
            result.push(i === arg.length - 1 ? lastSeparator : ', ');
            result.push(this.formatArg(arg[i]));
        }
        return result;
    }
}

export default Message;
