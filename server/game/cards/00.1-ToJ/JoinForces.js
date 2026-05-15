import AgendaCard from '../../agendacard.js';

class JoinForces extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onDecksPrepared']);
    }

    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceFirstMarshalledOrPlayedCardCostEachRound(
                1,
                (card) => this.namedTrait && card.hasTrait(this.namedTrait)
            )
        });
    }

    onDecksPrepared() {
        let traitsInDeck = [];
        let hasOutOfFactionCards = false;
        // find common traits among non-neutral, out of faction cards in the deck
        for (const card of this.game.allCards) {
            if (
                card.owner !== this.owner ||
                card.getPrintedFaction() === this.controller.getFaction() ||
                card.getPrintedFaction() === 'neutral' ||
                ['agenda', 'faction'].includes(card.getType())
            ) {
                continue;
            }

            hasOutOfFactionCards = true;

            let traits = card.getTraits();
            if (traitsInDeck.length === 0) {
                traitsInDeck.push(...traits);
            } else {
                traitsInDeck = traitsInDeck.filter((trait) => traits.includes(trait));
                if (traitsInDeck.length === 0) {
                    break;
                }
            }
        }

        if (traitsInDeck.length === 1) {
            this.namedTrait = traitsInDeck[0];
            this.addTraitMessage(this.controller, this.namedTrait);
        } else if (!hasOutOfFactionCards || traitsInDeck.length > 1) {
            // if no out of faction cards are present or if there are multiple common traits,
            // prompt the player to choose a trait manually
            this.game.promptWithMenu(this.owner, this, {
                activePrompt: {
                    menuTitle: 'Name a trait',
                    controls: [
                        { type: 'trait-name', command: 'menuButton', method: 'selectTraitName' }
                    ]
                },
                source: this
            });
        } else {
            this.game.addAlert(
                'danger',
                "{0}'s deck does not share a common trait to name with {1}",
                this.controller,
                this
            );
        }
    }

    capitalize(string) {
        return string.replace(/\b\w/g, (char) => char.toUpperCase());
    }

    selectTraitName(player, traitName) {
        this.namedTrait = traitName;
        this.addTraitMessage(player, traitName);

        return true;
    }

    addTraitMessage(player, traitName) {
        this.game.addMessage(
            '{0} names {1} as their trait for {2}',
            player,
            this.capitalize(traitName),
            this
        );
    }
}

JoinForces.code = '00366';

export default JoinForces;
