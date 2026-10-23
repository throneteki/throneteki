import AbilityAdapter from './AbilityAdapter.js';
import AddDelayedEffect from './AddDelayedEffect.js';
import AddPhase from './AddPhase.js';
import AddToChallenge from './AddToChallenge.js';
import AddToHand from './AddToHand.js';
import ApplyClaim from './ApplyClaim.js';
import ApplyLastingEffect from './ApplyLastingEffect.js';
import Attach from './Attach.js';
import CancelEffects from './CancelEffects.js';
import ChangeClaimType from './ChangeClaimType.js';
import ChangeEventAmount from './ChangeEventAmount.js';
import CheckReserve from './CheckReserve.js';
import ChooseCards from './ChooseCards.js';
import ChooseGameAction from './ChooseGameAction.js';
import ChooseChallengeType from './ChooseChallengeType.js';
import ChooseIcon from './ChooseIcon.js';
import DetermineDominance from './DetermineDominance.js';
import DiscardAtRandom from './DiscardAtRandom.js';
import DiscardCard from './DiscardCard.js';
import DiscardToken from './DiscardToken.js';
import DiscardTopCards from './DiscardTopCards.js';
import DiscardPower from './DiscardPower.js';
import DrawCards from './DrawCards.js';
import DrawSpecific from './DrawSpecific.js';
import EndChallenge from './EndChallenge.js';
import RedirectChallenge from './RedirectChallenge.js';
import GainGold from './GainGold.js';
import GainIcon from './GainIcon.js';
import GainPower from './GainPower.js';
import HandlerGameActionWrapper from './HandlerGameActionWrapper.js';
import IfGameAction from './IfGameAction.js';
import InitiateWhenRevealed from './InitiateWhenRevealed.js';
import Kill from './Kill.js';
import KneelCard from './KneelCard.js';
import LookAtDeck from './LookAtDeck.js';
import LookAtHand from './LookAtHand.js';
import lookAtShadows from './LookAtShadows.js';
import LoseIcon from './LoseIcon.js';
import MayGameAction from './MayGameAction.js';
import MovePower from './MovePower.js';
import NameCard from './NameCard.js';
import NameTrait from './NameTrait.js';
import PayGold from './PayGold.js';
import PlaceAsDuplicate from './PlaceAsDuplicate.js';
import MarshalAsDuplicate from './MarshalAsDuplicate.js';
import PlaceCard from './PlaceCard.js';
import PlaceCardUnderneath from './PlaceCardUnderneath.js';
import PlaceToken from './PlaceToken.js';
import PutIntoShadows from './PutIntoShadows.js';
import PutIntoPlay from './PutIntoPlay.js';
import RemoveFromChallenge from './RemoveFromChallenge.js';
import RemoveFromGame from './RemoveFromGame.js';
import ReplaceEvent from './ReplaceEvent.js';
import ReturnCardToDeck from './ReturnCardToDeck.js';
import ReturnCardToHand from './ReturnCardToHand.js';
import ReturnGoldToTreasury from './ReturnGoldToTreasury.js';
import RevealCards from './RevealCards.js';
import RevealNewPlot from './RevealNewPlot.js';
import RevealTopCards from './RevealTopCards.js';
import SacrificeCard from './SacrificeCard.js';
import SaveCard from './SaveCard.js';
import Search from './Search.js';
import SetFirstPlayer from './SetFirstPlayer.js';
import Shuffle from './Shuffle.js';
import ShuffleIntoDeck from './ShuffleIntoDeck.js';
import SimultaneousAction from './SimultaneousAction.js';
import StandCard from './StandCard.js';
import SwitchCards from './SwitchCards.js';
import TakeControl from './TakeControl.js';
import TransferGold from './TransferGold.js';

