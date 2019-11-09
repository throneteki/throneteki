const AbilityAdapter = require('./AbilityAdapter');
const DiscardCard = require('./DiscardCard');
const DiscardPower = require('./DiscardPower');
const DrawCards = require('./DrawCards');
const GainGold = require('./GainGold');
const GainPower = require('./GainPower');
const KneelCard = require('./KneelCard');
const LookAtDeck = require('./LookAtDeck');
const LookAtHand = require('./LookAtHand');
const MovePower = require('./MovePower');
const PlaceToken = require('./PlaceToken');
const RemoveFromGame = require('./RemoveFromGame');
const ReturnCardToHand = require('./ReturnCardToHand');
const ReturnGoldToTreasury = require('./ReturnGoldToTreasury');
const RevealCard = require('./RevealCard');
const SacrificeCard = require('./SacrificeCard');
const SimultaneousAction = require('./SimultaneousAction');
const StandCard = require('./StandCard');
const TakeControl = require('./TakeControl');

const GameActions = {
    discardCard: props => new AbilityAdapter(DiscardCard, props),
    discardPower: props => new AbilityAdapter(DiscardPower, props),
    drawCards: props => new AbilityAdapter(DrawCards, props),
    gainGold: props => new AbilityAdapter(GainGold, props),
    gainPower: props => new AbilityAdapter(GainPower, props),
    kneelCard: props => new AbilityAdapter(KneelCard, props),
    lookAtDeck: props => new AbilityAdapter(LookAtDeck, props),
    lookAtHand: props => new AbilityAdapter(LookAtHand, props),
    movePower: props => new AbilityAdapter(MovePower, props),
    placeToken: props => new AbilityAdapter(PlaceToken, props),
    removeFromGame: props => new AbilityAdapter(RemoveFromGame, props),
    returnCardToHand: props => new AbilityAdapter(ReturnCardToHand, props),
    returnGoldToTreasury: props => new AbilityAdapter(ReturnGoldToTreasury, props),
    revealCard: props => new AbilityAdapter(RevealCard, props),
    sacrificeCard: props => new AbilityAdapter(SacrificeCard, props),
    simultaneously: function(actions) {
        return new SimultaneousAction(actions);
    },
    standCard: props => new AbilityAdapter(StandCard, props),
    takeControl: props => new AbilityAdapter(TakeControl, props)
};

module.exports = GameActions;
