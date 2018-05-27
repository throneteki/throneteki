const BaseAbility = require('../baseability');

class CustomPlayAction extends BaseAbility {
    constructor(properties) {
        super(properties);
        this.condition = properties.condition || (() => true);
        this.handler = properties.handler;
        this.title = properties.title;
    }

    meetsRequirements(context) {
        return this.condition(context);
    }

    executeHandler(context) {
        this.handler(context);
    }

    //This classification might need to be reviewed in the future, but with Lady-in-Waiting being the
    //only card making use of this functionality currently, it fits.
    isCardAbility() {
        return false;
    }
}

module.exports = CustomPlayAction;
