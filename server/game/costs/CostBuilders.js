const CostBuilder = require('./CostBuilder.js');
const DiscardFromHandCost = require('./DiscardFromHandCost.js');
const DiscardPowerCost = require('./DiscardPowerCost.js');
const DiscardTokenCost = require('./DiscardTokenCost.js');
const KillCost = require('./KillCost.js');
const KneelCost = require('./KneelCost.js');
const PutIntoPlayCost = require('./PutIntoPlayCost.js');
const RemoveFromChallengeCost = require('./RemoveFromChallengeCost.js');
const RemoveFromGameCost = require('./RemoveFromGameCost.js');
const ReturnToHandCost = require('./ReturnToHandCost.js');
const RevealCost = require('./RevealCost.js');
const SacrificeCost = require('./SacrificeCost.js');
const StandCost = require('./StandCost.js');

const CostBuilders = {
    discardFromHand: new CostBuilder(new DiscardFromHandCost(), {
        select: 'Select card to discard from hand',
        selectMultiple: number => `Select ${number} cards to discard from hand`
    }),
    discardPower: function(amount = 1) {
        return new CostBuilder(new DiscardPowerCost(amount), {
            select: `Select card to discard ${amount} power`,
            selectMultiple: number => `Select ${number} cards to discard ${amount} power`
        });
    },
    discardToken: function(token, amount = 1) {
        return new CostBuilder(new DiscardTokenCost(token, amount), {
            select: `Select card to discard ${amount} ${token}`,
            selectMultiple: number => `Select ${number} cards to discard ${amount} ${token}`
        });
    },
    kill: new CostBuilder(new KillCost(), {
        select: 'Select card to kill',
        selectMultiple: number => `Select ${number} cards to kill`
    }),
    kneel: new CostBuilder(new KneelCost(), {
        select: 'Select card to kneel',
        selectMultiple: number => `Select ${number} cards to kneel`,
        selectAny: 'Select any number of cards to kneel'
    }),
    putIntoPlay: new CostBuilder(new PutIntoPlayCost(), {
        select: 'Select card to put into play',
        selectMultiple: number => `Select ${number} cards to put into play`
    }),
    removeFromChallenge: new CostBuilder(new RemoveFromChallengeCost(), {
        select: 'Select card to remove from challenge',
        selectMultiple: number => `Select ${number} cards to remove from challenge`
    }),
    removeFromGame: new CostBuilder(new RemoveFromGameCost(), {
        select: 'Select card to remove from game',
        selectMultiple: number => `Select ${number} cards to remove from game`
    }),
    returnToHand: new CostBuilder(new ReturnToHandCost(), {
        select: 'Select card to return to hand',
        selectMultiple: number => `Select ${number} cards to return to hand`
    }),
    reveal: new CostBuilder(new RevealCost(), {
        select: 'Select card to reveal',
        selectMultiple: number => `Select ${number} cards to reveal`
    }),
    sacrifice: new CostBuilder(new SacrificeCost(), {
        select: 'Select card to sacrifice',
        selectMultiple: number => `Select ${number} cards to sacrifice`
    }),
    stand: new CostBuilder(new StandCost(), {
        select: 'Select card to stand',
        selectMultiple: number => `Select ${number} cards to stand`
    })
};

module.exports = CostBuilders;