const GameActions = {
    addPhase: (props) => new AbilityAdapter(AddPhase, props),
    addToChallenge: (props) => new AbilityAdapter(AddToChallenge, props),
    addToHand: (props) => new AbilityAdapter(AddToHand, props),
    applyClaim: (props) => new AbilityAdapter(ApplyClaim, props),
    attach: (props) => new AbilityAdapter(Attach, props),
    cancelEffects: (props) => new AbilityAdapter(CancelEffects, props),
    changeClaimType: (props) => new AbilityAdapter(ChangeClaimType, props),
    changeEventAmount: (props) => new AbilityAdapter(ChangeEventAmount, props),
    checkReserve: (props) => new AbilityAdapter(CheckReserve, props),
    choose: (props) => new ChooseGameAction(props),
    chooseChallengeType: (props) => new ChooseChallengeType(props),
    chooseIcon: (props) => new ChooseIcon(props),
    chooseCards: (props) => new AbilityAdapter(new ChooseCards(props), (context) => ({ context })),
    delayedEffect: (props) => new AddDelayedEffect(props),
    determineDominance: (props) => new AbilityAdapter(DetermineDominance, props),
    discardAtRandom: (props) => new AbilityAdapter(DiscardAtRandom, props),
    discardCard: (props) => new AbilityAdapter(DiscardCard, props),
    discardToken: (props) => new AbilityAdapter(DiscardToken, props),
    discardTopCards: (props) => new AbilityAdapter(DiscardTopCards, props),
    discardPower: (props) => new AbilityAdapter(DiscardPower, props),
    drawCards: (props) => new AbilityAdapter(DrawCards, props),
    drawSpecific: (props) => new AbilityAdapter(DrawSpecific, props),
    endChallenge: (props) => new AbilityAdapter(EndChallenge, props),
    redirectChallenge: (props) => new AbilityAdapter(RedirectChallenge, props),
    gainGold: (props) => new AbilityAdapter(GainGold, props),
    gainIcon: (props) => new AbilityAdapter(GainIcon, props),
    gainPower: (props) => new AbilityAdapter(GainPower, props),
    genericHandler: (handler) => new HandlerGameActionWrapper({ handler }),
    ifCondition: (props) => new IfGameAction(props),
    initiateWhenRevealed: (props) => new AbilityAdapter(InitiateWhenRevealed, props),
    kill: (props) => new AbilityAdapter(Kill, props),
    kneelCard: (props) => new AbilityAdapter(KneelCard, props),
    lastingEffect: (propertyFactory) => new ApplyLastingEffect(propertyFactory),
    lookAtDeck: (props) => new AbilityAdapter(LookAtDeck, props),
    lookAtHand: (props) => new AbilityAdapter(LookAtHand, props),
    lookAtShadows: (props) => new AbilityAdapter(lookAtShadows, props),
    loseIcon: (props) => new AbilityAdapter(LoseIcon, props),
    may: (props) => new MayGameAction(props),
    movePower: (props) => new AbilityAdapter(MovePower, props),
    nameCard: (props) => new NameCard(props),
    nameTrait: (props) => new NameTrait(props),
    payGold: (props) => new AbilityAdapter(PayGold, props),
    placeAsDuplicate: (props) => new AbilityAdapter(PlaceAsDuplicate, props),
    marshalAsDuplicate: (props) => new AbilityAdapter(MarshalAsDuplicate, props),
    placeCard: (props) => new AbilityAdapter(PlaceCard, props),
    placeCardUnderneath: (props) => new AbilityAdapter(PlaceCardUnderneath, props),
    placeToken: (props) => new AbilityAdapter(PlaceToken, props),
    putIntoPlay: (props) => new AbilityAdapter(PutIntoPlay, props),
    putIntoShadows: (props) => new AbilityAdapter(PutIntoShadows, props),
    removeFromChallenge: (props) => new AbilityAdapter(RemoveFromChallenge, props),
    removeFromGame: (props) => new AbilityAdapter(RemoveFromGame, props),
    replaceEvent: (props) => new AbilityAdapter(ReplaceEvent, props),
    returnCardToDeck: (props) => new AbilityAdapter(ReturnCardToDeck, props),
    returnCardToHand: (props) => new AbilityAdapter(ReturnCardToHand, props),
    returnGoldToTreasury: (props) => new AbilityAdapter(ReturnGoldToTreasury, props),
    revealCards: (props) => new AbilityAdapter(RevealCards, props),
    revealNewPlot: (props) => new AbilityAdapter(RevealNewPlot, props),
    revealTopCards: (props) => new AbilityAdapter(RevealTopCards, props),
    sacrificeCard: (props) => new AbilityAdapter(SacrificeCard, props),
    saveCard: (props) => new AbilityAdapter(SaveCard, props),
    search: (props) => new AbilityAdapter(new Search(props), (context) => ({ context })),
    setFirstPlayer: (props) => new AbilityAdapter(SetFirstPlayer, props),
    shuffle: (props) => new AbilityAdapter(Shuffle, props),
    shuffleIntoDeck: (props) => new AbilityAdapter(ShuffleIntoDeck, props),
    simultaneously: function (actions) {
        return new SimultaneousAction(actions);
    },
    standCard: (props) => new AbilityAdapter(StandCard, props),
    switch: (props) => new AbilityAdapter(SwitchCards, props),
    takeControl: (props) => new AbilityAdapter(TakeControl, props),
    transferGold: (props) => new AbilityAdapter(TransferGold, props)
};

export default GameActions;
