const AmbushCardAction = require('./AmbushCardAction');
const MarshalCardAction = require('./MarshalCardAction');
const MarshalIntoShadowsAction = require('./MarshalIntoShadowsAction');
const OutOfShadowsAction = require('./OutOfShadowsAction');
const SetupCardAction = require('./SetupCardAction');
const SetupInShadowsAction = require('./SetupInShadowsAction');

module.exports = [
    new AmbushCardAction(),
    new MarshalCardAction(),
    new MarshalIntoShadowsAction(),
    new OutOfShadowsAction(),
    new SetupCardAction(),
    new SetupInShadowsAction()
];
