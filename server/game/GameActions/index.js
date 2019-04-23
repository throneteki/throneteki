const AbilityAdapter = require('./AbilityAdapter');
const DiscardCard = require('./DiscardCard');
const LookAtHand = require('./LookAtHand');
const RemoveFromGame = require('./RemoveFromGame');
const SacrificeCard = require('./SacrificeCard');
const SimultaneousAction = require('./SimultaneousAction');

const GameActions = {
    discardCard: props => new AbilityAdapter(DiscardCard, props),
    lookAtHand: props => new AbilityAdapter(LookAtHand, props),
    removeFromGame: props => new AbilityAdapter(RemoveFromGame, props),
    sacrificeCard: props => new AbilityAdapter(SacrificeCard, props),
    simultaneously: function(actions) {
        return new SimultaneousAction(actions);
    }
};

module.exports = GameActions;
