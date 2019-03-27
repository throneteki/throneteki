class AbilityMessage {
    static create(formatOrProperties) {
        class NullValue {
            output() {
                // no-op.
            }
        }

        class FunctionAdapter {
            constructor(outputFunc) {
                this.outputFunc = outputFunc;
            }

            output(outputter, context) {
                this.outputFunc(context);
            }
        }

        if(!formatOrProperties) {
            return new NullValue();
        }

        if(typeof(formatOrProperties) === 'function') {
            return new FunctionAdapter(formatOrProperties);
        }

        if(typeof(formatOrProperties) === 'string') {
            return new AbilityMessage({ format: formatOrProperties });
        }

        return new AbilityMessage(formatOrProperties);
    }

    constructor(properties) {
        this.args = properties.args || {};
        this.format = this.translateNamedArgs(properties.format, this.args);
        this.type = properties.type || 'message';

        this.validateNamedArgs(properties.format, this.args);
    }

    translateNamedArgs(format, args) {
        let result = format;
        let index = 0;

        for(let argName of this.getDefinedArgNames(args)) {
            result = result.replace(new RegExp(`\\{${argName}\\}`, 'g'), `{${index}}`);
            ++index;
        }

        return result;
    }

    validateNamedArgs(format, args) {
        let definedArgNames = this.getDefinedArgNames(args);
        let usedArgNames = this.getUsedArgNames(format);
        let undefinedArgNames = usedArgNames.filter(argName => !definedArgNames.includes(argName));

        if(undefinedArgNames.length !== 0) {
            throw new Error(`Undefined argument names for ability message: ${ undefinedArgNames.join(', ') }`);
        }
    }

    getUsedArgNames(format) {
        let result = [];
        let namedArgRegex = /{(\w+)}/g;
        let match;

        while((match = namedArgRegex.exec(format)) !== null) {
            result.push(match[1]);
        }

        return result;
    }

    getDefinedArgNames(args) {
        return ['player', 'source', 'target'].concat(Object.keys(args));
    }

    output(outputter, context) {
        let args = this.generateArgValues(context);

        if(this.type === 'message') {
            outputter.addMessage(this.format, ...args);
        } else {
            outputter.addAlert(this.type, this.format, ...args);
        }
    }

    generateArgValues(context) {
        let customArgs = Object.values(this.args).map(argFunc => argFunc(context));

        return [context.player, context.source, context.target].concat(customArgs);
    }
}

module.exports = AbilityMessage;
