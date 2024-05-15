import CostBuilder from './CostBuilder.js';
import DiscardDuplicateCost from './DiscardDuplicateCost.js';
import DiscardFromHandCost from './DiscardFromHandCost.js';
import DiscardFromShadowsCost from './DiscardFromShadowsCost.js';
import DiscardPowerCost from './DiscardPowerCost.js';
import DiscardTokenCost from './DiscardTokenCost.js';
import KillCost from './KillCost.js';
import KneelCost from './KneelCost.js';
import PlaceInDeadPileFromHandCost from './PlaceInDeadPileFromHandCost.js';
import PlaceOnBottomCost from './PlaceOnBottomCost.js';
import PutIntoPlayCost from './PutIntoPlayCost.js';
import PutIntoShadowsCost from './PutIntoShadowsCost.js';
import RemoveFromChallengeCost from './RemoveFromChallengeCost.js';
import RemoveFromGameCost from './RemoveFromGameCost.js';
import ReturnToHandCost from './ReturnToHandCost.js';
import RevealCost from './RevealCost.js';
import SacrificeCost from './SacrificeCost.js';
import StandCost from './StandCost.js';
import ShuffleCardIntoDeckCost from './ShuffleCardIntoDeckCost.js';

const CostBuilders = {
    discardDuplicate: new CostBuilder(new DiscardDuplicateCost(), {
        select: 'Select duplicate to discard',
        selectMultiple: (number) => `Select ${number} duplicates to discard`
    }),
    discardFromHand: new CostBuilder(new DiscardFromHandCost(), {
        select: 'Select card to discard from hand',
        selectMultiple: (number) => `Select ${number} cards to discard from hand`
    }),
    discardFromShadows: new CostBuilder(new DiscardFromShadowsCost(), {
        select: 'Select card to discard from shadows',
        selectMultiple: (number) => `Select ${number} cards to discard from shadows`
    }),
    discardPower: function (amount = 1) {
        return new CostBuilder(new DiscardPowerCost(amount), {
            select: `Select card to discard ${amount} power`,
            selectMultiple: (number) => `Select ${number} cards to discard ${amount} power`
        });
    },
    discardToken: function (token, amount = 1) {
        return new CostBuilder(new DiscardTokenCost(token, amount), {
            select: `Select card to discard ${amount} ${token}`,
            selectMultiple: (number) => `Select ${number} cards to discard ${amount} ${token}`
        });
    },
    kill: new CostBuilder(new KillCost(), {
        select: 'Select card to kill',
        selectMultiple: (number) => `Select ${number} cards to kill`
    }),
    kneel: new CostBuilder(new KneelCost(), {
        select: 'Select card to kneel',
        selectMultiple: (number) => `Select ${number} cards to kneel`,
        selectAny: 'Select any number of cards to kneel'
    }),
    placeInDeadPileFromHand: new CostBuilder(new PlaceInDeadPileFromHandCost(), {
        select: 'Select card to place into dead pile',
        selectMultiple: (number) => `Select ${number} cards to place into dead pile`
    }),
    placeOnBottomFromHand: new CostBuilder(new PlaceOnBottomCost(), {
        select: 'Select card to place on bottom',
        selectMultiple: (number) => `Select ${number} cards to place on bottom`
    }),
    putIntoPlay: new CostBuilder(new PutIntoPlayCost(), {
        select: 'Select card to put into play',
        selectMultiple: (number) => `Select ${number} cards to put into play`
    }),
    putIntoShadows: new CostBuilder(new PutIntoShadowsCost(), {
        select: 'Select card to put into shadows',
        selectMultiple: (number) => `Select ${number} cards to put into shadows`
    }),
    removeFromChallenge: new CostBuilder(new RemoveFromChallengeCost(), {
        select: 'Select card to remove from challenge',
        selectMultiple: (number) => `Select ${number} cards to remove from challenge`
    }),
    removeFromGame: new CostBuilder(new RemoveFromGameCost(), {
        select: 'Select card to remove from game',
        selectMultiple: (number) => `Select ${number} cards to remove from game`
    }),
    returnToHand: new CostBuilder(new ReturnToHandCost(), {
        select: 'Select card to return to hand',
        selectMultiple: (number) => `Select ${number} cards to return to hand`
    }),
    reveal: new CostBuilder(new RevealCost(), {
        select: 'Select card to reveal',
        selectMultiple: (number) => `Select ${number} cards to reveal`,
        selectUpTo: (number) => `Select up to ${number} cards to reveal`
    }),
    sacrifice: new CostBuilder(new SacrificeCost(), {
        select: 'Select card to sacrifice',
        selectMultiple: (number) => `Select ${number} cards to sacrifice`,
        selectAny: 'Select any number of cards to sacrifice'
    }),
    stand: new CostBuilder(new StandCost(), {
        select: 'Select card to stand',
        selectMultiple: (number) => `Select ${number} cards to stand`
    }),
    shuffleCardIntoDeck: new CostBuilder(new ShuffleCardIntoDeckCost(), {
        select: 'Select a card to shuffle back into the deck',
        selectMultiple: (number) => `Select ${number} cards to shuffle back into the deck`,
        selectAny: 'Select any number of cards to shuffle back into the deck'
    })
};

export default CostBuilders;
