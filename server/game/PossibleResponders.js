import DeckValidator from '../../deck-helper/DeckValidator.js';
import cards from './cards/index.js';

const HiddenZones = ['hand', 'shadows', 'draw deck'];
const ListenerMethods = ['on', 'once', 'addListener', 'prependListener', 'removeListener', 'off'];

/**
 * Works out whether a player could have something to respond with from a hidden zone, using only
 * information their opponents can see. A player's candidates are phantom copies of every
 * implemented card their faction and agendas allow, checked in each hidden zone they have a
 * triggered ability usable from. Phantoms are not part of the game and listen for nothing.
 *
 * The check is deliberately generous: it asks whether the ability triggers, isn't blank, and
 * (for events) whether the player has the gold to pay the printed cost. It doesn't check other
 * costs or targets, which could depend on the contents of the player's hand.
 */
class PossibleResponders {
    constructor(game, { cardData = game.cardData } = {}) {
        this.game = game;
        this.cardData = Array.isArray(cardData) ? cardData : Object.values(cardData || {});
        this.candidatesByPlayer = new Map();
    }

    couldRespond(player, abilityType, event) {
        const eventNames = new Set(event.getConcurrentEvents().map((e) => e.name));
        const candidates = this.getCandidates(player);

        return [...eventNames].some((name) =>
            (candidates.get(name) || []).some(
                (candidate) =>
                    candidate.ability.eventType === abilityType &&
                    this.couldTrigger(candidate, player, event)
            )
        );
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

    buildCandidates(player) {
        const rules = this.getDeckRules(player);
        const byEventName = new Map();

        for (const cardData of this.cardData) {
            const cardClass = cards[cardData.code];
            if (!cardClass || !rules.mayInclude(cardData) || rules.cannotInclude(cardData)) {
                continue;
            }

            const phantom = this.createPhantom(player, cardClass, cardData);
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
