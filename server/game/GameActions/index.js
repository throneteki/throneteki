const AbilityAdapter = require('./AbilityAdapter');
const DiscardCard = require('./DiscardCard');
const RemoveFromGame = require('./RemoveFromGame');
const SacrificeCard = require('./SacrificeCard');
const SimultaneousAction = require('./SimultaneousAction');

const GameActions = {
    discardCard: props => new AbilityAdapter(DiscardCard, props),
    removeFromGame: props => new AbilityAdapter(RemoveFromGame, props),
    sacrificeCard: props => new AbilityAdapter(SacrificeCard, props),
    simultaneously: function(actions) {
        return new SimultaneousAction(actions);
    }
};

module.exports = GameActions;
