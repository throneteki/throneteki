import DeckValidator from '../../deck-helper/DeckValidator.js';
import cards from './cards/index.js';

const HiddenZones = ['hand', 'shadows', 'draw deck'];
const ListenerMethods = ['on', 'once', 'addListener', 'prependListener', 'removeListener', 'off'];

class PossibleResponders {
    constructor(game, { cardData = game.cardData } = {}) {
        this.game = game;
        this.cardData = Array.isArray(cardData) ? cardData : Object.values(cardData || {});
        this.phantomsByPlayer = new Map();
        this.candidatesByPlayer = new Map();
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
