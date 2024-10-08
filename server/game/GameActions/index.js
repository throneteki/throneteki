import AbilityAdapter from './AbilityAdapter.js';
import AddToChallenge from './AddToChallenge.js';
import AddToHand from './AddToHand.js';
import ApplyClaim from './ApplyClaim.js';
import CancelEffects from './CancelEffects.js';
import CheckReserve from './CheckReserve.js';
import ChooseGameAction from './ChooseGameAction.js';
import DiscardAtRandom from './DiscardAtRandom.js';
import DiscardCard from './DiscardCard.js';
import DiscardToken from './DiscardToken.js';
import DiscardTopCards from './DiscardTopCards.js';
import DiscardPower from './DiscardPower.js';
import DrawCards from './DrawCards.js';
import DrawSpecific from './DrawSpecific.js';
import GainGold from './GainGold.js';
import GainIcon from './GainIcon.js';
import GainPower from './GainPower.js';
import HandlerGameActionWrapper from './HandlerGameActionWrapper.js';
import IfGameAction from './IfGameAction.js';
import Kill from './Kill.js';
import KneelCard from './KneelCard.js';
import LookAtDeck from './LookAtDeck.js';
import LookAtHand from './LookAtHand.js';
import lookAtShadows from './LookAtShadows.js';
import LoseIcon from './LoseIcon.js';
import MayGameAction from './MayGameAction.js';
import MovePower from './MovePower.js';
import PlaceCard from './PlaceCard.js';
import PlaceCardUnderneath from './PlaceCardUnderneath.js';
import PlaceToken from './PlaceToken.js';
import PutIntoShadows from './PutIntoShadows.js';
import PutIntoPlay from './PutIntoPlay.js';
import RemoveFromChallenge from './RemoveFromChallenge.js';
import RemoveFromGame from './RemoveFromGame.js';
import ReturnCardToDeck from './ReturnCardToDeck.js';
import ReturnCardToHand from './ReturnCardToHand.js';
import ReturnGoldToTreasury from './ReturnGoldToTreasury.js';
import RevealCards from './RevealCards.js';
import RevealTopCards from './RevealTopCards.js';
import SacrificeCard from './SacrificeCard.js';
import Search from './Search.js';
import Shuffle from './Shuffle.js';
import ShuffleIntoDeck from './ShuffleIntoDeck.js';
import SimultaneousAction from './SimultaneousAction.js';
import StandCard from './StandCard.js';
import TakeControl from './TakeControl.js';

const GameActions = {
    addToChallenge: (props) => new AbilityAdapter(AddToChallenge, props),
    addToHand: (props) => new AbilityAdapter(AddToHand, props),
    applyClaim: (props) => new AbilityAdapter(ApplyClaim, props),
    cancelEffects: (props) => new AbilityAdapter(CancelEffects, props),
    checkReserve: (props) => new AbilityAdapter(CheckReserve, props),
    choose: (props) => new ChooseGameAction(props),
    discardAtRandom: (props) => new AbilityAdapter(DiscardAtRandom, props),
    discardCard: (props) => new AbilityAdapter(DiscardCard, props),
    discardToken: (props) => new AbilityAdapter(DiscardToken, props),
    discardTopCards: (props) => new AbilityAdapter(DiscardTopCards, props),
    discardPower: (props) => new AbilityAdapter(DiscardPower, props),
    drawCards: (props) => new AbilityAdapter(DrawCards, props),
    drawSpecific: (props) => new AbilityAdapter(DrawSpecific, props),
    gainGold: (props) => new AbilityAdapter(GainGold, props),
    gainIcon: (props) => new AbilityAdapter(GainIcon, props),
    gainPower: (props) => new AbilityAdapter(GainPower, props),
    genericHandler: (handler) => new HandlerGameActionWrapper({ handler }),
    ifCondition: (props) => new IfGameAction(props),
    kill: (props) => new AbilityAdapter(Kill, props),
    kneelCard: (props) => new AbilityAdapter(KneelCard, props),
    lookAtDeck: (props) => new AbilityAdapter(LookAtDeck, props),
    lookAtHand: (props) => new AbilityAdapter(LookAtHand, props),
    lookAtShadows: (props) => new AbilityAdapter(lookAtShadows, props),
    loseIcon: (props) => new AbilityAdapter(LoseIcon, props),
    may: (props) => new MayGameAction(props),
    movePower: (props) => new AbilityAdapter(MovePower, props),
    placeCard: (props) => new AbilityAdapter(PlaceCard, props),
    placeCardUnderneath: (props) => new AbilityAdapter(PlaceCardUnderneath, props),
    placeToken: (props) => new AbilityAdapter(PlaceToken, props),
    putIntoPlay: (props) => new AbilityAdapter(PutIntoPlay, props),
    putIntoShadows: (props) => new AbilityAdapter(PutIntoShadows, props),
    removeFromChallenge: (props) => new AbilityAdapter(RemoveFromChallenge, props),
    removeFromGame: (props) => new AbilityAdapter(RemoveFromGame, props),
    returnCardToDeck: (props) => new AbilityAdapter(ReturnCardToDeck, props),
    returnCardToHand: (props) => new AbilityAdapter(ReturnCardToHand, props),
    returnGoldToTreasury: (props) => new AbilityAdapter(ReturnGoldToTreasury, props),
    revealCards: (props) => new AbilityAdapter(RevealCards, props),
    revealTopCards: (props) => new AbilityAdapter(RevealTopCards, props),
    sacrificeCard: (props) => new AbilityAdapter(SacrificeCard, props),
    search: (props) => new AbilityAdapter(new Search(props), (context) => ({ context })),
    shuffle: (props) => new AbilityAdapter(Shuffle, props),
    shuffleIntoDeck: (props) => new AbilityAdapter(ShuffleIntoDeck, props),
    simultaneously: function (actions) {
        return new SimultaneousAction(actions);
    },
    standCard: (props) => new AbilityAdapter(StandCard, props),
    takeControl: (props) => new AbilityAdapter(TakeControl, props)
};

export default GameActions;
