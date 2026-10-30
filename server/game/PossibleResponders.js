import DeckValidator from '../../deck-helper/DeckValidator.js';
import AbilityContext from './AbilityContext.js';
import CardAction from './cardaction.js';
import cards from './cards/index.js';
import { Requirements } from './Constants/index.js';
import AmbushCardAction from './PlayActions/AmbushCardAction.js';

const HiddenZones = ['hand', 'shadows', 'draw deck'];
const ActionZones = ['hand', 'shadows'];
const UnknownReasons = [
    Requirements.facedown,
    Requirements.location,
    Requirements.noEffect,
    Requirements.target
];
const ListenerMethods = ['on', 'once', 'addListener', 'prependListener', 'removeListener', 'off'];

class PossibleResponders {
    constructor(game, { cardData = game.cardData } = {}) {
        this.game = game;
        this.cardData = Array.isArray(cardData) ? cardData : Object.values(cardData || {});
        this.phantomsByPlayer = new Map();
        this.candidatesByPlayer = new Map();
        this.actionCandidatesByPlayer = new Map();
        this.errors = [];
    }

    couldRespond(player, abilityType, event) {
        const eventNames = new Set(event.getConcurrentEvents().map((e) => e.name));
        const candidates = this.getCandidates(player);

        return [...eventNames].some((name) =>
            (candidates.get(name) || []).some(
                (candidate) =>
                    candidate.ability.eventType === abilityType &&
                    this.safelyCouldTrigger(candidate, player, event)
            )
        );
    }

    safelyCouldTrigger(candidate, player, event) {
        try {
            return this.couldTrigger(candidate, player, event);
        } catch (error) {
            this.errors.push({ code: candidate.ability.card.code, error });
            return true;
        }
    }

    couldTrigger({ ability, zone }, player, event) {
        const card = ability.card;
        card.location = zone;
        card.facedown = zone !== 'hand';

        const context = ability.createContext(event);
        if (context.player !== player || card.isAnyBlank()) {
            return false;
        }

        if (!ability.isTriggeredByContext(context)) {
            return false;
        }

        if (card.getPrintedType() === 'event') {
            const cost = card.getPrintedCost();
            return (typeof cost === 'number' ? cost : 0) <= player.gold;
        }

        return true;
    }

    getCandidates(player) {
        if (!this.candidatesByPlayer.has(player)) {
            this.candidatesByPlayer.set(player, this.buildCandidates(player));
        }

        return this.candidatesByPlayer.get(player);
    }

    couldAct(player) {
        const zones = ActionZones.filter((zone) => player.getSourceList(zone).length > 0);

        return this.getActionCandidates(player).some(
            (candidate) => zones.includes(candidate.zone) && this.safelyCouldAct(candidate, player)
        );
    }

    safelyCouldAct(candidate, player) {
        try {
            return this.couldUseAction(candidate, player);
        } catch (error) {
            this.errors.push({ code: candidate.card.code, error });
            return true;
        }
    }

    couldUseAction({ action, card, zone }, player) {
        card.location = zone;
        card.facedown = zone !== 'hand';

        const context = new AbilityContext({
            ability: action,
            game: this.game,
            player,
            source: card
        });
        const isCardInPlayableLocation = player.isCardInPlayableLocation;
        player.isCardInPlayableLocation = (target, playingType) =>
            target === card || isCardInPlayableLocation.call(player, target, playingType);

        let reason;
        try {
            reason = action.getUnresolvableReason(context);
        } finally {
            delete player.isCardInPlayableLocation;
        }

        if (!reason || UnknownReasons.includes(reason)) {
            return true;
        }

        return (
            reason === Requirements.cost && this.getGoldCost(action, card, player) <= player.gold
        );
    }

    getGoldCost(action, card, player) {
        const playingType = action instanceof AmbushCardAction ? 'ambush' : 'play';
        const cost = playingType === 'ambush' ? card.getAmbushCost() : card.getPrintedCost();
        if (playingType === 'play' && card.getPrintedType() !== 'event') {
            return 0;
        }

        const printed = typeof cost === 'number' ? cost : 0;
        return Math.max(0, printed - player.getCostReduction(playingType, card));
    }

    getActionCandidates(player) {
        if (!this.actionCandidatesByPlayer.has(player)) {
            this.actionCandidatesByPlayer.set(player, this.buildActionCandidates(player));
        }

        return this.actionCandidatesByPlayer.get(player);
    }

    buildActionCandidates(player) {
        const candidates = [];

        for (const card of this.getPhantoms(player)) {
            const actions = new Set([...card.abilities.actions, ...card.getPlayActions()]);
            for (const action of actions) {
                for (const zone of ActionZones.filter((zone) =>
                    this.isActionUsableFrom(action, card, zone)
                )) {
                    candidates.push({ action, card, zone });
                }
            }
        }

        return candidates;
    }

    isActionUsableFrom(action, card, zone) {
        if (action instanceof AmbushCardAction) {
            return zone === 'hand' && card.isAmbush();
        }

        if (!(action instanceof CardAction)) {
            return false;
        }

        return card.getPrintedType() === 'event' || action.location === zone;
    }

    getPhantoms(player) {
        if (!this.phantomsByPlayer.has(player)) {
            this.phantomsByPlayer.set(player, this.buildPhantoms(player));
        }

        return this.phantomsByPlayer.get(player);
    }

    buildPhantoms(player) {
        const rules = this.getDeckRules(player);
        const phantoms = [];

        for (const cardData of this.cardData) {
            const cardClass = cards[cardData.code];
            if (!cardClass || !rules.mayInclude(cardData) || rules.cannotInclude(cardData)) {
                continue;
            }

            try {
                phantoms.push(this.createPhantom(player, cardClass, cardData));
            } catch (error) {
                this.errors.push({ code: cardData.code, error });
            }
        }

        return phantoms;
    }

    buildCandidates(player) {
        const byEventName = new Map();

        for (const phantom of this.getPhantoms(player)) {
            for (const ability of phantom.abilities.reactions) {
                if (ability.isForcedAbility()) {
                    continue;
                }

                for (const zone of HiddenZones.filter((zone) => this.isUsableFrom(ability, zone))) {
                    for (const trigger of ability.abilityTriggers) {
                        if (!byEventName.has(trigger.eventName)) {
                            byEventName.set(trigger.eventName, []);
                        }
                        byEventName.get(trigger.eventName).push({ ability, zone });
                    }
                }
            }
        }

        return byEventName;
    }

    isUsableFrom(ability, zone) {
        if (ability.isPlayableEventAbility()) {
            return zone === 'hand';
        }

        return ability.location.includes(zone);
    }

    getDeckRules(player) {
        const validator = new DeckValidator([], 'joust');
        return validator.getRules({
            faction: { value: player.faction.cardData.code || '' },
            agendas: (player.agendas || []).map((agenda) => ({ code: agenda.code }))
        });
    }

    createPhantom(player, cardClass, cardData) {
        const phantomGame = Object.create(this.game);
        for (const method of ListenerMethods) {
            phantomGame[method] = () => phantomGame;
        }

        const game = player.game;
        player.game = phantomGame;
        player.registerAbilityMax = () => undefined;

        try {
            return new cardClass(player, cardData);
        } finally {
            player.game = game;
            delete player.registerAbilityMax;
        }
    }
}

export default PossibleResponders;
